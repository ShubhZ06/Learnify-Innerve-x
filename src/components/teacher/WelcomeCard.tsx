import styles from './WelcomeCard.module.css';

export default function WelcomeCard() {
    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    Welcome back,
                    <br />
                    <span className={styles.name}>Ramesh Sir!</span>
                </h1>
                <p className={styles.subtitle}>Ready to inspire your students today?</p>

                <div className={styles.badge}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#22c55e" />
                        <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>You've saved 23 hours this month using AI.</span>
                </div>
            </div>

            <div className={styles.illustration}>
                <div className={styles.illustrationBox}>
                    <span className={styles.teacherLabel}>TEACHER</span>
                    <div className={styles.plantDecor}>
                        <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
                            <path d="M20 50V25" stroke="#22c55e" strokeWidth="2" />
                            <ellipse cx="20" cy="20" rx="15" ry="20" fill="#22c55e" opacity="0.3" />
                            <ellipse cx="15" cy="15" rx="8" ry="12" fill="#22c55e" opacity="0.5" />
                            <ellipse cx="25" cy="18" rx="6" ry="10" fill="#22c55e" opacity="0.4" />
                        </svg>
                    </div>
                    <div className={styles.pencils}>
                        <div className={styles.pencil} style={{ background: '#f59e0b' }}></div>
                        <div className={styles.pencil} style={{ background: '#22c55e' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
