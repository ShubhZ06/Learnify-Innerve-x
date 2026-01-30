import Link from 'next/link';
import styles from './MaterialCard.module.css';

interface MaterialCardProps {
    material: {
        _id: string;
        type: 'quiz' | 'assignment' | 'video' | 'article' | 'resource' | 'announcement';
        title: string;
        description: string;
        dueDate?: string;
        points?: number;
        videoUrl?: string;
        fileUrl?: string;
        content?: string;
    };
}

const materialIcons = {
    quiz: '📊',
    assignment: '📝',
    video: '🎥',
    article: '📄',
    resource: '📚',
    announcement: '📢'
};

const materialColors = {
    quiz: '#3b82f6',
    assignment: '#f59e0b',
    video: '#ef4444',
    article: '#8b5cf6',
    resource: '#22c55e',
    announcement: '#06b6d4'
};

export default function MaterialCard({ material }: MaterialCardProps) {
    const icon = materialIcons[material.type];
    const color = materialColors[material.type];

    const isOverdue = material.dueDate && new Date(material.dueDate) < new Date();

    const getActionButton = () => {
        switch (material.type) {
            case 'quiz':
                return { text: 'Start Quiz', link: `/student/quiz/${material._id}` };
            case 'assignment':
                return { text: 'View Assignment', link: `/student/assignment/${material._id}` };
            case 'video':
                return { text: 'Watch Video', link: material.videoUrl || '#' };
            case 'article':
                return { text: 'Read Article', link: `/student/article/${material._id}` };
            case 'resource':
                return { text: 'Open Resource', link: material.fileUrl || '#' };
            case 'announcement':
                return { text: 'Read More', link: '#' };
            default:
                return { text: 'View', link: '#' };
        }
    };

    const action = getActionButton();

    return (
        <div className={styles.card}>
            <div className={styles.iconWrapper} style={{ backgroundColor: `${color}15` }}>
                <span className={styles.icon} style={{ color }}>{icon}</span>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{material.title}</h3>
                    <span className={styles.typeBadge} style={{ backgroundColor: `${color}20`, color }}>
                        {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                    </span>
                </div>

                <p className={styles.description}>{material.description}</p>

                <div className={styles.footer}>
                    <div className={styles.meta}>
                        {material.dueDate && (
                            <span className={`${styles.dueDate} ${isOverdue ? styles.overdue : ''}`}>
                                📅 Due: {new Date(material.dueDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                        )}
                        {material.points && (
                            <span className={styles.points}>
                                ⭐ {material.points} points
                            </span>
                        )}
                    </div>

                    {action.link.startsWith('/') ? (
                        <Link href={action.link} className={styles.actionBtn} style={{ borderColor: color, color }}>
                            {action.text} →
                        </Link>
                    ) : (
                        <a
                            href={action.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionBtn}
                            style={{ borderColor: color, color }}
                        >
                            {action.text} →
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
