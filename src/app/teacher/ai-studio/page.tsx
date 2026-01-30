'use client';

import styles from './page.module.css';

export default function AIStudioPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>AI Studio</h1>
                <p className={styles.subtitle}>Create AI-powered learning content with ease</p>
            </div>

            <div className={styles.grid}>
                {/* Quick Actions Card */}
                <div className={styles.card}>
                    <div className={styles.cardIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h3 className={styles.cardTitle}>Generate Quiz</h3>
                    <p className={styles.cardDesc}>Create quizzes from any topic using AI</p>
                    <button className="btn btn-primary">Get Started</button>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                    </div>
                    <h3 className={styles.cardTitle}>Lesson Plan</h3>
                    <p className={styles.cardDesc}>Auto-generate structured lesson plans</p>
                    <button className="btn btn-primary">Create</button>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>
                    <h3 className={styles.cardTitle}>Smart Q&A</h3>
                    <p className={styles.cardDesc}>Generate practice questions from documents</p>
                    <button className="btn btn-primary">Try Now</button>
                </div>
            </div>
        </div>
    );
}
