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
    type: 'user' | 'ai' | 'system';
    content: string;
}

interface LogicStep {
    step: number;
    ui_component: string;
    api_call?: 'generation' | 'grounding' | 'code_execution';
    prompt_payload?: string;
    context_from?: number;
    instruction?: string;
    action?: string;
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
    const [isLoading, setIsLoading] = useState(false);
    const [logicFlow, setLogicFlow] = useState<LogicStep[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [stepResults, setStepResults] = useState<Record<number, string>>({});

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#3b82f6' } }, eds)),
        [setEdges]
    );

    // Call Opal API to generate logic flow
    const generateLogicFlow = async (appIdea: string): Promise<LogicStep[]> => {
        const response = await fetch('/api/opal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ app_idea: appIdea }),
        });
        const data = await response.json();
        if (data.success && data.logic_flow) {
            return data.logic_flow;
        }
        throw new Error(data.error || 'Failed to generate logic flow');
    };

    // Execute a step in the logic flow
    const executeStep = async (step: LogicStep, context: Record<number, string>): Promise<string> => {
        const response = await fetch('/api/opal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                logic_flow: logicFlow,
                execute_step: step.step,
                context,
            }),
        });
        const data = await response.json();
        if (data.success && data.step_result) {
            return data.step_result.output;
        }
        throw new Error(data.error || 'Failed to execute step');
    };

    // Run all steps in sequence
    const runLogicFlow = async (flow: LogicStep[]) => {
        const results: Record<number, string> = {};

        for (const step of flow) {
            setCurrentStep(step.step);

            const systemMsg: Message = {
                id: Date.now(),
                type: 'system',
                content: `⚡ Executing Step ${step.step}: ${step.ui_component}${step.api_call ? ` (${step.api_call})` : ''}`,
            };
            setMessages((prev) => [...prev, systemMsg]);

            try {
                const output = await executeStep(step, results);
                results[step.step] = output;
                setStepResults({ ...results });

                if (step.action === 'RENDER' || step.action === 'RENDER_FINAL_TEXT') {
                    setOutputContent(output);
                }
            } catch (error) {
                const errorMsg: Message = {
                    id: Date.now(),
                    type: 'ai',
                    content: `❌ Step ${step.step} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                };
                setMessages((prev) => [...prev, errorMsg]);
                break;
            }
        }

        setCurrentStep(0);
        return results;
    };

    const handleSendMessage = async () => {
        if (!prompt.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            type: 'user',
            content: prompt,
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsSaved(false);
        setIsLoading(true);

        try {
            // Call API with direct chat mode
            const response = await fetch('/api/opal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: prompt }),
            });
            const data = await response.json();

            if (data.success && data.chat_response) {
                const aiResponse: Message = {
                    id: Date.now() + 1,
                    type: 'ai',
                    content: data.chat_response,
                };
                setMessages((prev) => [...prev, aiResponse]);
                setOutputContent(data.chat_response);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }

        } catch (error) {
            const errorMsg: Message = {
                id: Date.now() + 5,
                type: 'ai',
                content: `❌ Error: ${error instanceof Error ? error.message : 'Something went wrong'}`,
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
            setIsSaved(true);
            setPrompt('');
        }
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
                    <span className={styles.experimentBadge}>OPAL</span>
                    <span className={styles.draftBadge}>{isLoading ? 'Processing...' : 'Ready'}</span>
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
                                        <h1 className={styles.heroTitle}>Opal Bridge Ready</h1>
                                        <p className={styles.heroSubtitle}>
                                            Powered by <span style={{ color: '#3b82f6', fontWeight: 600 }}>Gemini 2.0 Flash</span>
                                        </p>
                                        <div className={styles.annotation2}>
                                            <span className={styles.annotationText}>Describe your app idea below</span>
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
                                                className={`${styles.message} ${msg.type === 'user' ? styles.userMessage : msg.type === 'system' ? styles.systemMessage : styles.aiMessage}`}
                                            >
                                                {msg.content}
                                            </div>
                                        ))}
                                        {isLoading && currentStep > 0 && (
                                            <div className={styles.loadingIndicator}>
                                                <div className={styles.spinner}></div>
                                                <span>Processing Step {currentStep}...</span>
                                            </div>
                                        )}
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
                                        placeholder="e.g., Build a tool that finds company CEOs and writes welcome emails"
                                        className={styles.promptInput}
                                        disabled={isLoading}
                                    />
                                    <button className={styles.micBtn} disabled={isLoading}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                            <line x1="12" y1="19" x2="12" y2="23" />
                                            <line x1="8" y1="23" x2="16" y2="23" />
                                        </svg>
                                    </button>
                                    <button className={styles.sendBtn} onClick={handleSendMessage} disabled={isLoading}>
                                        {isLoading ? (
                                            <div className={styles.btnSpinner}></div>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="22" y1="2" x2="11" y2="13" />
                                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Output Preview */}
                        <div className={styles.outputPanel}>
                            <div className={styles.outputTabs}>
                                <button className={`${styles.outputTab} ${styles.outputTabActive}`}>Preview</button>
                                <button className={styles.outputTab}>Console</button>
                                <button className={styles.outputTab}>Flow</button>
                                <button className={styles.outputTab}>JSON</button>
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
                                        <p>Your generated content will appear here</p>
                                        {logicFlow.length > 0 && (
                                            <div className={styles.flowPreview}>
                                                <h4>Logic Flow:</h4>
                                                {logicFlow.map((step) => (
                                                    <div key={step.step} className={`${styles.flowStep} ${currentStep === step.step ? styles.activeStep : ''}`}>
                                                        Step {step.step}: {step.ui_component}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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
                        {/* Canvas Wrapper with bounded size */}
                        <div className={styles.canvasWrapper}>
                            <div className={styles.canvasContainer}>
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
