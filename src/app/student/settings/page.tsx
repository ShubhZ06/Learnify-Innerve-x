'use client';

import Navbar from '@/components/student/Navbar';
import styles from './page.module.css';

export default function SettingsPage() {
    return (
        <div className={styles.settings}>
            <Navbar />
            <div className={styles.mainContainer}>
                <h1 className={styles.pageTitle}>⚙️ Settings</h1>
                <p className={styles.pageDesc}>Manage your account preferences and settings</p>

                <div className={styles.settingsGrid}>
                    {/* Appearance */}
                    <div className={styles.settingsCard}>
                        <h2>🎨 Appearance</h2>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingLabel}>Theme</span>
                                <span className={styles.settingDesc}>Choose your preferred theme</span>
                            </div>
                            <select className={styles.settingSelect}>
                                <option>Light</option>
                                <option>Dark</option>
                                <option>System</option>
                            </select>
                        </div>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingLabel}>Font Size</span>
                                <span className={styles.settingDesc}>Adjust text size</span>
                            </div>
                            <select className={styles.settingSelect}>
                                <option>Small</option>
                                <option>Medium</option>
                                <option>Large</option>
                            </select>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className={styles.settingsCard}>
                        <h2>🔔 Notifications</h2>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingLabel}>Push Notifications</span>
                                <span className={styles.settingDesc}>Receive push notifications</span>
                            </div>
                            <label className={styles.toggle}>
                                <input type="checkbox" defaultChecked />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingLabel}>Email Notifications</span>
                                <span className={styles.settingDesc}>Receive email updates</span>
                            </div>
                            <label className={styles.toggle}>
                                <input type="checkbox" defaultChecked />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingLabel}>Assignment Reminders</span>
                                <span className={styles.settingDesc}>Get reminded about due dates</span>
                            </div>
                            <label className={styles.toggle}>
                                <input type="checkbox" defaultChecked />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className={styles.settingsCard}>
                        <h2>🔒 Privacy</h2>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingLabel}>Profile Visibility</span>
                                <span className={styles.settingDesc}>Who can see your profile</span>
                            </div>
                            <select className={styles.settingSelect}>
                                <option>Everyone</option>
                                <option>Classmates Only</option>
                                <option>Teachers Only</option>
                                <option>Private</option>
                            </select>
                        </div>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingLabel}>Show Learning Progress</span>
                                <span className={styles.settingDesc}>Display progress to others</span>
                            </div>
                            <label className={styles.toggle}>
                                <input type="checkbox" />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>

                    {/* Language */}
                    <div className={styles.settingsCard}>
                        <h2>🌐 Language & Region</h2>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingLabel}>Language</span>
                                <span className={styles.settingDesc}>Select your preferred language</span>
                            </div>
                            <select className={styles.settingSelect}>
                                <option>English</option>
                                <option>Hindi</option>
                                <option>Marathi</option>
                                <option>Tamil</option>
                            </select>
                        </div>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <span className={styles.settingLabel}>Time Zone</span>
                                <span className={styles.settingDesc}>Set your time zone</span>
                            </div>
                            <select className={styles.settingSelect}>
                                <option>IST (UTC+5:30)</option>
                                <option>UTC</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button className={styles.saveBtn}>💾 Save Changes</button>
            </div>
        </div>
    );
}
