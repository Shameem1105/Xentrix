<?php
// api/events.php - Fetch master event list from database

require_once '../config/db.php';

try {
    $stmt = $pdo->query("SELECT * FROM events_master WHERE is_active = 1 ORDER BY category ASC, name ASC");
    $events = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'count' => count($events),
        'events' => $events
    ]);
} catch (\PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch events: ' . $e->getMessage()
    ]);
}
?>
