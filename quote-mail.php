<?php
header('Content-Type: application/json');

// ================= CONFIG =================

$smtpHost = getenv('SMTP_HOST');
$smtpUser = getenv('SMTP_USER');
$smtpPass = getenv('SMTP_PASS');
$smtpPort = getenv('SMTP_PORT');
$smtpSecure = getenv('SMTP_SECURE');


$fromEmail = 'info@pittieconsumer.com';
$fromName  = 'Pittie Logistics Website';

$toEmail = 'info@pittieconsumer.com';
$toName  = 'Pittie Logistics Team';

// ==========================================

// PHPMailer Include
require_once __DIR__ . '/PHPMailer/src/Exception.php';
require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// JSON Response Helper
function respond($status, $msg) {
    echo json_encode([
        'success' => $status,
        'message' => $msg
    ]);
    exit;
}

// ================= VALIDATION =================

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

// ================= DATA =================

$name     = trim($_POST['full_name']);
$phone    = trim($_POST['phone']);
$email    = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
$company  = trim($_POST['company'] ?? 'Not Provided');
$formType = trim($_POST['form_type'] ?? 'website');

if (!$email) {
    respond(false, 'Invalid email address.');
}

// ================= SUBJECT =================

switch ($formType) {
    case 'home':
        $subject = 'New Inquiry From Home Page';
        break;
    case 'contact':
        $subject = 'New Inquiry From Contact Page';
        break;
    default:
        $subject = 'New Website Inquiry';
}

// ================= SEND MAIL =================

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

    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($toEmail, $toName);

    $mail->isHTML(true);
    $mail->Subject = $subject;

    $mail->Body = "
        <h3>New Website Inquiry</h3>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Company:</strong> {$company}</p>
        <p><strong>Form:</strong> {$formType}</p>
        <p><strong>Date:</strong> " . date('d M Y - h:i A') . "</p>
    ";

    $mail->AltBody = "New Inquiry from {$name}";

    $mail->send();

    respond(true, 'Message sent successfully.');

} catch (Exception $e) {
    respond(false, 'Mail could not be sent.');
}
