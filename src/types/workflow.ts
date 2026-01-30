// Opal-Lite Workflow Engine Types
// Strict JSON schema for DAG-based workflow orchestration

export type NodeType = 'UserInput' | 'AIGenerate' | 'Output';

export interface WorkflowNode {
    node_id: string;
    node_type: NodeType;
    input_refs: string[];  // References like "@Step1" or "@node_id"
    prompt_template?: string;
    label?: string;
    config?: Record<string, unknown>;
}

export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
}

export interface WorkflowDAG {
    id: string;
    name: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    created_at: string;
}

export interface LogEntry {
    id: string;
    timestamp: string;
    level: 'info' | 'success' | 'error' | 'step';
    message: string;
    nodeId?: string;
    data?: unknown;
}

export interface NodeOutput {
    nodeId: string;
    output: string;
    timestamp: string;
}

export interface ExecutionResult {
    success: boolean;
    finalOutput?: string;
    nodeOutputs: Record<string, string>;
    logs: LogEntry[];
    error?: string;
}

// JSON Schema for "Architect" agent output validation
export const DAG_JSON_SCHEMA = {
    type: 'object',
    required: ['id', 'name', 'nodes', 'edges'],
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        nodes: {
            type: 'array',
            items: {
                type: 'object',
                required: ['node_id', 'node_type', 'input_refs'],
                properties: {
                    node_id: { type: 'string' },
                    node_type: { enum: ['UserInput', 'AIGenerate', 'Output'] },
                    input_refs: { type: 'array', items: { type: 'string' } },
                    prompt_template: { type: 'string' },
                    label: { type: 'string' },
                    config: { type: 'object' }
                }
            }
        },
        edges: {
            type: 'array',
            items: {
                type: 'object',
                required: ['id', 'source', 'target'],
                properties: {
                    id: { type: 'string' },
                    source: { type: 'string' },
                    target: { type: 'string' }
                }
            }
        }
    }
} as const;
