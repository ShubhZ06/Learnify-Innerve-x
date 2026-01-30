import styles from './ImpactCard.module.css';

export default function ImpactCard() {
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>This Month's Impact</h3>

            <div className={styles.stats}>
                <div className={styles.statItem}>
                    <div className={styles.statIcon} style={{ background: '#eff6ff' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#3b82f6" strokeWidth="2" />
                            <path d="M8 10h8M8 14h5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>12</span>
                        <span className={styles.statLabel}>Worksheets Created</span>
                    </div>
                </div>

                <div className={styles.statItem}>
                    <div className={styles.statIcon} style={{ background: '#fef2f2' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#ef4444" strokeWidth="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>8 hrs</span>
                        <span className={styles.statLabel}>Planning Time Saved</span>
                    </div>
                </div>
            </div>

            <div className={styles.tip}>
                <div className={styles.tipIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#a855f7" />
                        <path d="M12 16v-4M12 8h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <div className={styles.tipContent}>
                    <span className={styles.tipTitle}>Teacher Tip</span>
                    <span className={styles.tipText}>Try creating flashcards for vocab!</span>
                </div>
                <svg className={styles.tipArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </div>
        </div>
    );
}
