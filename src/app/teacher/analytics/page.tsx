'use client';

import styles from './page.module.css';

const stats = [
    { label: 'Total Students', value: '128', change: '+12%', positive: true },
    { label: 'Avg. Score', value: '78%', change: '+5%', positive: true },
    { label: 'Completion Rate', value: '85%', change: '-2%', positive: false },
    { label: 'Active This Week', value: '94', change: '+8%', positive: true },
];

const topStudents = [
    { name: 'Priya Sharma', score: 95, progress: 95 },
    { name: 'Rahul Kumar', score: 92, progress: 92 },
    { name: 'Ananya Patel', score: 89, progress: 89 },
    { name: 'Vikram Singh', score: 87, progress: 87 },
];

export default function StudentAnalyticsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Student Analytics</h1>
                <p className={styles.subtitle}>Track student performance and engagement</p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <div key={index} className={styles.statCard}>
                        <p className={styles.statLabel}>{stat.label}</p>
                        <div className={styles.statValue}>
                            <span>{stat.value}</span>
                            <span className={`${styles.statChange} ${stat.positive ? styles.positive : styles.negative}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Top Students */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Top Performers</h2>
                <div className={styles.studentList}>
                    {topStudents.map((student, index) => (
                        <div key={index} className={styles.studentRow}>
                            <div className={styles.studentInfo}>
                                <div className={styles.rank}>#{index + 1}</div>
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                                    alt={student.name}
                                    className={styles.avatar}
                                />
                                <span className={styles.studentName}>{student.name}</span>
                            </div>
                            <div className={styles.progressWrapper}>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${student.progress}%` }} />
                                </div>
                                <span className={styles.score}>{student.score}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
