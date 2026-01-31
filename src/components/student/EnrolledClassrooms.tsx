'use client';

import { useState, useEffect } from 'react';
import styles from './EnrolledClassrooms.module.css';
import QuizPlayer from './QuizPlayer';

interface Teacher {
    name: string;
    email: string;
}

interface Classroom {
    _id: string;
    name: string;
    code?: string;
    teacherId: Teacher;
}

interface Enrollment {
    enrollmentId: string;
    joinedAt: string;
    classroom: Classroom;
}

interface Material {
    _id: string;
    type: 'quiz' | 'assignment' | 'video' | 'article' | 'resource' | 'announcement';
    title: string;
    description: string;
    content?: string;
    jsonData?: any; // Structured JSON content
    dueDate?: string;
    points?: number;
    videoUrl?: string;
    fileUrl?: string;
    teacher?: {
        name: string;
        email: string;
    };
    createdAt?: string;
}

interface MaterialsData {
    all: Material[];
    assignments: Material[];
    quizzes: Material[];
    others: Material[];
}

type TabType = 'all' | 'quizzes' | 'assignments' | 'others';

export default function EnrolledClassrooms() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [classCode, setClassCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [joinError, setJoinError] = useState('');

    // Modal state
    const [selectedClassroom, setSelectedClassroom] = useState<Enrollment | null>(null);
    const [materials, setMaterials] = useState<MaterialsData>({
        all: [], quizzes: [], assignments: [], others: []
    });
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [isPlayingQuiz, setIsPlayingQuiz] = useState(false);

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
                fetchEnrollments();
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

    const openClassroomModal = async (enrollment: Enrollment) => {
        setSelectedClassroom(enrollment);
        setActiveTab('all');
        setIsLoadingMaterials(true);

        try {
            const response = await fetch(`/api/student/classroom/${enrollment.classroom._id}/materials`);
            if (response.ok) {
                const data = await response.json();
                const allMats = data.materials?.all || [];
                setMaterials({
                    all: allMats,
                    quizzes: allMats.filter((m: Material) => m.type === 'quiz'),
                    assignments: allMats.filter((m: Material) => m.type === 'assignment'),
                    others: allMats.filter((m: Material) => !['quiz', 'assignment'].includes(m.type))
                });
            }
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setIsLoadingMaterials(false);
        }
    };

    const closeModal = () => {
        setSelectedClassroom(null);
        setMaterials({ all: [], quizzes: [], assignments: [], others: [] });
    };

    const tabs = [
        { key: 'all' as TabType, label: 'All', icon: '📚', count: materials.all.length },
        { key: 'quizzes' as TabType, label: 'Quizzes', icon: '📊', count: materials.quizzes.length },
        { key: 'assignments' as TabType, label: 'Assignments', icon: '📝', count: materials.assignments.length },
        { key: 'others' as TabType, label: 'Others', icon: '📁', count: materials.others.length },
    ];

    const getMaterialIcon = (type: string) => {
        switch (type) {
            case 'announcement': return '📢';
            case 'assignment': return '📝';
            case 'quiz': return '📊';
            case 'video': return '🎥';
            case 'article': return '📄';
            case 'resource': return '📁';
            default: return '📚';
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
                                <h4 className={styles.className}>{item.classroom?.name || 'Unknown Class'}</h4>
                                <p className={styles.teacherName}>
                                    Teacher: {item.classroom?.teacherId?.name || 'Unknown'}
                                </p>
                                <span className={styles.joinedDate}>
                                    Joined on {new Date(item.joinedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <button
                                className={styles.enterBtn}
                                onClick={() => openClassroomModal(item)}
                            >
                                Enter Class
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Popup with Materials */}
            {selectedClassroom && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={closeModal}>×</button>

                        <div className={styles.modalHeader}>
                            <div className={styles.modalIcon}>📘</div>
                            <div className={styles.modalHeaderInfo}>
                                <h2 className={styles.modalTitle}>{selectedClassroom.classroom?.name}</h2>
                                <p className={styles.modalSubtitle}>
                                    👨‍🏫 {selectedClassroom.classroom?.teacherId?.name || 'Unknown Teacher'}
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className={styles.modalTabs}>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`${styles.modalTab} ${activeTab === tab.key ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    <span>{tab.icon}</span>
                                    <span className={styles.tabLabel}>{tab.label}</span>
                                    {tab.count > 0 && (
                                        <span className={styles.tabBadge}>{tab.count}</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Materials Content */}
                        <div className={styles.modalContent}>
                            {isLoadingMaterials ? (
                                <div className={styles.materialsLoading}>
                                    <div className={styles.spinner}></div>
                                    <p>Loading materials...</p>
                                </div>
                            ) : materials[activeTab].length > 0 ? (
                                <div className={styles.materialsList}>
                                    {materials[activeTab].map((material) => (
                                        <div key={material._id} className={styles.materialCard}>
                                            <div className={styles.materialIcon}>
                                                {getMaterialIcon(material.type)}
                                            </div>
                                            <div className={styles.materialInfo}>
                                                <h4 className={styles.materialTitle}>{material.title}</h4>
                                                <p className={styles.materialDesc}>{material.description}</p>
                                                {material.dueDate && (
                                                    <span className={styles.materialDue}>
                                                        📅 Due: {new Date(material.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {material.points && (
                                                    <span className={styles.materialPoints}>
                                                        ⭐ {material.points} points
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                className={styles.materialAction}
                                                onClick={() => setSelectedMaterial(material)}
                                            >
                                                View →
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyMaterials}>
                                    <div className={styles.emptyMaterialsIcon}>
                                        {tabs.find(t => t.key === activeTab)?.icon || '📚'}
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
            )}

            {/* Material Content Viewer Modal */}
            {selectedMaterial && (
                <div className={styles.contentViewerOverlay} onClick={() => setSelectedMaterial(null)}>
                    <div className={styles.contentViewer} onClick={(e) => e.stopPropagation()}>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setSelectedMaterial(null)}
                        >
                            ×
                        </button>

                        <div className={styles.contentHeader}>
                            <div className={styles.contentIcon}>
                                {getMaterialIcon(selectedMaterial.type)}
                            </div>
                            <div>
                                <h2 className={styles.contentTitle}>{selectedMaterial.title}</h2>
                                <p className={styles.contentMeta}>
                                    {selectedMaterial.type.charAt(0).toUpperCase() + selectedMaterial.type.slice(1)}
                                    {selectedMaterial.teacher && ` • By ${selectedMaterial.teacher.name}`}
                                    {selectedMaterial.createdAt && ` • ${new Date(selectedMaterial.createdAt).toLocaleDateString()}`}
                                </p>
                            </div>
                        </div>

                        {selectedMaterial.description && (
                            <p className={styles.contentDescription}>{selectedMaterial.description}</p>
                        )}

                        {(selectedMaterial.dueDate || selectedMaterial.points) && (
                            <div className={styles.contentDetails}>
                                {selectedMaterial.dueDate && (
                                    <span>📅 Due: {new Date(selectedMaterial.dueDate).toLocaleDateString()}</span>
                                )}
                                {selectedMaterial.points && (
                                    <span>⭐ {selectedMaterial.points} points</span>
                                )}
                            </div>
                        )}

                        <div className={styles.contentBody}>
                            {(() => {
                                // Try to parse content as JSON if it's a string
                                let parsedContent = selectedMaterial.jsonData;
                                if (!parsedContent && selectedMaterial.content) {
                                    try {
                                        parsedContent = typeof selectedMaterial.content === 'string'
                                            ? JSON.parse(selectedMaterial.content)
                                            : selectedMaterial.content;
                                    } catch (e) {
                                        // Not JSON, display as text
                                    }
                                }

                                // Render quiz with interactive player
                                if (parsedContent?.questions && Array.isArray(parsedContent.questions)) {
                                    if (isPlayingQuiz) {
                                        return (
                                            <QuizPlayer
                                                materialId={selectedMaterial._id}
                                                classroomId={selectedClassroom?.classroom._id || ''}
                                                title={selectedMaterial.title}
                                                questions={parsedContent.questions}
                                                onComplete={(result) => {
                                                    console.log('Quiz completed:', result);
                                                }}
                                                onClose={() => {
                                                    setIsPlayingQuiz(false);
                                                    setSelectedMaterial(null);
                                                }}
                                            />
                                        );
                                    }

                                    return (
                                        <div className={styles.quizContent}>
                                            <h4 className={styles.quizTitle}>
                                                📝 {parsedContent.questions.length} Questions
                                            </h4>
                                            <p style={{ color: '#64748b', marginBottom: '20px' }}>
                                                Answer each question and get instant feedback. Your results will be saved.
                                            </p>
                                            <button
                                                className={styles.startQuizBtn}
                                                onClick={() => setIsPlayingQuiz(true)}
                                            >
                                                🎯 Start Quiz
                                            </button>
                                        </div>
                                    );
                                }

                                // Render other structured JSON
                                if (parsedContent && typeof parsedContent === 'object') {
                                    return (
                                        <pre className={styles.jsonContent}>
                                            {JSON.stringify(parsedContent, null, 2)}
                                        </pre>
                                    );
                                }

                                // Render text content
                                if (selectedMaterial.content && typeof selectedMaterial.content === 'string') {
                                    return (
                                        <div
                                            className={styles.contentText}
                                            dangerouslySetInnerHTML={{
                                                __html: selectedMaterial.content.replace(/\n/g, '<br>')
                                            }}
                                        />
                                    );
                                }

                                return <p className={styles.noContent}>No content available for this material.</p>;
                            })()}

                            {selectedMaterial.videoUrl && (
                                <div className={styles.videoEmbed}>
                                    <a href={selectedMaterial.videoUrl} target="_blank" rel="noopener noreferrer">
                                        🎥 Watch Video
                                    </a>
                                </div>
                            )}

                            {selectedMaterial.fileUrl && (
                                <div className={styles.fileDownload}>
                                    <a href={selectedMaterial.fileUrl} target="_blank" rel="noopener noreferrer">
                                        📁 Download File
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
