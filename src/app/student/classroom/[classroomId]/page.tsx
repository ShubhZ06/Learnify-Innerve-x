'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/student/Navbar';
import styles from './page.module.css';

interface Classroom {
    _id: string;
    name: string;
    code: string;
    teacher: {
        name: string;
        email: string;
    };
    joinedAt: string;
}

export default function ClassroomPage() {
    const params = useParams();
    const router = useRouter();
    const classroomId = params.classroomId as string;

    const [classroom, setClassroom] = useState<Classroom | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchClassroomData();
    }, [classroomId]);

    const fetchClassroomData = async () => {
        try {
            const response = await fetch(`/api/student/classroom/${classroomId}`);
            if (response.ok) {
                const data = await response.json();
                setClassroom(data.classroom);
            } else if (response.status === 404) {
                setError('Classroom not found');
            } else if (response.status === 403) {
                setError('You are not enrolled in this classroom');
            } else {
                setError('Failed to load classroom');
            }
        } catch (err) {
            setError('Failed to load classroom');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <Navbar />
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading classroom...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <Navbar />
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2>{error}</h2>
                    <button onClick={() => router.push('/student/classroom')} className={styles.backBtn}>
                        ← Back to Classrooms
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Navbar />

            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <button onClick={() => router.push('/student/classroom')} className={styles.backButton}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Classrooms
                    </button>

                    {classroom && (
                        <div className={styles.classroomInfo}>
                            <div className={styles.classroomIcon}>📘</div>
                            <div className={styles.classroomDetails}>
                                <h1 className={styles.classroomName}>{classroom.name}</h1>
                                <div className={styles.classroomMeta}>
                                    <span className={styles.teacher}>
                                        👨‍🏫 {classroom.teacher?.name || 'Unknown Teacher'}
                                    </span>
                                    <span className={styles.divider}>•</span>
                                    <span className={styles.code}>
                                        Code: {classroom.code}
                                    </span>
                                    <span className={styles.divider}>•</span>
                                    <span className={styles.joined}>
                                        Joined {new Date(classroom.joinedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty Content - Materials Removed */}
                <div className={styles.content}>
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📚</div>
                        <h3>Welcome to the Classroom!</h3>
                        <p>This classroom is ready for learning. Materials will appear here when added by your teacher.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
