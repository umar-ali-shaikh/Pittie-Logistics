<?php
header('Content-Type: application/json');

// ================= CONFIG =================

$uploadDir = __DIR__ . '/uploads/resumes/';
$maxFileSize = 2 * 1024 * 1024; // 2MB

$smtpHost = 'smtp.hostinger.com';
$smtpUser = 'info@pittieconsumer.com';
$smtpPass = 'Pittie@2025';
$smtpPort = 465;
$smtpSecure = 'ssl';

$fromEmail = 'info@pittieconsumer.com';
$fromName  = 'Website Contact Form';

$toEmail = 'info@pittieconsumer.com';
$toName  = 'Pittie Logistics Team';


// =========================================

require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function respond($status, $msg) {
    echo json_encode(['success'=>$status,'message'=>$msg]);
    exit;
}

// ============== VALIDATION =================

if (
    empty($_POST['full_name']) ||
    empty($_POST['email']) ||
    empty($_POST['job_role']) ||
    empty($_POST['location'])
) {
    respond(false,"All fields are required.");
}

$name = trim($_POST['full_name']);
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
$job = trim($_POST['job_role']);
$location = trim($_POST['location']);

if(!$email){
    respond(false,"Invalid email address.");
}

// ============== FILE CHECK =================

if (!isset($_FILES['resume']) || $_FILES['resume']['error'] !== UPLOAD_ERR_OK) {
    respond(false,"Resume upload failed.");
}

$file = $_FILES['resume'];

if ($file['size'] > $maxFileSize) {
    respond(false,"Resume must be under 2MB.");
}

$allowed = ['pdf','doc','docx'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowed)) {
    respond(false,"Only PDF, DOC, DOCX allowed.");
}

// Create directory
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Save file
$newName = time().'_'.$file['name'];
$path = $uploadDir.$newName;

if (!move_uploaded_file($file['tmp_name'], $path)) {
    respond(false,"Failed to save resume.");
}

// ============== EMAIL SEND =================

try {

    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPass;
    $mail->SMTPSecure = $smtpSecure;
    $mail->Port = $smtpPort;

    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($toEmail, $toName);
    $mail->addReplyTo($email, $name);

    $mail->addAttachment($path, $file['name']);

    $mail->isHTML(true);
    $mail->Subject = "New Job Application - Logistics Website";

    $body = "
      <h2>New Career Application</h2>
      <p><strong>Name:</strong> $name</p>
      <p><strong>Email:</strong> $email</p>
      <p><strong>Job Role:</strong> $job</p>
      <p><strong>Location:</strong> $location</p>
      <p><strong>Resume File:</strong> $newName</p>
   
        <p><strong>Message:</strong></p>
        <p>{$message}</p>
        
      <hr>
      <small>Submitted from Logistics Website Careers Page</small>
    ";

    $mail->Body = $body;
    $mail->AltBody = strip_tags($body);

    $mail->send();

    respond(true,"Application submitted successfully!");

} catch (Exception $e) {

    respond(false,"Mailer Error: ".$mail->ErrorInfo);

}
