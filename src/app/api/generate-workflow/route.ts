import { NextRequest, NextResponse } from 'next/server';
import type { WorkflowDAG, WorkflowNode, WorkflowEdge } from '@/types/workflow';

// Generate Workflow API Route
// Translates natural language into a JSON DAG using Gemini 2.5 Flash

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface GenerateWorkflowRequest {
    prompt: string;
    options?: {
        maxSteps?: number;
    };
}

interface GenerateWorkflowResponse {
    success: boolean;
    dag?: WorkflowDAG;
    error?: string;
}

async function callGeminiArchitect(userPrompt: string): Promise<WorkflowDAG> {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

    const architectPrompt = `You are the Opal-Lite Architect Agent. Your job is to translate natural language app ideas into a JSON Directed Acyclic Graph (DAG) workflow.

Available node types:
- UserInput: Captures initial user input (always the first node)
- AIGenerate: Processes data using AI generation with a prompt template
- Output: Displays the final result (always the last node)

Rules:
1. Every workflow MUST start with a UserInput node and end with an Output node
2. Use @Step1, @Step2 etc. in prompt_template to reference previous node outputs
3. Break complex tasks into logical steps (3-6 nodes is ideal)
4. Each AIGenerate node should do ONE specific task

Example output format:
{
  "id": "workflow_123",
  "name": "Quiz Generator",
  "nodes": [
    {"node_id": "step_1", "node_type": "UserInput", "input_refs": [], "label": "Enter Topic", "prompt_template": ""},
    {"node_id": "step_2", "node_type": "AIGenerate", "input_refs": ["@Step1"], "label": "Generate Questions", "prompt_template": "Create 5 quiz questions about: @Step1"},
    {"node_id": "step_3", "node_type": "Output", "input_refs": ["@Step2"], "label": "Display Quiz"}
  ],
  "edges": [
    {"id": "e1-2", "source": "step_1", "target": "step_2"},
    {"id": "e2-3", "source": "step_2", "target": "step_3"}
  ]
}

User's app idea: "${userPrompt}"

Output ONLY valid JSON, no markdown code blocks, no explanation:`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: architectPrompt }] }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 2048,
            }
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const candidates = data.candidates || [];

    if (candidates.length === 0) {
        throw new Error('No response from Gemini');
    }

    const textPart = candidates[0]?.content?.parts?.find((p: { text?: string }) => p.text);
    let jsonText = textPart?.text || '';

    // Clean up response - remove markdown if present
    jsonText = jsonText.trim();
    if (jsonText.startsWith('```json')) jsonText = jsonText.slice(7);
    if (jsonText.startsWith('```')) jsonText = jsonText.slice(3);
    if (jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3);
    jsonText = jsonText.trim();

    try {
        const dag = JSON.parse(jsonText);

        // Validate required fields
        if (!dag.id) dag.id = `workflow_${Date.now()}`;
        if (!dag.name) dag.name = 'Generated Workflow';
        if (!dag.nodes || !Array.isArray(dag.nodes)) throw new Error('Invalid nodes array');
        if (!dag.edges || !Array.isArray(dag.edges)) dag.edges = [];

        // Add created_at
        dag.created_at = new Date().toISOString();

        // Auto-generate edges if missing
        if (dag.edges.length === 0 && dag.nodes.length > 1) {
            dag.edges = dag.nodes.slice(0, -1).map((node: WorkflowNode, i: number) => ({
                id: `e${i + 1}-${i + 2}`,
                source: node.node_id,
                target: dag.nodes[i + 1].node_id
            }));
        }

        return dag as WorkflowDAG;
    } catch (parseError) {
        console.error('Failed to parse DAG JSON:', jsonText);
        throw new Error('Failed to parse workflow DAG from Gemini response');
    }
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateWorkflowResponse>> {
    try {
        const body: GenerateWorkflowRequest = await request.json();

        if (!body.prompt || typeof body.prompt !== 'string') {
            return NextResponse.json({
                success: false,
                error: 'Missing or invalid "prompt" field'
            }, { status: 400 });
        }

        const dag = await callGeminiArchitect(body.prompt);

        return NextResponse.json({
            success: true,
            dag
        });

    } catch (error) {
        console.error('Generate Workflow Error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }, { status: 500 });
    }
}

export async function GET(): Promise<NextResponse> {
    return NextResponse.json({
        status: 'ok',
        endpoint: '/api/generate-workflow',
        method: 'POST',
        body: { prompt: 'string', options: { maxSteps: 'number (optional)' } }
    });
}
