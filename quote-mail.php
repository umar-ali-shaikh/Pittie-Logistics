<?php
header('Content-Type: application/json');
$config = require __DIR__.'/config.php';

// ================= CONFIG =================

// Fallback values (LOCAL / DEV safety)
$smtpHost   = $config['SMTP_HOST'];
$smtpUser   = $config['SMTP_USER'];
$smtpPass   = $config['SMTP_PASS'];
$smtpPort   = $config['SMTP_PORT'];
$smtpSecure = $config['SMTP_SECURE'];

if (!$smtpHost || !$smtpUser || !$smtpPass) {
    echo json_encode([
        'success' => false,
        'message' => 'Server configuration missing'
    ]);
    exit;
}

// ==========================================

require_once __DIR__ . '/PHPMailer/src/Exception.php';
require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function respond($status, $msg) {
    echo json_encode([
        'success' => $status,
        'message' => $msg
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request.');
}

if (
    empty($_POST['full_name']) ||
    empty($_POST['phone']) ||
    empty($_POST['email'])
) {
    respond(false, 'Required fields are missing.');
}

$name     = trim($_POST['full_name']);
$phone    = trim($_POST['phone']);
$email    = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
$company  = trim($_POST['company'] ?? 'Not Provided');
$formType = trim($_POST['form_type'] ?? 'website');

if (!$email) {
    respond(false, 'Invalid email address.');
}

$subject = match ($formType) {
    'home'    => 'New Inquiry From Home Page',
    'contact' => 'New Inquiry From Contact Page',
    default   => 'New Website Inquiry',
};

try {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = $smtpSecure;
    $mail->Port       = $smtpPort;

    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ];

    $mail->setFrom($smtpUser, 'Pittie Logistics Website');
    $mail->addAddress($smtpUser);

    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = "
        <h3>Get a Quote Form Request</h3>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Company:</strong> {$company}</p>
        <p><strong>Date:</strong> ".date('d M Y - h:i A')."</p>
    ";

    $mail->AltBody = "New Inquiry from {$name}";
    $mail->send();

    respond(true, 'Message sent successfully!');
} catch (Exception $e) {
    respond(false, 'Mailer error');
}
