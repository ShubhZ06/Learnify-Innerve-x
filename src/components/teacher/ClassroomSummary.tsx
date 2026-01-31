'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ClassroomSummary.module.css';

interface Classroom {
    _id: string;
    name: string;
    code: string;
}

export default function ClassroomSummary() {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const response = await fetch('/api/teacher/classroom');
            if (response.ok) {
                const data = await response.json();
                setClassrooms(data);
            }
        } catch (error) {
            console.error('Error fetching classrooms:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>My Classrooms</h3>
                    <span className={styles.count}>{classrooms.length} classes</span>
                </div>
                <Link href="/teacher/classes" className={styles.viewAllBtn}>
                    Manage Classes →
                </Link>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Loading...</div>
            ) : classrooms.length === 0 ? (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📚</span>
                    <p>No classrooms yet</p>
                    <Link href="/teacher/classes" className={styles.createBtn}>
                        Create Your First Class
                    </Link>
                </div>
            ) : (
                <div className={styles.classList}>
                    {classrooms.slice(0, 3).map((cls) => (
                        <div key={cls._id} className={styles.classCard}>
                            <div className={styles.classIcon}>📘</div>
                            <div className={styles.classInfo}>
                                <span className={styles.className}>{cls.name}</span>
                                <span className={styles.classCode}>Code: {cls.code}</span>
                            </div>
                        </div>
                    ))}
                    {classrooms.length > 3 && (
                        <Link href="/teacher/classes" className={styles.moreLink}>
                            +{classrooms.length - 3} more classes
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
