import styles from './RecentCreations.module.css';

export default function RecentCreations() {
    // No mock data - will be fetched from MongoDB in the future
    const creations: any[] = [];

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Recent Creations</h2>
                <button className={styles.viewAllBtn}>View All</button>
            </div>

            <div className={styles.grid}>
                {creations.length === 0 ? (
                    <p style={{
                        textAlign: 'center',
                        color: '#6b7280',
                        padding: '2rem',
                        gridColumn: '1 / -1'
                    }}>
                        No recent creations yet. Start creating content for your students!
                    </p>
                ) : (
                    creations.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.icon} style={{ background: item.iconBg }}>
                                    {item.icon}
                                </div>
                                <button className={styles.menuBtn}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="6" r="1" />
                                        <circle cx="12" cy="12" r="1" />
                                        <circle cx="12" cy="18" r="1" />
                                    </svg>
                                </button>
                            </div>

                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.cardMeta}>{item.meta}</p>

                            <div className={styles.tags}>
                                {item.tags.map((tag: string) => (
                                    <span key={tag} className={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
