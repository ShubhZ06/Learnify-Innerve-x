import { create } from 'zustand';
import type { WorkflowDAG, LogEntry, NodeOutput } from '@/types/workflow';

interface WorkflowState {
    // Current DAG
    currentDAG: WorkflowDAG | null;

    // Node outputs - tracks outputs for step references
    nodeOutputs: Record<string, string>;

    // Execution logs for Console tab
    executionLogs: LogEntry[];

    // Execution state
    isExecuting: boolean;
    currentNodeId: string | null;

    // User input for first node
    userInput: string;

    // Actions
    setDAG: (dag: WorkflowDAG | null) => void;
    setNodeOutput: (nodeId: string, output: string) => void;
    addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
    clearLogs: () => void;
    setExecuting: (isExecuting: boolean) => void;
    setCurrentNode: (nodeId: string | null) => void;
    setUserInput: (input: string) => void;
    reset: () => void;

    // Utility to get output by step reference (@Step1, @node_id)
    getOutputByRef: (ref: string) => string | undefined;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
    currentDAG: null,
    nodeOutputs: {},
    executionLogs: [],
    isExecuting: false,
    currentNodeId: null,
    userInput: '',

    setDAG: (dag) => set({ currentDAG: dag }),

    setNodeOutput: (nodeId, output) =>
        set((state) => ({
            nodeOutputs: { ...state.nodeOutputs, [nodeId]: output }
        })),

    addLog: (log) =>
        set((state) => ({
            executionLogs: [
                ...state.executionLogs,
                {
                    ...log,
                    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: new Date().toISOString()
                }
            ]
        })),

    clearLogs: () => set({ executionLogs: [] }),

    setExecuting: (isExecuting) => set({ isExecuting }),

    setCurrentNode: (nodeId) => set({ currentNodeId: nodeId }),

    setUserInput: (input) => set({ userInput: input }),

    reset: () => set({
        currentDAG: null,
        nodeOutputs: {},
        executionLogs: [],
        isExecuting: false,
        currentNodeId: null,
        userInput: ''
    }),

    getOutputByRef: (ref) => {
        const state = get();
        const cleanRef = ref.startsWith('@') ? ref.slice(1) : ref;

        // Handle @Step1, @Step2 format
        if (cleanRef.toLowerCase().startsWith('step')) {
            const stepNum = parseInt(cleanRef.slice(4), 10);
            if (state.currentDAG && stepNum > 0 && stepNum <= state.currentDAG.nodes.length) {
                const nodeId = state.currentDAG.nodes[stepNum - 1].node_id;
                return state.nodeOutputs[nodeId];
            }
        }

        // Handle direct node_id reference
        return state.nodeOutputs[cleanRef];
    }
}));
