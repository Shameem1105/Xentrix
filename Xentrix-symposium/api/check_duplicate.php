<?php
// api/check_duplicate.php - Quick check for existing email or phone

require_once '../config/db.php';

$email = trim($_GET['email'] ?? '');
$phone = trim($_GET['phone'] ?? '');

if (empty($email) && empty($phone)) {
    echo json_encode(['exists' => false]);
    exit();
}

$stmt = $pdo->prepare("SELECT registration_id FROM registrations WHERE leader_email = ? OR leader_phone = ?");
$stmt->execute([$email, $phone]);
$record = $stmt->fetch();

if ($record) {
    echo json_encode([
        'exists' => true,
        'registration_id' => $record['registration_id'],
        'message' => 'Email or Phone is already registered.'
    ]);
} else {
    echo json_encode(['exists' => false]);
}
?>
