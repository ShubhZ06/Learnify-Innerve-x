'use client';

import styles from './page.module.css';

export default function ProfilePage() {
    return (
        <div className={styles.container}>
            <div className={styles.profileHeader}>
                <div className={styles.avatarSection}>
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher"
                        alt="Profile"
                        className={styles.avatar}
                    />
                    <button className={styles.changeBtn}>Change Photo</button>
                </div>
                <div className={styles.infoSection}>
                    <h1 className={styles.name}>Dr. Rajesh Kumar</h1>
                    <p className={styles.role}>Senior Mathematics Teacher</p>
                    <div className={styles.badges}>
                        <span className={styles.badge}>Verified</span>
                        <span className={styles.badge}>5+ Years</span>
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {/* Personal Information */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Personal Information</h2>
                    <div className={styles.fieldGroup}>
                        <div className={styles.field}>
                            <label>Full Name</label>
                            <p>Dr. Rajesh Kumar</p>
                        </div>
                        <div className={styles.field}>
                            <label>Email</label>
                            <p>rajesh.kumar@shiksha.ai</p>
                        </div>
                        <div className={styles.field}>
                            <label>Phone</label>
                            <p>+91 98765 43210</p>
                        </div>
                        <div className={styles.field}>
                            <label>Department</label>
                            <p>Mathematics</p>
                        </div>
                    </div>
                    <button className="btn btn-outline">Edit Profile</button>
                </div>

                {/* Teaching Stats */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Teaching Statistics</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>5</span>
                            <span className={styles.statLabel}>Active Classes</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>128</span>
                            <span className={styles.statLabel}>Total Students</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>42</span>
                            <span className={styles.statLabel}>Resources Created</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>4.8</span>
                            <span className={styles.statLabel}>Avg Rating</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
