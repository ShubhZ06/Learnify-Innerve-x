'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/student/Navbar';
import styles from './page.module.css';

const weeklyPerformance = [
    { day: 'Mon', score: 60, lessons: 3 },
    { day: 'Tue', score: 75, lessons: 4 },
    { day: 'Wed', score: 45, lessons: 2 },
    { day: 'Thu', score: 90, lessons: 5 },
    { day: 'Fri', score: 80, lessons: 4 },
    { day: 'Sat', score: 55, lessons: 3 },
    { day: 'Sun', score: 70, lessons: 3 },
];

const recommendations = [
    { id: 'calculus', type: 'Video', title: 'Introduction to Calculus', subject: 'Mathematics', duration: '20 mins', color: '#e0f2fe', route: '/student/video?id=calculus' },
    { id: 'renaissance', type: 'Article', title: 'History of Renaissance', subject: 'History', duration: '15 mins', color: '#fef3c7', route: '/student/article?id=renaissance' },
    { id: 'biology', type: 'Quiz', title: 'Biology: Plant Systems', subject: 'Science', duration: '10 Qs', color: '#dcfce7', route: '/student/quiz?id=biology' },
];

export default function StudentDashboard() {
    const router = useRouter();
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const [animatedGoal1, setAnimatedGoal1] = useState(0);
    const [animatedGoal2, setAnimatedGoal2] = useState(0);
    const [weeklyData, setWeeklyData] = useState(weeklyPerformance.map(() => 0));
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    useEffect(() => {
        const timer1 = setTimeout(() => setAnimatedProgress(65), 300);
        const timer2 = setTimeout(() => setAnimatedGoal1(75), 400);
        const timer3 = setTimeout(() => setAnimatedGoal2(30), 500);
        const timer4 = setTimeout(() => setWeeklyData(weeklyPerformance.map(d => d.score)), 600);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, []);

    const handleRecommendationClick = (route: string) => {
        // Navigate directly to the content page (video, article, or quiz)
        router.push(route);
    };

    return (
        <div className={styles.dashboard}>
            <Navbar />

            <div className={styles.mainContainer}>
                {/* Left Column: Main Content */}
                <div className={styles.contentColumn}>
                    <div className={styles.welcomeSection}>
                        <h1 className={styles.greeting}>Good Morning, Aryan! 👋</h1>
                        <p className={styles.subGreeting}>Ready to continue your learning journey today?</p>
                    </div>

                    {/* Daily Goals Section */}
                    <div className={styles.goalsSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                Daily Learning Goals
                            </h2>
                            <button className="btn btn-outline" style={{ fontSize: '0.875rem' }}>View All</button>
                        </div>

                        <div className={styles.goalsList}>
                            <div className={styles.goalCard}>
                                <div className={styles.goalIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                    </svg>
                                </div>
                                <div className={styles.goalContent}>
                                    <div className={styles.goalTitle}>Complete Chapter 3: Physics Motion</div>
                                    <div className={styles.goalProgress}>
                                        <div className={styles.progressBar}>
                                            <div className={styles.progressFill} style={{ width: `${animatedGoal1}%` }}></div>
                                        </div>
                                        <span className={styles.progressText}>{animatedGoal1}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.goalCard}>
                                <div className={styles.goalIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                    </svg>
                                </div>
                                <div className={styles.goalContent}>
                                    <div className={styles.goalTitle}>Chemistry Lab Practice Quiz</div>
                                    <div className={styles.goalProgress}>
                                        <div className={styles.progressBar}>
                                            <div className={styles.progressFill} style={{ width: `${animatedGoal2}%`, background: '#ef4444' }}></div>
                                        </div>
                                        <span className={styles.progressText}>{animatedGoal2}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Performance Chart - Improved */}
                    <div className={styles.chartSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                📊 Weekly Performance
                            </h2>
                            <div className={styles.chartLegend}>
                                <span className={styles.legendItem}>
                                    <span className={styles.legendDot}></span>
                                    Score %
                                </span>
                                <span className={styles.trendBadge}>+12% ↑</span>
                            </div>
                        </div>
                        <div className={styles.chartContainer}>
                            <div className={styles.chartYAxis}>
                                <span>100</span>
                                <span>75</span>
                                <span>50</span>
                                <span>25</span>
                                <span>0</span>
                            </div>
                            <div className={styles.barChart}>
                                {weeklyPerformance.map((item, idx) => (
                                    <div
                                        key={item.day}
                                        className={styles.barWrapper}
                                        onMouseEnter={() => setHoveredBar(idx)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                    >
                                        {hoveredBar === idx && (
                                            <div className={styles.barTooltip}>
                                                <strong>{item.score}%</strong>
                                                <span>{item.lessons} lessons</span>
                                            </div>
                                        )}
                                        <div className={styles.bar}>
                                            <div
                                                className={`${styles.barFill} ${hoveredBar === idx ? styles.barHovered : ''}`}
                                                style={{
                                                    height: `${weeklyData[idx]}%`,
                                                    transitionDelay: `${idx * 0.1}s`
                                                }}
                                            />
                                        </div>
                                        <span className={styles.barLabel}>{item.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.chartSummary}>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryValue}>24</span>
                                <span className={styles.summaryLabel}>Lessons Completed</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryValue}>68%</span>
                                <span className={styles.summaryLabel}>Avg. Score</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryValue}>4.2h</span>
                                <span className={styles.summaryLabel}>Study Time/Day</span>
                            </div>
                        </div>
                    </div>

                    {/* Recommended For You - Now Clickable */}
                    <div className={styles.recommendationsSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>
                                ⭐ Recommended For You
                            </h2>
                            <Link href="/student/library" className={styles.seeAllLink}>See All →</Link>
                        </div>
                        <div className={styles.recommendationsGrid}>
                            {recommendations.map((rec) => (
                                <div
                                    key={rec.id}
                                    className={styles.recommendationCard}
                                    onClick={() => handleRecommendationClick(rec.route)}
                                >
                                    <div className={styles.cardImage} style={{ background: `linear-gradient(135deg, ${rec.color} 0%, ${rec.color}dd 100%)` }}>
                                        <span className={styles.cardTag}>{rec.type}</span>
                                        <div className={styles.playOverlay}>
                                            <span>▶</span>
                                        </div>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <h3 className={styles.cardTitle}>{rec.title}</h3>
                                        <div className={styles.cardMeta}>
                                            <span>{rec.subject}</span>
                                            <span>•</span>
                                            <span>{rec.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Key Metrics */}
                <aside className={styles.sidebar}>
                    {/* Streak Counter */}
                    <div className={`${styles.widget} ${styles.streakWidget}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span className={styles.fireEmoji}>🔥</span>
                            <span style={{ fontWeight: 600, color: '#92400e' }}>Learning Streak</span>
                        </div>
                        <div className={styles.streakCount}>12 Days</div>
                        <div className={styles.streakLabel}>You&apos;re on fire! Keep it up</div>
                    </div>

                    {/* Today's Target - Animated Circle */}
                    <div className={styles.widget}>
                        <h3 className={styles.sectionTitle} style={{ fontSize: '1rem', marginBottom: '1rem' }}>Today&apos;s Target</h3>
                        <div className={styles.targetCircle}>
                            <svg viewBox="0 0 36 36" className={styles.circleChart}>
                                <path
                                    className={styles.circleBg}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className={styles.circleFill}
                                    strokeDasharray={`${animatedProgress}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className={styles.circleContent}>
                                <span className={styles.targetPercent}>{animatedProgress}%</span>
                                <span className={styles.targetLabel}>Completed</span>
                            </div>
                        </div>
                        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                            2.5 hrs / 4 hrs goal reached
                        </p>
                    </div>

                    {/* Subject Performance */}
                    <div className={styles.widget}>
                        <h3 className={styles.sectionTitle} style={{ fontSize: '1rem', marginBottom: '1rem' }}>Subject Performance</h3>
                        <div className={styles.subjectsList}>
                            {[
                                { name: 'Mathematics', score: 85, color: '#3b82f6' },
                                { name: 'Science', score: 78, color: '#22c55e' },
                                { name: 'English', score: 92, color: '#f59e0b' },
                                { name: 'History', score: 68, color: '#8b5cf6' },
                            ].map((subject, idx) => (
                                <div key={subject.name} className={styles.subjectItem}>
                                    <div className={styles.subjectInfo}>
                                        <span>{subject.name}</span>
                                        <span className={styles.subjectScore}>{subject.score}%</span>
                                    </div>
                                    <div className={styles.subjectBar}>
                                        <div
                                            className={styles.subjectBarFill}
                                            style={{
                                                width: `${subject.score}%`,
                                                background: subject.color,
                                                transitionDelay: `${idx * 0.15}s`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Assignments */}
                    <div className={styles.widget}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className={styles.sectionTitle} style={{ fontSize: '1rem', marginBottom: 0 }}>Assignments</h3>
                            <Link href="/student/practice" style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 500 }}>See All</Link>
                        </div>
                        <div className={styles.assignmentsList}>
                            <div className={styles.assignmentItem}>
                                <div className={styles.assignmentHeader}>
                                    <span className={styles.subjectTag}>Math</span>
                                    <span className={styles.dueDate}>Tomorrow</span>
                                </div>
                                <div className={styles.assignmentTitle}>Algebra Worksheet 4.2</div>
                                <div className={styles.assignmentTime}>Est. 45 mins</div>
                            </div>
                            <div className={styles.assignmentItem}>
                                <div className={styles.assignmentHeader}>
                                    <span className={styles.subjectTag}>Science</span>
                                    <span className={styles.dueDate}>Fri, Feb 2</span>
                                </div>
                                <div className={styles.assignmentTitle}>Lab Report: Chemical Reactions</div>
                                <div className={styles.assignmentTime}>Est. 1.5 hrs</div>
                            </div>
                            <div className={styles.assignmentItem}>
                                <div className={styles.assignmentHeader}>
                                    <span className={styles.subjectTag}>English</span>
                                    <span className={styles.dueDate}>Mon, Feb 5</span>
                                </div>
                                <div className={styles.assignmentTitle}>Essay: Macbeth Analysis</div>
                                <div className={styles.assignmentTime}>Est. 2 hrs</div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
