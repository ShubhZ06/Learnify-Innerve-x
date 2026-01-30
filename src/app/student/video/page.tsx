'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/student/Navbar';
import styles from './page.module.css';

const videoLessons: Record<string, { title: string; subject: string; duration: string; videoUrl: string; description: string; chapters: { time: string; title: string }[] }> = {
    'polynomials': {
        title: 'Introduction to Polynomials',
        subject: 'Mathematics',
        duration: '20:34',
        videoUrl: 'https://www.youtube.com/embed/ffLLmV4mZwU',
        description: 'Learn the fundamentals of polynomials including degree, coefficients, and types of polynomials. This comprehensive lesson covers everything you need to know about polynomial expressions.',
        chapters: [
            { time: '0:00', title: 'Introduction' },
            { time: '2:15', title: 'What is a Polynomial?' },
            { time: '5:30', title: 'Degree of Polynomials' },
            { time: '10:00', title: 'Types of Polynomials' },
            { time: '15:00', title: 'Practice Problems' },
            { time: '18:30', title: 'Summary' },
        ]
    },
    'calculus': {
        title: 'Introduction to Calculus',
        subject: 'Mathematics',
        duration: '25:12',
        videoUrl: 'https://www.youtube.com/embed/WUvTyaaNkzM',
        description: 'Discover the basics of calculus including limits, derivatives, and their applications in real-world scenarios.',
        chapters: [
            { time: '0:00', title: 'What is Calculus?' },
            { time: '4:00', title: 'Understanding Limits' },
            { time: '10:00', title: 'Introduction to Derivatives' },
            { time: '18:00', title: 'Real-world Applications' },
            { time: '23:00', title: 'Summary' },
        ]
    }
};

export default function VideoLessonPage() {
    const searchParams = useSearchParams();
    const lessonId = searchParams.get('id') || 'calculus';
    const lesson = videoLessons[lessonId] || videoLessons['calculus'];

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [notes, setNotes] = useState('');
    const [showNotes, setShowNotes] = useState(false);

    useEffect(() => {
        // Simulate video progress
        if (isPlaying) {
            const interval = setInterval(() => {
                setProgress(prev => Math.min(prev + 1, 100));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    return (
        <div className={styles.videoPage}>
            <Navbar />
            <div className={styles.mainContainer}>
                {/* Back Button */}
                <Link href="/student/dashboard" className={styles.backBtn}>
                    ← Back to Dashboard
                </Link>

                <div className={styles.contentLayout}>
                    {/* Video Player Section */}
                    <div className={styles.videoSection}>
                        <div className={styles.videoWrapper}>
                            <iframe
                                src={lesson.videoUrl}
                                title={lesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className={styles.videoPlayer}
                                onLoad={() => setIsPlaying(true)}
                            />
                        </div>

                        {/* Video Info */}
                        <div className={styles.videoInfo}>
                            <div className={styles.videoHeader}>
                                <div>
                                    <span className={styles.subjectBadge}>{lesson.subject}</span>
                                    <h1 className={styles.videoTitle}>{lesson.title}</h1>
                                </div>
                                <div className={styles.videoActions}>
                                    <button className={styles.actionBtn} onClick={() => setShowNotes(!showNotes)}>
                                        📝 {showNotes ? 'Hide' : 'Take'} Notes
                                    </button>
                                    <button className={styles.actionBtn}>⬇️ Download</button>
                                    <button className={styles.actionBtn}>🔖 Bookmark</button>
                                </div>
                            </div>
                            <p className={styles.videoDesc}>{lesson.description}</p>

                            {/* Progress Bar */}
                            <div className={styles.progressSection}>
                                <div className={styles.progressHeader}>
                                    <span>Your Progress</span>
                                    <span>{progress}% Complete</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        {showNotes && (
                            <div className={styles.notesSection}>
                                <h3>📝 Your Notes</h3>
                                <textarea
                                    className={styles.notesInput}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Take notes while watching the video..."
                                    rows={5}
                                />
                                <button className={styles.saveNotesBtn}>💾 Save Notes</button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className={styles.sidebar}>
                        {/* Chapters */}
                        <div className={styles.chaptersCard}>
                            <h3>📚 Chapters</h3>
                            <div className={styles.chaptersList}>
                                {lesson.chapters.map((chapter, idx) => (
                                    <div key={idx} className={`${styles.chapterItem} ${idx === 0 ? styles.activeChapter : ''}`}>
                                        <span className={styles.chapterTime}>{chapter.time}</span>
                                        <span className={styles.chapterTitle}>{chapter.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Related Videos */}
                        <div className={styles.relatedCard}>
                            <h3>🎬 Up Next</h3>
                            <div className={styles.relatedList}>
                                <div className={styles.relatedItem}>
                                    <div className={styles.relatedThumb}>📐</div>
                                    <div className={styles.relatedInfo}>
                                        <span>Division Algorithm</span>
                                        <small>18 min</small>
                                    </div>
                                </div>
                                <div className={styles.relatedItem}>
                                    <div className={styles.relatedThumb}>📐</div>
                                    <div className={styles.relatedInfo}>
                                        <span>Zeros of Polynomials</span>
                                        <small>22 min</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
