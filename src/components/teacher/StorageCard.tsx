import styles from './StorageCard.module.css';

export default function StorageCard() {
    const usedGB = 2.3;
    const totalGB = 4.0;
    const percentage = (usedGB / totalGB) * 100;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>Storage</h3>
                <span className={styles.plan}>Basic Plan</span>
            </div>

            <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: `${percentage}%` }}></div>
            </div>

            <div className={styles.stats}>
                <span>{usedGB} GB used</span>
                <span>{totalGB} GB total</span>
            </div>

            <button className={styles.manageBtn}>Manage Storage</button>
        </div>
    );
}
