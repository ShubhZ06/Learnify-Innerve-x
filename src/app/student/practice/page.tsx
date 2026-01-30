'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/student/Navbar';
import styles from './page.module.css';

// Sample data
const assignmentsData = [
    { id: 1, title: 'Polynomials Practice Set', subject: 'Mathematics', dueDate: 'Feb 2, 2026', status: 'pending', questions: 15 },
    { id: 2, title: 'Chemical Equations Worksheet', subject: 'Science', dueDate: 'Feb 3, 2026', status: 'pending', questions: 10 },
    { id: 3, title: 'Essay Writing Practice', subject: 'English', dueDate: 'Jan 28, 2026', status: 'completed', score: 85, questions: 5 },
    { id: 4, title: 'French Revolution Questions', subject: 'History', dueDate: 'Jan 25, 2026', status: 'completed', score: 92, questions: 12 },
];

const testsData = [
    { id: 1, title: 'Weekly Math Quiz', subject: 'Mathematics', duration: '30 min', questions: 20, difficulty: 'Medium', isNew: true },
    { id: 2, title: 'Science Chapter Test', subject: 'Science', duration: '45 min', questions: 25, difficulty: 'Hard' },
    { id: 3, title: 'English Grammar Test', subject: 'English', duration: '25 min', questions: 15, difficulty: 'Easy' },
    { id: 4, title: 'History Mock Paper', subject: 'History', duration: '60 min', questions: 40, difficulty: 'Hard' },
];

const testPapersData = [
    { id: 1, title: 'Class 10 Board Sample 2025', subject: 'Mathematics', year: '2025', solved: 2450 },
    { id: 2, title: 'CBSE Previous Year 2024', subject: 'Science', year: '2024', solved: 3200 },
    { id: 3, title: 'Half Yearly Exam Paper', subject: 'All Subjects', year: '2025', solved: 1800 },
];

const weeklyScores = [65, 72, 68, 85, 78, 92, 88];
const subjectScores = [
    { subject: 'Mathematics', score: 78, color: '#3b82f6' },
    { subject: 'Science', score: 85, color: '#22c55e' },
    { subject: 'English', score: 72, color: '#f59e0b' },
    { subject: 'History', score: 90, color: '#8b5cf6' },
];

type TabType = 'assignments' | 'tests' | 'papers' | 'revision' | 'upload';

export default function PracticePage() {
    const [activeTab, setActiveTab] = useState<TabType>('assignments');
    const [animatedScores, setAnimatedScores] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
    const [animatedSubjects, setAnimatedSubjects] = useState<number[]>([0, 0, 0, 0]);

    useEffect(() => {
        // Animate weekly scores
        const timer = setTimeout(() => {
            setAnimatedScores(weeklyScores);
        }, 300);

        // Animate subject scores
        const timer2 = setTimeout(() => {
            setAnimatedSubjects(subjectScores.map(s => s.score));
        }, 500);

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, []);

    const tabs = [
        { id: 'assignments', label: '📝 Assignments', count: 2 },
        { id: 'tests', label: '📋 Tests', count: 4 },
        { id: 'papers', label: '📄 Test Papers', count: 3 },
        { id: 'revision', label: '🔄 Revision', count: 0 },
        { id: 'upload', label: '📤 Upload', count: 0 },
    ];

    return (
        <div className={styles.practice}>
            <Navbar />

            <div className={styles.mainContainer}>
                {/* Header with Stats */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>📚 Practice Zone</h1>
                        <p className={styles.subtitle}>Sharpen your skills with assignments, tests, and revision</p>
                    </div>
                    <div className={styles.quickStats}>
                        <div className={styles.quickStat}>
                            <span className={styles.statNumber}>156</span>
                            <span className={styles.statLabel}>Questions Solved</span>
                        </div>
                        <div className={styles.quickStat}>
                            <span className={styles.statNumber}>82%</span>
                            <span className={styles.statLabel}>Avg. Score</span>
                        </div>
                        <div className={styles.quickStat}>
                            <span className={styles.statNumber}>12</span>
                            <span className={styles.statLabel}>Tests Completed</span>
                        </div>
                    </div>
                </div>

                <div className={styles.mainLayout}>
                    {/* Left: Content */}
                    <div className={styles.contentSection}>
                        {/* Tabs */}
                        <div className={styles.tabsContainer}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                >
                                    {tab.label}
                                    {tab.count > 0 && <span className={styles.tabBadge}>{tab.count}</span>}
                                </button>
                            ))}
                        </div>

                        {/* Assignments Tab */}
                        {activeTab === 'assignments' && (
                            <div className={styles.tabContent}>
                                <div className={styles.sectionHeader}>
                                    <h2>Pending Assignments</h2>
                                    <span className={styles.pendingCount}>2 due soon</span>
                                </div>
                                <div className={styles.cardsList}>
                                    {assignmentsData.filter(a => a.status === 'pending').map((assignment, idx) => (
                                        <div key={assignment.id} className={styles.assignmentCard} style={{ animationDelay: `${idx * 0.1}s` }}>
                                            <div className={styles.cardIcon}>📝</div>
                                            <div className={styles.cardInfo}>
                                                <h3>{assignment.title}</h3>
                                                <div className={styles.cardMeta}>
                                                    <span className={styles.subject}>{assignment.subject}</span>
                                                    <span className={styles.questions}>{assignment.questions} Questions</span>
                                                </div>
                                                <div className={styles.dueDate}>
                                                    <span className={styles.dueIcon}>📅</span> Due: {assignment.dueDate}
                                                </div>
                                            </div>
                                            <button className={styles.startBtn}>Start Now</button>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.sectionHeader} style={{ marginTop: '2rem' }}>
                                    <h2>Completed Assignments</h2>
                                </div>
                                <div className={styles.cardsList}>
                                    {assignmentsData.filter(a => a.status === 'completed').map((assignment, idx) => (
                                        <div key={assignment.id} className={`${styles.assignmentCard} ${styles.completed}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                                            <div className={styles.cardIcon}>✅</div>
                                            <div className={styles.cardInfo}>
                                                <h3>{assignment.title}</h3>
                                                <div className={styles.cardMeta}>
                                                    <span className={styles.subject}>{assignment.subject}</span>
                                                    <span className={styles.score}>Score: {assignment.score}%</span>
                                                </div>
                                            </div>
                                            <button className={styles.reviewBtn}>Review</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tests Tab */}
                        {activeTab === 'tests' && (
                            <div className={styles.tabContent}>
                                <div className={styles.sectionHeader}>
                                    <h2>Available Tests</h2>
                                    <div className={styles.filterBtns}>
                                        <button className={styles.filterActive}>All</button>
                                        <button>Easy</button>
                                        <button>Medium</button>
                                        <button>Hard</button>
                                    </div>
                                </div>
                                <div className={styles.testsGrid}>
                                    {testsData.map((test, idx) => (
                                        <div key={test.id} className={styles.testCard} style={{ animationDelay: `${idx * 0.1}s` }}>
                                            {test.isNew && <span className={styles.newTag}>NEW</span>}
                                            <div className={styles.testHeader}>
                                                <span className={`${styles.difficulty} ${styles[test.difficulty.toLowerCase()]}`}>
                                                    {test.difficulty}
                                                </span>
                                            </div>
                                            <h3>{test.title}</h3>
                                            <p className={styles.testSubject}>{test.subject}</p>
                                            <div className={styles.testMeta}>
                                                <span>⏱️ {test.duration}</span>
                                                <span>❓ {test.questions} Qs</span>
                                            </div>
                                            <button className={styles.takeTestBtn}>Take Test</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Test Papers Tab */}
                        {activeTab === 'papers' && (
                            <div className={styles.tabContent}>
                                <div className={styles.sectionHeader}>
                                    <h2>Previous Year Papers</h2>
                                </div>
                                <div className={styles.papersList}>
                                    {testPapersData.map((paper, idx) => (
                                        <div key={paper.id} className={styles.paperCard} style={{ animationDelay: `${idx * 0.1}s` }}>
                                            <div className={styles.paperIcon}>📄</div>
                                            <div className={styles.paperInfo}>
                                                <h3>{paper.title}</h3>
                                                <div className={styles.paperMeta}>
                                                    <span>{paper.subject}</span>
                                                    <span>Year: {paper.year}</span>
                                                    <span>👥 {paper.solved.toLocaleString()} solved</span>
                                                </div>
                                            </div>
                                            <div className={styles.paperActions}>
                                                <button className={styles.downloadPaperBtn}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="7 10 12 15 17 10" />
                                                        <line x1="12" y1="15" x2="12" y2="3" />
                                                    </svg>
                                                </button>
                                                <button className={styles.solvePaperBtn}>Solve Now</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Revision Tab */}
                        {activeTab === 'revision' && (
                            <div className={styles.tabContent}>
                                <div className={styles.sectionHeader}>
                                    <h2>Quick Revision</h2>
                                </div>
                                <div className={styles.revisionGrid}>
                                    {[
                                        { icon: '🎯', title: 'Weak Areas', desc: 'Practice topics you struggle with', count: 5 },
                                        { icon: '🔄', title: 'Retry Mistakes', desc: 'Redo questions you got wrong', count: 12 },
                                        { icon: '⚡', title: 'Quick Quiz', desc: '5 random questions from all topics', count: null },
                                        { icon: '📊', title: 'Formula Sheet', desc: 'Review important formulas', count: null },
                                        { icon: '📝', title: 'Flashcards', desc: 'Quick concept revision cards', count: 45 },
                                        { icon: '🎮', title: 'Practice Games', desc: 'Learn while playing fun games', count: null },
                                    ].map((item, idx) => (
                                        <div key={idx} className={styles.revisionCard} style={{ animationDelay: `${idx * 0.1}s` }}>
                                            <div className={styles.revisionIcon}>{item.icon}</div>
                                            <h3>{item.title}</h3>
                                            <p>{item.desc}</p>
                                            {item.count && <span className={styles.revisionBadge}>{item.count} items</span>}
                                            <button className={styles.revisionBtn}>Start</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Tab */}
                        {activeTab === 'upload' && (
                            <div className={styles.tabContent}>
                                <div className={styles.uploadSection}>
                                    <div className={styles.uploadArea}>
                                        <div className={styles.uploadIcon}>📤</div>
                                        <h3>Upload Your Assignment</h3>
                                        <p>Drag & drop your files here or click to browse</p>
                                        <p className={styles.uploadFormats}>Supported: PDF, DOC, DOCX, JPG, PNG</p>
                                        <button className={styles.browseBtn}>Browse Files</button>
                                    </div>

                                    <div className={styles.recentUploads}>
                                        <h3>Recent Uploads</h3>
                                        <div className={styles.uploadsList}>
                                            {[
                                                { name: 'Math_Assignment_1.pdf', date: 'Jan 28, 2026', status: 'Submitted' },
                                                { name: 'Science_Lab_Report.docx', date: 'Jan 25, 2026', status: 'Graded' },
                                                { name: 'English_Essay.pdf', date: 'Jan 22, 2026', status: 'Graded' },
                                            ].map((file, idx) => (
                                                <div key={idx} className={styles.uploadItem}>
                                                    <div className={styles.fileIcon}>📎</div>
                                                    <div className={styles.fileInfo}>
                                                        <span>{file.name}</span>
                                                        <small>{file.date}</small>
                                                    </div>
                                                    <span className={`${styles.fileStatus} ${styles[file.status.toLowerCase()]}`}>
                                                        {file.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Analytics Sidebar */}
                    <aside className={styles.analyticsSidebar}>
                        {/* Weekly Performance Chart */}
                        <div className={styles.chartCard}>
                            <div className={styles.chartHeader}>
                                <h3>📈 Weekly Performance</h3>
                                <span className={styles.trend}>+15%</span>
                            </div>
                            <div className={styles.barChart}>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                                    <div key={day} className={styles.barWrapper}>
                                        <div className={styles.bar}>
                                            <div
                                                className={styles.barFill}
                                                style={{
                                                    height: `${animatedScores[idx]}%`,
                                                    transitionDelay: `${idx * 0.1}s`
                                                }}
                                            />
                                        </div>
                                        <span className={styles.barLabel}>{day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subject-wise Scores */}
                        <div className={styles.subjectScores}>
                            <h3>📊 Subject Performance</h3>
                            <div className={styles.scoresList}>
                                {subjectScores.map((item, idx) => (
                                    <div key={item.subject} className={styles.scoreItem}>
                                        <div className={styles.scoreInfo}>
                                            <span className={styles.subjectName}>{item.subject}</span>
                                            <span className={styles.scoreValue}>{animatedSubjects[idx]}%</span>
                                        </div>
                                        <div className={styles.scoreBar}>
                                            <div
                                                className={styles.scoreBarFill}
                                                style={{
                                                    width: `${animatedSubjects[idx]}%`,
                                                    background: item.color,
                                                    transitionDelay: `${idx * 0.15}s`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Streak & Achievements */}
                        <div className={styles.streakCard}>
                            <div className={styles.streakHeader}>
                                <span className={styles.fireIcon}>🔥</span>
                                <div>
                                    <h4>12 Day Streak!</h4>
                                    <p>Keep it going!</p>
                                </div>
                            </div>
                            <div className={styles.streakDays}>
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                    <div key={i} className={`${styles.streakDay} ${i < 5 ? styles.done : ''}`}>
                                        {d}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Leaderboard Preview */}
                        <div className={styles.leaderboard}>
                            <h3>🏆 Class Rank</h3>
                            <div className={styles.rankCard}>
                                <div className={styles.currentRank}>
                                    <span className={styles.rankNumber}>#5</span>
                                    <span className={styles.rankLabel}>out of 42</span>
                                </div>
                                <div className={styles.rankProgress}>
                                    <div className={styles.rankBar}>
                                        <div className={styles.rankFill} style={{ width: '88%' }} />
                                    </div>
                                    <span>2 more to reach #3</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
