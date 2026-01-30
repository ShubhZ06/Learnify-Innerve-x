'use client';

import { useState } from 'react';
import styles from './page.module.css';

const sampleClasses = [
    { 
        id: 1, 
        name: 'Mathematics 101', 
        description: 'Algebra, Geometry, and Calculus fundamentals for Class 10',
        students: 32, 
        section: 'A', 
        subject: 'Mathematics',
        classCode: '4821',
        teacher: 'Dr. Sharma',
        createdAt: '15/01/2026',
        schedule: 'Mon, Wed, Fri',
        status: 'active',
        tags: ['Algebra', 'Geometry', 'Calculus']
    },
    { 
        id: 2, 
        name: 'Physics Advanced', 
        description: 'Mechanics, Thermodynamics, and Optics for Class 12',
        students: 28, 
        section: 'B', 
        subject: 'Physics',
        classCode: '7392',
        teacher: 'Prof. Verma',
        createdAt: '18/01/2026',
        schedule: 'Tue, Thu',
        status: 'active',
        tags: ['Mechanics', 'Optics', 'Waves']
    },
    { 
        id: 3, 
        name: 'Chemistry Basics', 
        description: 'Organic and Inorganic Chemistry for Class 11',
        students: 35, 
        section: 'A', 
        subject: 'Chemistry',
        classCode: '5614',
        teacher: 'Dr. Patel',
        createdAt: '20/01/2026',
        schedule: 'Mon, Thu',
        status: 'active',
        tags: ['Organic', 'Inorganic', 'Lab']
    },
    { 
        id: 4, 
        name: 'English Literature', 
        description: 'Poetry, Prose, and Drama analysis for Class 9',
        students: 40, 
        section: 'C', 
        subject: 'English',
        classCode: '3287',
        teacher: 'Ms. Gupta',
        createdAt: '22/01/2026',
        schedule: 'Wed, Fri',
        status: 'inactive',
        tags: ['Poetry', 'Drama', 'Writing']
    },
    { 
        id: 5, 
        name: 'Computer Science', 
        description: 'Programming and Data Structures for Class 12',
        students: 25, 
        section: 'A', 
        subject: 'Computer Science',
        classCode: '9156',
        teacher: 'Mr. Kumar',
        createdAt: '25/01/2026',
        schedule: 'Tue, Thu, Sat',
        status: 'active',
        tags: ['Python', 'Algorithms', 'Projects']
    },
    { 
        id: 6, 
        name: 'Biology Fundamentals', 
        description: 'Cell Biology and Human Anatomy for Class 11',
        students: 30, 
        section: 'B', 
        subject: 'Biology',
        classCode: '6473',
        teacher: 'Dr. Singh',
        createdAt: '28/01/2026',
        schedule: 'Mon, Wed',
        status: 'upcoming',
        tags: ['Anatomy', 'Genetics', 'Lab']
    },
];

export default function ClassesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredClasses = sampleClasses.filter(cls => {
        const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.classCode.includes(searchTerm) ||
            cls.teacher.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || cls.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalClasses = sampleClasses.length;
    const activeClasses = sampleClasses.filter(c => c.status === 'active').length;
    const inactiveClasses = sampleClasses.filter(c => c.status === 'inactive').length;
    const upcomingClasses = sampleClasses.filter(c => c.status === 'upcoming').length;
    const totalStudents = sampleClasses.reduce((sum, c) => sum + c.students, 0);

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Class Dashboard</h1>
                    <p className={styles.subtitle}>Manage and view all your classes and student groups</p>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className={styles.searchBar}>
                <div className={styles.searchInputWrapper}>
                    <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, code, or teacher..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.filterGroup}>
                    <button className={styles.filterBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                    </button>
                    <select 
                        className={styles.statusSelect}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="upcoming">Upcoming</option>
                    </select>
                    <button className={styles.refreshBtn}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Total Classes</span>
                    <span className={styles.statValue}>{totalClasses}</span>
                </div>
                <div className={`${styles.statCard} ${styles.statCardActive}`}>
                    <span className={styles.statLabelGreen}>Active</span>
                    <span className={styles.statValueGreen}>{activeClasses}</span>
                </div>
                <div className={`${styles.statCard} ${styles.statCardInactive}`}>
                    <span className={styles.statLabelOrange}>Inactive</span>
                    <span className={styles.statValueOrange}>{inactiveClasses}</span>
                </div>
                <div className={`${styles.statCard} ${styles.statCardUpcoming}`}>
                    <span className={styles.statLabelBlue}>Upcoming</span>
                    <span className={styles.statValueBlue}>{upcomingClasses}</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Total Students</span>
                    <span className={styles.statValue}>{totalStudents}</span>
                </div>
            </div>

            {/* Classes Grid */}
            <div className={styles.classesGrid}>
                {filteredClasses.map((cls) => (
                    <div key={cls.id} className={styles.classCard}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.className}>{cls.name}</h3>
                            <span className={`${styles.statusBadge} ${styles[`status${cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}`]}`}>
                                {cls.status}
                            </span>
                        </div>
                        <p className={styles.classDescription}>{cls.description}</p>
                        
                        <div className={styles.classCodeBox}>
                            <div className={styles.classCodeLabel}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="16 18 22 12 16 6" />
                                    <polyline points="8 6 2 12 8 18" />
                                </svg>
                                Class Code
                            </div>
                            <span className={styles.classCodeValue}>{cls.classCode}</span>
                        </div>

                        <div className={styles.cardMeta}>
                            <div className={styles.metaItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                {cls.teacher}
                            </div>
                            <div className={styles.metaItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                {cls.createdAt}
                            </div>
                        </div>
                        <div className={styles.cardMeta}>
                            <div className={styles.metaItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                {cls.schedule}
                            </div>
                            <div className={styles.metaItem}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                {cls.students} Students
                            </div>
                        </div>

                        <div className={styles.tagsList}>
                            {cls.tags.map((tag, index) => (
                                <span key={index} className={styles.tag}>
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className={styles.cardActions}>
                            <button className={styles.previewBtn}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                View Class
                            </button>
                            <button className={styles.downloadBtn}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
