<?php
// api/admin_participants.php - Participant Management & Attendance API
require_once '../config/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

$action = $_GET['action'] ?? $_POST['action'] ?? 'list';

try {
    if ($action === 'list') {
        $search = trim($_GET['search'] ?? '');
        $collegeFilter = trim($_GET['college'] ?? '');
        $deptFilter = trim($_GET['dept'] ?? '');
        $statusFilter = trim($_GET['status'] ?? ''); // checked_in / not_checked_in

        $sql = "SELECT r.*, 
                    GROUP_CONCAT(DISTINCT re.event_name SEPARATOR ', ') as event_names,
                    (SELECT COUNT(*) FROM team_members tm WHERE tm.registration_id = r.registration_id) as total_teammates
                FROM registrations r 
                LEFT JOIN registered_events re ON r.registration_id = re.registration_id 
                WHERE 1=1";
        
        $params = [];

        if (!empty($search)) {
            $sql .= " AND (r.registration_id LIKE ? OR r.leader_name LIKE ? OR r.leader_phone LIKE ? OR r.leader_email LIKE ? OR r.college_name LIKE ? OR r.team_name LIKE ?)";
            $term = "%$search%";
            $params = array_merge($params, [$term, $term, $term, $term, $term, $term]);
        }

        if (!empty($collegeFilter)) {
            $sql .= " AND r.college_name = ?";
            $params[] = $collegeFilter;
        }

        if (!empty($deptFilter)) {
            $sql .= " AND r.department = ?";
            $params[] = $deptFilter;
        }

        if ($statusFilter === 'checked_in') {
            $sql .= " AND r.qr_used = 1";
        } else if ($statusFilter === 'not_checked_in') {
            $sql .= " AND r.qr_used = 0";
        }

        $sql .= " GROUP BY r.id ORDER BY r.id DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $participants = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate Overview Stats
        $totalCount = count($participants);
        $totalCheckedIn = 0;
        foreach ($participants as $p) {
            if ($p['qr_used']) $totalCheckedIn++;
        }

        echo json_encode([
            'success' => true,
            'participants' => $participants,
            'stats' => [
                'total_registrations' => $totalCount,
                'checked_in' => $totalCheckedIn,
                'remaining' => $totalCount - $totalCheckedIn
            ]
        ]);
        exit();
    }

    if ($action === 'reset_qr') {
        $input = json_decode(file_get_contents('php://input'), true);
        $regId = $input['registration_id'] ?? '';
        
        if ($regId) {
            $stmt = $pdo->prepare("UPDATE registrations SET qr_used = 0, qr_used_time = NULL, scanned_by = NULL, scan_location = NULL WHERE registration_id = ?");
            $stmt->execute([$regId]);
            echo json_encode(['success' => true, 'message' => "QR status for $regId reset to unused."]);
            exit();
        }
    }

    if ($action === 'delete') {
        $input = json_decode(file_get_contents('php://input'), true);
        $regId = $input['registration_id'] ?? '';
        
        if ($regId) {
            $stmt = $pdo->prepare("DELETE FROM registrations WHERE registration_id = ?");
            $stmt->execute([$regId]);
            echo json_encode(['success' => true, 'message' => "Participant $regId deleted successfully."]);
            exit();
        }
    }

} catch (\PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
