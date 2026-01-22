<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

// ================= CONFIG =================

$smtpHost = 'smtp.hostinger.com';
$smtpUser = 'info@pittieconsumer.com';
$smtpPass = 'Pittie@2025'; // CHANGE PASSWORD
$smtpPort = 465;
$smtpSecure = 'ssl';

$fromEmail = 'info@pittieconsumer.com';
$fromName  = 'Pittie Logistics Website';

$toEmail = 'info@pittieconsumer.com';
$toName  = 'Pittie Logistics Team';

// ==========================================

// PHPMailer Manual Include
require_once __DIR__.'/PHPMailer/src/Exception.php';
require_once __DIR__.'/PHPMailer/src/PHPMailer.php';
require_once __DIR__.'/PHPMailer/src/SMTP.php';

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

if (
    empty($_POST['full_name']) ||
    empty($_POST['phone']) ||
    empty($_POST['email']) ||
    empty($_POST['message'])
) {
    respond(false, "All fields are required.");
}

// Form Data
$name    = trim($_POST['full_name']);
$phone   = trim($_POST['phone']);
$email   = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
$message = trim($_POST['message']);
$company = isset($_POST['company']) ? trim($_POST['company']) : 'Not Provided';
$formType = $_POST['form_type'] ?? 'website';

if (!$email) {
    respond(false, "Invalid email address.");
}

// ================= SUBJECT BASED ON PAGE =================

if ($formType == "home") {
    $subject = "New Inquiry From Home Page";
}
elseif ($formType == "contact") {
    $subject = "New Inquiry From Contact Page";
}
else {
    $subject = "New Website Inquiry";
}

// ================= SEND EMAIL =================

try {

    $mail = new PHPMailer(true);

    // SMTP Setup
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUser;
    $mail->Password   = $smtpPass;
    $mail->SMTPSecure = $smtpSecure;
    $mail->Port       = $smtpPort;

    // Hostinger SSL Fix
    $mail->SMTPOptions = [
      'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
      ]
    ];

    // Mail Setup
    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($toEmail, $toName);

    $mail->isHTML(true);
    $mail->Subject = $subject;

    $body = "
        <h2>📦 New Logistics Website Inquiry</h2>

        <p><strong>From Page:</strong> {$formType}</p>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Company:</strong> {$company}</p>

        <p><strong>Message:</strong></p>
        <p>{$message}</p>

        <hr>

        <small>
          Pittie Logistics Official Website<br>
          Date: ".date('d M Y - h:i A')."
        </small>
    ";

    $mail->Body = $body;
    $mail->AltBody = strip_tags($body);

    $mail->send();

    respond(true, "Message sent successfully!");

} catch (Exception $e) {

    respond(false, "Mailer Error: " . $mail->ErrorInfo);

}
