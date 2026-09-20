<?php
// api/verifyQR.php - Verify QR Token from Webcam Scanner
require_once '../config/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$token = trim($input['token'] ?? '');
$admin_name = trim($input['admin_name'] ?? $input['scanned_by'] ?? 'Admin Scanner');
$gate = trim($input['gate'] ?? $input['scan_location'] ?? 'Gate #1 (Main Entrance)');

if (empty($token)) {
    echo json_encode(['status' => 'INVALID', 'message' => '❌ Invalid QR Code format. Token empty.']);
    exit();
}

try {
    // 1. Search in main registrations table (Leader QR Token)
    $stmt = $pdo->prepare("SELECT * FROM registrations WHERE qr_token = ?");
    $stmt->execute([$token]);
    $reg = $stmt->fetch();

    if ($reg) {
        if ($reg['qr_used']) {
            echo json_encode([
                'status' => 'ALREADY_USED',
                'message' => '❌ QR Already Used',
                'participant_name' => $reg['leader_name'],
                'registration_number' => $reg['registration_id'],
                'college' => $reg['college_name'],
                'department' => $reg['department'],
                'scanned_at' => $reg['qr_used_time'] ? date('h:i:s A - d M Y', strtotime($reg['qr_used_time'])) : 'N/A',
                'scanned_by' => $reg['scanned_by'] ?? 'Gate Admin',
                'gate' => $reg['scan_location'] ?? 'Gate #1'
            ]);
            exit();
        }

        // Fetch events for participant
        $evtStmt = $pdo->prepare("SELECT event_name FROM registered_events WHERE registration_id = ?");
        $evtStmt->execute([$reg['registration_id']]);
        $events = $evtStmt->fetchAll(PDO::FETCH_COLUMN);
        $eventList = implode(', ', $events);

        // Mark as Used
        $now = date('Y-m-d H:i:s');
        $update = $pdo->prepare("UPDATE registrations SET qr_used = 1, qr_used_time = ?, scanned_by = ?, scan_location = ? WHERE id = ?");
        $update->execute([$now, $admin_name, $gate, $reg['id']]);

        echo json_encode([
            'status' => 'APPROVED',
            'message' => '✅ ENTRY APPROVED',
            'participant_name' => $reg['leader_name'],
            'registration_number' => $reg['registration_id'],
            'college' => $reg['college_name'],
            'department' => $reg['department'],
            'event_category' => !empty($eventList) ? $eventList : 'Symposium Participant',
            'entry_status' => 'FIRST ENTRY',
            'scan_time' => date('h:i:s A', strtotime($now)),
            'gate' => $gate,
            'scanned_by' => $admin_name
        ]);
        exit();
    }

    // 2. Search in team_members table (Teammate QR Token)
    $stmtMem = $pdo->prepare("SELECT tm.*, r.college_name, r.department FROM team_members tm JOIN registrations r ON tm.registration_id = r.registration_id WHERE tm.member_qr_token = ?");
    $stmtMem->execute([$token]);
    $member = $stmtMem->fetch();

    if ($member) {
        if ($member['member_qr_used']) {
            echo json_encode([
                'status' => 'ALREADY_USED',
                'message' => '❌ QR Already Used',
                'participant_name' => $member['member_name'],
                'registration_number' => $member['registration_id'],
                'college' => $member['college_name'],
                'department' => $member['department'],
                'scanned_at' => $member['member_qr_used_time'] ? date('h:i:s A - d M Y', strtotime($member['member_qr_used_time'])) : 'N/A',
                'scanned_by' => 'Gate Admin',
                'gate' => $gate
            ]);
            exit();
        }

        // Fetch events for team
        $evtStmt = $pdo->prepare("SELECT event_name FROM registered_events WHERE registration_id = ?");
        $evtStmt->execute([$member['registration_id']]);
        $events = $evtStmt->fetchAll(PDO::FETCH_COLUMN);
        $eventList = implode(', ', $events);

        // Mark Teammate QR as Used
        $now = date('Y-m-d H:i:s');
        $updateMem = $pdo->prepare("UPDATE team_members SET member_qr_used = 1, member_qr_used_time = ? WHERE id = ?");
        $updateMem->execute([$now, $member['id']]);

        echo json_encode([
            'status' => 'APPROVED',
            'message' => '✅ ENTRY APPROVED',
            'participant_name' => $member['member_name'],
            'registration_number' => $member['registration_id'],
            'college' => $member['college_name'],
            'department' => $member['department'],
            'event_category' => !empty($eventList) ? $eventList : 'Symposium Participant',
            'entry_status' => 'FIRST ENTRY',
            'scan_time' => date('h:i:s A', strtotime($now)),
            'gate' => $gate,
            'scanned_by' => $admin_name
        ]);
        exit();
    }

    // Token Not Found
    echo json_encode([
        'status' => 'INVALID',
        'message' => '❌ Invalid QR Code. Token not recognized.'
    ]);

} catch (\PDOException $e) {
    echo json_encode(['status' => 'ERROR', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
