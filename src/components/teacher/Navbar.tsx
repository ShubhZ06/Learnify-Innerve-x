'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const navLinks = [
    { href: '/teacher/dashboard', label: 'Dashboard' },
    { href: '/teacher/library', label: 'My Library' },
    { href: '/teacher/community', label: 'Community' },
    { href: '/teacher/settings', label: 'Settings' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/teacher/dashboard" className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" fill="#3b82f6" />
                            <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className={styles.logoText}>Shiksha AI</span>
                </Link>

                {/* Nav Links */}
                <div className={styles.navLinks}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Section */}
                <div className={styles.rightSection}>
                    {/* Online Status */}
                    <div className={styles.onlineStatus}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12.55C6.97 10.23 9.36 9 12 9s5.03 1.23 7 3.55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M8.53 16.11C9.59 14.89 10.75 14 12 14s2.41.89 3.47 2.11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="12" cy="19" r="1" fill="currentColor" />
                        </svg>
                        <span>Online</span>
                    </div>

                    {/* Globe Icon */}
                    <button className={styles.iconBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20M12 2c2.5 2.5 4 6 4 10s-1.5 7.5-4 10c-2.5-2.5-4-6-4-10s1.5-7.5 4-10z" />
                        </svg>
                    </button>

                    {/* Notifications */}
                    <button className={styles.iconBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>

                    {/* Profile */}
                    <button className={styles.profileBtn}>
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher"
                            alt="Profile"
                            className={styles.profileImg}
                        />
                    </button>
                </div>
            </div>
        </nav>
    );
}
