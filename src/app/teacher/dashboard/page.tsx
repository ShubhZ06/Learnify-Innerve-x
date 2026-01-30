import WelcomeCard from '@/components/teacher/WelcomeCard';
import StorageCard from '@/components/teacher/StorageCard';
import ImpactCard from '@/components/teacher/ImpactCard';
import HelpCard from '@/components/teacher/HelpCard';
import RecentCreations from '@/components/teacher/RecentCreations';
import styles from './page.module.css';

export default function TeacherDashboard() {
    return (
        <div className={styles.dashboard}>
            {/* Main Content Area */}
            <div className={styles.mainContent}>
                <WelcomeCard />
                <RecentCreations />
            </div>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <StorageCard />
                <ImpactCard />
                <HelpCard />
            </aside>
        </div>
    );
}
