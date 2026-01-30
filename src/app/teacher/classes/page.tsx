'use client';

import styles from './page.module.css';

const sampleClasses = [
    { id: 1, name: 'Mathematics 101', students: 32, section: 'A', subject: 'Mathematics' },
    { id: 2, name: 'Physics Advanced', students: 28, section: 'B', subject: 'Physics' },
    { id: 3, name: 'Chemistry Basics', students: 35, section: 'A', subject: 'Chemistry' },
];

export default function ClassesPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Classes</h1>
                    <p className={styles.subtitle}>Manage your classes and student groups</p>
                </div>
                <button className="btn btn-primary">+ Create Class</button>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Class Name</th>
                            <th>Subject</th>
                            <th>Section</th>
                            <th>Students</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleClasses.map((cls) => (
                            <tr key={cls.id}>
                                <td className={styles.className}>{cls.name}</td>
                                <td>{cls.subject}</td>
                                <td><span className={styles.badge}>{cls.section}</span></td>
                                <td>{cls.students}</td>
                                <td>
                                    <button className={styles.actionBtn}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
