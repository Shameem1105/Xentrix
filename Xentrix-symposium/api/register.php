<?php
// api/register.php - Handle Symposium Registration Form Submission with QR Token Generation
require_once '../config/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid payload format.']);
    exit();
}

$team_name     = trim($input['teamName'] ?? 'Team Single');
$college_name  = trim($input['collegeName'] ?? '');
$department    = trim($input['department'] ?? '');
$year_of_study = trim($input['year'] ?? '');
$leader_name   = trim($input['leaderName'] ?? '');
$leader_email  = trim($input['leaderEmail'] ?? '');
$leader_phone  = trim($input['leaderPhone'] ?? '');
$members       = $input['members'] ?? [];
$events        = $input['selectedEvents'] ?? $input['events'] ?? [];
$total_amount  = floatval($input['totalAmount'] ?? 0);

// Mandatory Field Checks
if (empty($college_name) || empty($department) || empty($leader_name) || empty($leader_email) || empty($leader_phone)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required contact and college fields.']);
    exit();
}

if (!filter_var($leader_email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid Leader Email address format.']);
    exit();
}

if (!preg_match('/^[6-9]\d{9}$/', $leader_phone)) {
    echo json_encode(['success' => false, 'message' => 'Mobile Number must be a valid 10-digit number.']);
    exit();
}

if (empty($events)) {
    echo json_encode(['success' => false, 'message' => 'Please select at least one event to register.']);
    exit();
}

// Generate Cryptographically Secure Random QR Token (UUID format)
function generateUUIDToken() {
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // version 4
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // variant
    return strtoupper(vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4)));
}

try {
    // Check Duplicate Registration
    $checkReg = $pdo->prepare("SELECT registration_id FROM registrations WHERE leader_email = ? OR leader_phone = ?");
    $checkReg->execute([$leader_email, $leader_phone]);
    if ($checkReg->fetch()) {
        echo json_encode(['success' => false, 'message' => "The email ($leader_email) or phone ($leader_phone) is already registered for ZENTRIX '26."]);
        exit();
    }

    $pdo->beginTransaction();

    // Generate Registration ID (Format: SYM2026-101)
    $countStmt = $pdo->query("SELECT COUNT(*) as total FROM registrations");
    $rowCount = $countStmt->fetch()['total'] + 101;
    $reg_id = 'SYM2026-' . $rowCount;

    $leader_qr_token = generateUUIDToken();

    // Insert Main Registration Record
    $regStmt = $pdo->prepare("INSERT INTO registrations 
        (registration_id, team_name, college_name, department, year_of_study, leader_name, leader_email, leader_phone, total_amount, payment_status, qr_token) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Completed', ?)");
    
    $regStmt->execute([
        $reg_id,
        $team_name,
        $college_name,
        $department,
        $year_of_study,
        $leader_name,
        $leader_email,
        $leader_phone,
        $total_amount,
        $leader_qr_token
    ]);

    // Insert Team Members & Generate Individual Tokens
    $memStmt = $pdo->prepare("INSERT INTO team_members (registration_id, member_name, member_email, member_phone, member_qr_token) VALUES (?, ?, ?, ?, ?)");
    $created_members = [
        [
            'name' => $leader_name,
            'email' => $leader_email,
            'phone' => $leader_phone,
            'role' => 'Team Leader',
            'qr_token' => $leader_qr_token
        ]
    ];

    foreach ($members as $idx => $member) {
        $mName  = trim($member['name'] ?? '');
        $mEmail = trim($member['email'] ?? '');
        $mPhone = trim($member['phone'] ?? '');
        if (!empty($mName)) {
            $mToken = generateUUIDToken();
            $memStmt->execute([$reg_id, $mName, $mEmail, $mPhone, $mToken]);
            $created_members[] = [
                'name' => $mName,
                'email' => $mEmail,
                'phone' => $mPhone,
                'role' => 'Teammate #' . ($idx + 1),
                'qr_token' => $mToken
            ];
        }
    }

    // Insert Registered Events
    $evtStmt = $pdo->prepare("INSERT INTO registered_events (registration_id, event_id, event_name, category, event_fee) VALUES (?, ?, ?, ?, ?)");
    foreach ($events as $evt) {
        $evtStmt->execute([
            $reg_id,
            $evt['id'],
            $evt['name'],
            $evt['category'],
            floatval($evt['fee'])
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'registration_id' => $reg_id,
        'message' => 'Registration completed successfully.',
        'details' => [
            'registrationId' => $reg_id,
            'teamName' => $team_name,
            'collegeName' => $college_name,
            'department' => $department,
            'leaderName' => $leader_name,
            'leaderEmail' => $leader_email,
            'totalAmount' => $total_amount,
            'members' => $created_members,
            'events' => $events
        ]
    ]);

} catch (\PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
