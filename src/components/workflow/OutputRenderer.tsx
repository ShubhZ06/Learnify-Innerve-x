'use client';

import { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './OutputRenderer.module.css';

interface OutputRendererProps {
    content: string;
    format?: string;
}

export const OutputRenderer = memo(function OutputRenderer({ content, format }: OutputRendererProps) {
    // Try to parse JSON content
    let parsedContent: any = null;
    let isJson = false;

    try {
        if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
            parsedContent = JSON.parse(content);
            isJson = true;
        }
    } catch (e) {
        // Not JSON
    }

    // Determine render type
    const isQuiz = isJson && (parsedContent?.questions || Array.isArray(parsedContent) && parsedContent[0]?.question);
    const isFlashcards = isJson && (parsedContent?.cards || Array.isArray(parsedContent) && parsedContent[0]?.front);

    if (isQuiz) {
        return <QuizViewer data={parsedContent.questions || parsedContent} />;
    }

    if (isFlashcards) {
        return <FlashcardViewer data={parsedContent.cards || parsedContent} />;
    }

    // Default: Markdown
    return (
        <div className={styles.markdown}>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
});

function QuizViewer({ data }: { data: any[] }) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);

    return (
        <div className={styles.quizContainer}>
            {data.map((q, idx) => (
                <div key={idx} className={styles.questionCard}>
                    <p className={styles.questionText}><strong>Q{idx + 1}:</strong> {q.question}</p>
                    <div className={styles.optionsGrid}>
                        {q.options?.map((opt: string, oIdx: number) => (
                            <label key={oIdx} className={`${styles.optionLabel} ${showResults && opt === q.answer ? styles.correct : ''} ${showResults && answers[idx] === opt && opt !== q.answer ? styles.wrong : ''}`}>
                                <input
                                    type="radio"
                                    name={`q-${idx}`}
                                    value={opt}
                                    checked={answers[idx] === opt}
                                    onChange={() => setAnswers({ ...answers, [idx]: opt })}
                                    disabled={showResults}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <button
                className={styles.submitBtn}
                onClick={() => setShowResults(!showResults)}
            >
                {showResults ? 'Hide Answers' : 'Check Answers'}
            </button>
        </div>
    );
}

function FlashcardViewer({ data }: { data: any[] }) {
    const [flipped, setFlipped] = useState<Record<number, boolean>>({});

    return (
        <div className={styles.flashcardGrid}>
            {data.map((card, idx) => (
                <div
                    key={idx}
                    className={`${styles.flashcard} ${flipped[idx] ? styles.flipped : ''}`}
                    onClick={() => setFlipped({ ...flipped, [idx]: !flipped[idx] })}
                >
                    <div className={styles.cardFront}>
                        <p>{card.front || card.term}</p>
                        <span className={styles.flipHint}>Click to flip</span>
                    </div>
                    <div className={styles.cardBack}>
                        <p>{card.back || card.definition}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
