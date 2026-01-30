'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/student/Navbar';
import MaterialCard from '@/components/student/MaterialCard';
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

interface Material {
    _id: string;
    type: 'quiz' | 'assignment' | 'video' | 'article' | 'resource' | 'announcement';
    title: string;
    description: string;
    dueDate?: string;
    points?: number;
    videoUrl?: string;
    fileUrl?: string;
    content?: string;
}

interface MaterialsData {
    all: Material[];
    assignments: Material[];
    quizzes: Material[];
    videos: Material[];
    articles: Material[];
    resources: Material[];
    announcements: Material[];
}

type TabType = 'all' | 'assignments' | 'quizzes' | 'videos' | 'articles' | 'resources' | 'announcements';

export default function ClassroomPage() {
    const params = useParams();
    const router = useRouter();
    const classroomId = params.classroomId as string;

    const [classroom, setClassroom] = useState<Classroom | null>(null);
    const [materials, setMaterials] = useState<MaterialsData>({
        all: [],
        assignments: [],
        quizzes: [],
        videos: [],
        articles: [],
        resources: [],
        announcements: []
    });
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchClassroomData();
        fetchMaterials();
    }, [classroomId]);

    const fetchClassroomData = async () => {
        try {
            const response = await fetch(`/api/student/classroom/${classroomId}`);
            if (response.ok) {
                const data = await response.json();
                setClassroom(data.classroom);
            } else if (response.status === 403) {
                setError('You are not enrolled in this classroom');
            } else {
                setError('Failed to load classroom');
            }
        } catch (err) {
            setError('Failed to load classroom');
            console.error(err);
        }
    };

    const fetchMaterials = async () => {
        try {
            const response = await fetch(`/api/student/classroom/${classroomId}/materials`);
            if (response.ok) {
                const data = await response.json();
                setMaterials(data.materials);
            }
        } catch (err) {
            console.error('Failed to fetch materials:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { key: 'all', label: 'All', count: materials.all.length },
        { key: 'assignments', label: 'Assignments', count: materials.assignments.length },
        { key: 'quizzes', label: 'Quizzes', count: materials.quizzes.length },
        { key: 'videos', label: 'Videos', count: materials.videos.length },
        { key: 'articles', label: 'Articles', count: materials.articles.length },
        { key: 'resources', label: 'Resources', count: materials.resources.length },
        { key: 'announcements', label: 'Announcements', count: materials.announcements.length }
    ] as const;

    const currentMaterials = materials[activeTab];

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
                                        👨‍🏫 {classroom.teacher.name}
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

                {/* Tabs */}
                <div className={styles.tabs}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={styles.tabCount}>{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Materials Grid */}
                <div className={styles.content}>
                    {isLoading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Loading materials...</p>
                        </div>
                    ) : currentMaterials.length > 0 ? (
                        <div className={styles.materialsGrid}>
                            {currentMaterials.map((material) => (
                                <MaterialCard key={material._id} material={material} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                {activeTab === 'all' ? '📚' :
                                    activeTab === 'assignments' ? '📝' :
                                        activeTab === 'quizzes' ? '📊' :
                                            activeTab === 'videos' ? '🎥' :
                                                activeTab === 'articles' ? '📄' :
                                                    activeTab === 'resources' ? '📚' : '📢'}
                            </div>
                            <h3>No {activeTab === 'all' ? 'materials' : activeTab} yet</h3>
                            <p>
                                {activeTab === 'all'
                                    ? 'Your teacher hasn\'t added any materials to this classroom yet.'
                                    : `No ${activeTab} have been added yet. Check back later!`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
