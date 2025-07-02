const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ece_lab_db'
});

exports.getDashboardData = async (req, res) => {
    try {
        // Active Users
        const [userCounts] = await db.promise().query(`
            SELECT 
                SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) AS students,
                SUM(CASE WHEN role = 'lecturer' THEN 1 ELSE 0 END) AS lecturers,
                SUM(CASE WHEN role = 'technician' THEN 1 ELSE 0 END) AS technicians,
                COUNT(*) AS total
            FROM users
            WHERE is_active = 1
        `);
        const activeUsers = {
            total: userCounts[0].total,
            students: userCounts[0].students,
            lecturers: userCounts[0].lecturers,
            technicians: userCounts[0].technicians
        };

        // Upcoming Sessions
        const [sessions] = await db.promise().query(`
            SELECT session_id, start_time
            FROM lab_sessions
            WHERE start_time >= NOW()
            ORDER BY start_time ASC
            LIMIT 1
        `);
        const [sessionCount] = await db.promise().query(`
            SELECT COUNT(*) AS count
            FROM lab_sessions
            WHERE start_time >= NOW()
        `);
        const upcomingSessions = {
            count: sessionCount[0].count,
            next_session: sessions[0] || null
        };

        // Equipment Status
        const [equipmentStats] = await db.promise().query(`
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN \`condition\` IN ('New', 'Good') THEN 1 ELSE 0 END) AS functional,
                SUM(CASE WHEN \`condition\` = 'Needs Repair' THEN 1 ELSE 0 END) AS needs_repair
            FROM equipment
        `);
        const equipmentStatus = {
            functional_percentage: equipmentStats[0].total > 0
                ? Math.round((equipmentStats[0].functional / equipmentStats[0].total) * 100)
                : 0,
            needs_repair: equipmentStats[0].needs_repair
        };

        // Recent Activity
        const [recentActivity] = await db.promise().query(`
            SELECT details, created_at
            FROM audit_logs
            ORDER BY created_at DESC
            LIMIT 5
        `);

        res.json({
            active_users: activeUsers,
            upcoming_sessions: upcomingSessions,
            equipment_status: equipmentStatus,
            recent_activity: recentActivity
        });
    } catch (err) {
        console.error('Dashboard data error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};