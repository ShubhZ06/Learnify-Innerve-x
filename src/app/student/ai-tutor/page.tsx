'use client';

import { useState } from 'react';
import Navbar from '@/components/student/Navbar';
import styles from './page.module.css';

const formatModes = [
    { id: 'notes', label: 'Notes', icon: '📝', description: 'Text summaries' },
    { id: 'slides', label: 'Slides', icon: '📊', description: 'Presentations' },
    { id: 'visual', label: 'Visual', icon: '🖼️', description: 'Diagrams' },
    { id: 'voice', label: 'Voice', icon: '🔊', description: 'Audio' },
];

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'Computer Science'];
const grades = [6, 7, 8, 9, 10, 11, 12];

interface Message {
    id: number;
    type: 'user' | 'ai';
    content: string;
    format?: string;
}

export default function AITutorPage() {
    const [activeFormat, setActiveFormat] = useState('notes');
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('Mathematics');
    const [selectedGrade, setSelectedGrade] = useState(10);
    const [difficulty, setDifficulty] = useState(2); // 1=Easy, 2=Medium, 3=Hard
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: 'ai',
            content: "Hello! 👋 I'm your AI Tutor. Ask me anything about your studies! I can explain topics, create notes, generate diagrams, or even explain through voice. What would you like to learn today?",
        },
    ]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            type: 'user',
            content: inputText,
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: Date.now() + 1,
                type: 'ai',
                content: `Great question! Based on your ${selectedSubject} query at Grade ${selectedGrade} level (${['Easy', 'Medium', 'Hard'][difficulty - 1]} difficulty), here's my explanation in ${activeFormat} format:\n\n${getFormatResponse(activeFormat, inputText)}`,
                format: activeFormat,
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);
    };

    const getFormatResponse = (format: string, query: string) => {
        switch (format) {
            case 'notes':
                return `📝 **Key Points:**\n• ${query} is a fundamental concept\n• It involves understanding core principles\n• Practice is essential for mastery\n\n**Summary:** This topic builds upon your foundational knowledge and connects to real-world applications.`;
            case 'slides':
                return `📊 **Slide 1:** Introduction to ${query}\n📊 **Slide 2:** Core Concepts\n📊 **Slide 3:** Examples & Applications\n📊 **Slide 4:** Practice Problems\n📊 **Slide 5:** Key Takeaways`;
            case 'visual':
                return `🖼️ **Visual Diagram Generated:**\n[Concept Map showing ${query} relationships]\n\n• Central node: Main Topic\n• Connected nodes: Sub-concepts\n• Arrows showing relationships`;
            case 'voice':
                return `🔊 **Audio Explanation Ready:**\n\n"Let me explain ${query} step by step..."\n\n▶️ [Play Audio - 3:45]\n\nTranscript available below.`;
            default:
                return `Here's information about ${query}...`;
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.aiTutor}>
            <Navbar />

            <div className={styles.mainContainer}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>
                            <span className={styles.aiIcon}>🤖</span>
                            AI Tutor
                        </h1>
                        <p className={styles.subtitle}>Your personal learning assistant</p>
                    </div>
                    <button
                        className={`${styles.settingsBtn} ${showSettings ? styles.active : ''}`}
                        onClick={() => setShowSettings(!showSettings)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Settings
                    </button>
                </div>

                {/* Format Mode Selector */}
                <div className={styles.formatSelector}>
                    {formatModes.map((mode) => (
                        <button
                            key={mode.id}
                            className={`${styles.formatBtn} ${activeFormat === mode.id ? styles.active : ''}`}
                            onClick={() => setActiveFormat(mode.id)}
                        >
                            <span className={styles.formatIcon}>{mode.icon}</span>
                            <span className={styles.formatLabel}>{mode.label}</span>
                        </button>
                    ))}
                </div>

                <div className={styles.contentArea}>
                    {/* Chat Section */}
                    <div className={styles.chatSection}>
                        <div className={styles.messagesContainer}>
                            {messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`${styles.message} ${styles[message.type]} ${styles.fadeIn}`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {message.type === 'ai' && (
                                        <div className={styles.aiAvatar}>🤖</div>
                                    )}
                                    <div className={styles.messageContent}>
                                        <pre className={styles.messageText}>{message.content}</pre>
                                        {message.format && (
                                            <span className={styles.formatTag}>
                                                {formatModes.find(m => m.id === message.format)?.icon} {message.format}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Section */}
                        <div className={styles.inputSection}>
                            <div className={styles.inputWrapper}>
                                <textarea
                                    className={styles.textInput}
                                    placeholder="Ask me anything... (Press Enter to send)"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    rows={1}
                                />
                                <div className={styles.inputActions}>
                                    {/* Image Upload */}
                                    <button className={styles.actionBtn} title="Upload Image">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </button>

                                    {/* Voice Input */}
                                    <button
                                        className={`${styles.actionBtn} ${styles.voiceBtn} ${isRecording ? styles.recording : ''}`}
                                        onClick={() => setIsRecording(!isRecording)}
                                        title="Voice Input"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                            <line x1="12" y1="19" x2="12" y2="23" />
                                            <line x1="8" y1="23" x2="16" y2="23" />
                                        </svg>
                                    </button>

                                    {/* Send Button */}
                                    <button
                                        className={styles.sendBtn}
                                        onClick={handleSend}
                                        disabled={!inputText.trim()}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="22" y1="2" x2="11" y2="13" />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Sidebar */}
                    <aside className={`${styles.settingsPanel} ${showSettings ? styles.visible : ''}`}>
                        <div className={styles.settingsHeader}>
                            <h3>Learning Settings</h3>
                        </div>

                        {/* Subject Selection */}
                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>Subject / Topic</label>
                            <select
                                className={styles.select}
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                {subjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                        </div>

                        {/* Grade Selection */}
                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>Grade Level</label>
                            <div className={styles.gradeButtons}>
                                {grades.map(grade => (
                                    <button
                                        key={grade}
                                        className={`${styles.gradeBtn} ${selectedGrade === grade ? styles.active : ''}`}
                                        onClick={() => setSelectedGrade(grade)}
                                    >
                                        {grade}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Slider */}
                        <div className={styles.settingGroup}>
                            <label className={styles.settingLabel}>Difficulty</label>
                            <div className={styles.difficultySlider}>
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(Number(e.target.value))}
                                    className={styles.slider}
                                />
                                <div className={styles.difficultyLabels}>
                                    <span className={difficulty === 1 ? styles.active : ''}>Easy</span>
                                    <span className={difficulty === 2 ? styles.active : ''}>Medium</span>
                                    <span className={difficulty === 3 ? styles.active : ''}>Hard</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className={styles.quickActions}>
                            <button className={styles.quickActionBtn}>
                                <span>📚</span> Explain Topic
                            </button>
                            <button className={styles.quickActionBtn}>
                                <span>❓</span> Practice Quiz
                            </button>
                            <button className={styles.quickActionBtn}>
                                <span>🔍</span> Solve Problem
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
