'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './EnrolledClassrooms.module.css';

interface Teacher {
    name: string;
    email: string;
}

interface Classroom {
    _id: string;
    name: string;
    teacherId: Teacher;
}

interface Enrollment {
    enrollmentId: string;
    joinedAt: string;
    classroom: Classroom;
}

export default function EnrolledClassrooms() {
    const router = useRouter();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [classCode, setClassCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [joinError, setJoinError] = useState('');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const response = await fetch('/api/student/enrolled');
            if (response.ok) {
                const data = await response.json();
                setEnrollments(data);
            }
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!classCode.trim() || isJoining) return;

        setIsJoining(true);
        setJoinError('');

        try {
            const response = await fetch('/api/student/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: classCode.trim() })
            });

            const data = await response.json();

            if (response.ok) {
                setClassCode('');
                fetchEnrollments(); // Refresh the list
                alert('Successfully joined classroom!');
            } else {
                setJoinError(data.message || 'Failed to join classroom');
            }
        } catch (error) {
            setJoinError('An error occurred. Please try again.');
        } finally {
            setIsJoining(false);
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading classrooms...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>My Classrooms</h3>
                <span className={styles.count}>{enrollments.length} enrolled</span>
            </div>

            {/* Join Classroom Form */}
            <form onSubmit={handleJoinClass} className={styles.joinForm}>
                <div className={styles.joinInputWrapper}>
                    <span className={styles.joinIcon}>🏫</span>
                    <input
                        type="text"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                        placeholder="Enter 6-character class code"
                        className={styles.joinInput}
                        maxLength={6}
                        disabled={isJoining}
                    />
                    <button
                        type="submit"
                        className={styles.joinBtn}
                        disabled={!classCode.trim() || isJoining}
                    >
                        {isJoining ? 'Joining...' : 'Join'}
                    </button>
                </div>
                {joinError && <div className={styles.errorMessage}>{joinError}</div>}
            </form>

            {/* Enrolled Classrooms */}
            {enrollments.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📚</div>
                    <p>No classrooms yet. Enter a code above to join!</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {enrollments.map((item) => (
                        <div key={item.enrollmentId} className={styles.card}>
                            <div className={styles.cardIcon}>📘</div>
                            <div className={styles.cardInfo}>
                                <h4 className={styles.className}>{item.classroom.name}</h4>
                                <p className={styles.teacherName}>
                                    Teacher: {item.classroom.teacherId.name}
                                </p>
                                <span className={styles.joinedDate}>
                                    Joined on {new Date(item.joinedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <button
                                className={styles.enterBtn}
                                onClick={() => router.push(`/student/classroom/${item.classroom._id}`)}
                            >
                                Enter Class
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
