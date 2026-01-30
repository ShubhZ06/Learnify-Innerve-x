'use client';

import styles from './page.module.css';

const sampleContent = [
    { id: 1, title: 'Introduction to Algebra', type: 'Video', status: 'Published', date: 'Jan 28, 2026' },
    { id: 2, title: 'Physics Laws Quiz', type: 'Quiz', status: 'Draft', date: 'Jan 27, 2026' },
    { id: 3, title: 'Chemistry Lab Safety', type: 'Document', status: 'Published', date: 'Jan 25, 2026' },
    { id: 4, title: 'Math Practice Set', type: 'Assignment', status: 'Published', date: 'Jan 24, 2026' },
];

export default function ContentManagementPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Content Management</h1>
                    <p className={styles.subtitle}>Create, organize, and publish your learning materials</p>
                </div>
                <button className="btn btn-primary">+ New Content</button>
            </div>

            <div className={styles.contentGrid}>
                {sampleContent.map((item) => (
                    <div key={item.id} className={styles.contentCard}>
                        <div className={styles.contentType}>
                            <span className={`${styles.typeBadge} ${styles[item.type.toLowerCase()]}`}>
                                {item.type}
                            </span>
                            <span className={`${styles.statusBadge} ${item.status === 'Published' ? styles.published : styles.draft}`}>
                                {item.status}
                            </span>
                        </div>
                        <h3 className={styles.contentTitle}>{item.title}</h3>
                        <p className={styles.contentDate}>Created: {item.date}</p>
                        <div className={styles.contentActions}>
                            <button className={styles.editBtn}>Edit</button>
                            <button className={styles.viewBtn}>View</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
