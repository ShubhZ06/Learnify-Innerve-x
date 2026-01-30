'use client';

import { useState, useCallback } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    BackgroundVariant,
    Node,
    Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from './page.module.css';

// Initial nodes for Manual mode
const initialNodes: Node[] = [
    {
        id: '1',
        type: 'default',
        position: { x: 100, y: 100 },
        data: { label: 'User Input' },
        style: { background: '#ffffff', color: '#1e293b', border: '2px solid #3b82f6', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)' },
    },
    {
        id: '2',
        type: 'default',
        position: { x: 350, y: 100 },
        data: { label: 'Generate' },
        style: { background: '#ffffff', color: '#1e293b', border: '2px solid #3b82f6', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)' },
    },
    {
        id: '3',
        type: 'default',
        position: { x: 600, y: 100 },
        data: { label: 'Output' },
        style: { background: '#ffffff', color: '#1e293b', border: '2px solid #3b82f6', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)' },
    },
    {
        id: '4',
        type: 'default',
        position: { x: 350, y: 250 },
        data: { label: 'Add Assets' },
        style: { background: '#ffffff', color: '#1e293b', border: '2px solid #3b82f6', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)' },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#3b82f6' } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#3b82f6' } },
    { id: 'e4-2', source: '4', target: '2', animated: true, style: { stroke: '#3b82f6' } },
];

interface Message {
    id: number;
    type: 'user' | 'ai';
    content: string;
}

export default function AIStudioPage() {
    const [mode, setMode] = useState<'ai' | 'manual'>('ai');
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [outputContent, setOutputContent] = useState<string>('');
    const [appName, setAppName] = useState('Untitled App');
    const [isSaved, setIsSaved] = useState(true);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#3b82f6' } }, eds)),
        [setEdges]
    );

    const handleSendMessage = () => {
        if (!prompt.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            type: 'user',
            content: prompt,
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsSaved(false);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: Date.now() + 1,
                type: 'ai',
                content: `I'll help you build that! Based on your request "${prompt}", I'm generating the content...`,
            };
            setMessages((prev) => [...prev, aiResponse]);
            setOutputContent(`Generated output for: ${prompt}`);
            setIsSaved(true);
        }, 1000);

        setPrompt('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const addNode = (type: string) => {
        const newNode: Node = {
            id: `${nodes.length + 1}`,
            type: 'default',
            position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
            data: { label: type },
            style: { background: '#ffffff', color: '#1e293b', border: '2px solid #3b82f6', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)' },
        };
        setNodes((nds) => [...nds, newNode]);
    };

    return (
        <div className={styles.studioContainer}>
            {/* Top Header Bar */}
            <div className={styles.topBar}>
                <div className={styles.topBarLeft}>
                    <button className={styles.backBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        value={appName}
                        onChange={(e) => { setAppName(e.target.value); setIsSaved(false); }}
                        className={styles.appNameInput}
                    />
                    <span className={styles.experimentBadge}>EXPERIMENT</span>
                    <span className={styles.draftBadge}>Draft</span>
                </div>
                <div className={styles.topBarCenter}>
                    <button
                        className={`${styles.modeBtn} ${mode === 'ai' ? styles.modeBtnActive : ''}`}
                        onClick={() => setMode('ai')}
                    >
                        AI
                    </button>
                    <button
                        className={`${styles.modeBtn} ${mode === 'manual' ? styles.modeBtnActive : ''}`}
                        onClick={() => setMode('manual')}
                    >
                        Manual
                    </button>
                </div>
                <div className={styles.topBarRight}>
                    <span className={styles.savedStatus}>{isSaved ? 'Saved' : 'Saving...'}</span>
                    <button className={styles.shareBtn}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        Share App
                    </button>
                    <button className={styles.settingsBtn}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={styles.mainContent}>
                {mode === 'ai' ? (
                    /* AI Mode Layout */
                    <>
                        {/* Left Panel - Chat Interface */}
                        <div className={styles.chatPanel}>
                            {/* Toolbar */}
                            <div className={styles.toolbar}>
                                <button className={styles.toolbarBtn}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <line x1="9" y1="3" x2="9" y2="21" />
                                    </svg>
                                    User Input
                                </button>
                                <button className={styles.toolbarBtn}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                    Generate
                                </button>
                                <button className={styles.toolbarBtn}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                        <line x1="12" y1="8" x2="12" y2="16" />
                                    </svg>
                                    Output
                                </button>
                                <button className={styles.toolbarBtn}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <line x1="12" y1="8" x2="12" y2="16" />
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                    Add Assets
                                </button>
                            </div>

                            {/* Chat Messages Area */}
                            <div className={styles.chatArea}>
                                {messages.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <div className={styles.annotation} style={{ top: '80px', left: '60%' }}>
                                            <span className={styles.annotationText}>Add a step to get started</span>
                                            <svg width="60" height="60" viewBox="0 0 60 60" className={styles.arrow}>
                                                <path d="M10 50 Q 30 30, 50 10" stroke="#3b82f6" strokeWidth="2" fill="none" />
                                                <polygon points="45,5 55,10 48,18" fill="#3b82f6" />
                                            </svg>
                                        </div>
                                        <h1 className={styles.heroTitle}>Let&apos;s build your app</h1>
                                        <p className={styles.heroSubtitle}>
                                            Take a look at our <a href="#" className={styles.demoLink}>demo video</a>
                                        </p>
                                        <div className={styles.annotation2}>
                                            <span className={styles.annotationText}>... or type what you want to build</span>
                                            <svg width="60" height="80" viewBox="0 0 60 80" className={styles.arrow2}>
                                                <path d="M30 0 Q 30 40, 30 70" stroke="#3b82f6" strokeWidth="2" fill="none" />
                                                <polygon points="25,65 30,80 35,65" fill="#3b82f6" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.messagesList}>
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`${styles.message} ${msg.type === 'user' ? styles.userMessage : styles.aiMessage}`}
                                            >
                                                {msg.content}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Prompt Input */}
                            <div className={styles.promptContainer}>
                                <div className={styles.promptBox}>
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Describe what you want to build"
                                        className={styles.promptInput}
                                    />
                                    <button className={styles.micBtn}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                            <line x1="12" y1="19" x2="12" y2="23" />
                                            <line x1="8" y1="23" x2="16" y2="23" />
                                        </svg>
                                    </button>
                                    <button className={styles.sendBtn} onClick={handleSendMessage}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="22" y1="2" x2="11" y2="13" />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Output Preview */}
                        <div className={styles.outputPanel}>
                            <div className={styles.outputTabs}>
                                <button className={`${styles.outputTab} ${styles.outputTabActive}`}>Preview</button>
                                <button className={styles.outputTab}>Console</button>
                                <button className={styles.outputTab}>Step</button>
                                <button className={styles.outputTab}>Theme</button>
                            </div>
                            <div className={styles.outputContent}>
                                {outputContent ? (
                                    <div className={styles.previewContent}>
                                        <div className={styles.previewPlaceholder}>
                                            {outputContent}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.emptyPreview}>
                                        <p>Your app will appear here once it&apos;s built</p>
                                    </div>
                                )}
                            </div>
                            {/* Side Controls */}
                            <div className={styles.sideControls}>
                                <button className={styles.sideControlBtn}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="3" width="20" height="14" rx="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                </button>
                                <button className={styles.sideControlBtn}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </button>
                                <button className={styles.sideControlBtn}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </button>
                                <button className={styles.sideControlBtn}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                        <path d="M3 3v5h5" />
                                    </svg>
                                </button>
                                <button className={styles.sideControlBtn}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                        <path d="M21 3v5h-5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Manual Mode - React Flow */
                    <div className={styles.flowContainer}>
                        {/* Flow Toolbar */}
                        <div className={styles.flowToolbar}>
                            <button className={styles.flowToolbarBtn} onClick={() => addNode('User Input')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <line x1="9" y1="3" x2="9" y2="21" />
                                </svg>
                                User Input
                            </button>
                            <button className={styles.flowToolbarBtn} onClick={() => addNode('Generate')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                                Generate
                            </button>
                            <button className={styles.flowToolbarBtn} onClick={() => addNode('Output')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                                Output
                            </button>
                            <button className={styles.flowToolbarBtn} onClick={() => addNode('Add Assets')}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <line x1="12" y1="8" x2="12" y2="16" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                                Add Assets
                            </button>
                        </div>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            fitView
                            style={{ background: '#f8fafc' }}
                        >
                            <Controls style={{ background: '#ffffff', borderRadius: '8px' }} />
                            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
                        </ReactFlow>
                    </div>
                )}
            </div>
        </div>
    );
}
