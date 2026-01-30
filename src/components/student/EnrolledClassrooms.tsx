'use client';

import { useState, useEffect } from 'react';
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
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return <div className={styles.loading}>Loading classrooms...</div>;
    }

    if (enrollments.length === 0) {
        return null; // Don't show anything if not enrolled
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>My Classrooms</h3>
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
                        <button className={styles.enterBtn}>Enter Class</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
