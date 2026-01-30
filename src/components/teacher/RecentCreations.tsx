import styles from './RecentCreations.module.css';

const creations = [
    {
        id: 1,
        title: 'Math Quiz: Fractions',
        type: 'quiz',
        meta: 'Class 5 • 10 Questions • Yesterday',
        tags: ['PDF', 'Key'],
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="2" fill="#3b82f6" />
                <path d="M9 9h6M9 12h4M9 15h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        iconBg: '#eff6ff'
    },
    {
        id: 2,
        title: 'Sci WS: Plants',
        type: 'worksheet',
        meta: 'Class 4 • 2 Pages • 2 days ago',
        tags: ['Printable'],
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" fill="#22c55e" />
                <path d="M12 8v4l2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        iconBg: '#f0fdf4'
    },
    {
        id: 3,
        title: 'Eng Audio: Pronunciation',
        type: 'audio',
        meta: 'Class 6 • 5 mins • 3 days ago',
        tags: ['MP3'],
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="6" width="14" height="12" rx="2" fill="#6366f1" />
                <path d="M9 15V9l6 3-6 3z" fill="white" />
            </svg>
        ),
        iconBg: '#eef2ff'
    }
];

export default function RecentCreations() {
    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Recent Creations</h2>
                <button className={styles.viewAllBtn}>View All</button>
            </div>

            <div className={styles.grid}>
                {creations.map((item) => (
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
                            {item.tags.map((tag) => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
