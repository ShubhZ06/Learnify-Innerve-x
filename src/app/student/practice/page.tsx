'use client';

import Navbar from '@/components/student/Navbar';
import JoinClassroom from '@/components/student/JoinClassroom';
import styles from './page.module.css';

export default function PracticePage() {
    return (
        <div className={styles.practice}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Practice Zone</h1>
                    <p>Start your learning journey by choosing a practice session.</p>
                </div>

                <JoinClassroom />

                <div className={styles.emptyState}>
                    <div className={styles.icon}>🎯</div>
                    <h2>No practice sessions yet</h2>
                    <p>Practice assignments and tests will appear here once assigned.</p>
                </div>
            </div>
        </div>
    );
}
