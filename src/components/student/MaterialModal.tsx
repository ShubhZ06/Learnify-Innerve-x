'use client';

import { useState } from 'react';
import styles from './MaterialModal.module.css';

interface Question {
    id?: number;
    question: string;
    options: string[];
    correct: number;
    explanation?: string;
}

interface Flashcard {
    front: string;
    back: string;
}

interface MaterialModalProps {
    material: {
        _id: string;
        type: string;
        title: string;
        description: string;
        content?: string;
        jsonData?: any;
        teacher?: { name: string };
        createdAt?: string;
    };
    onClose: () => void;
}

export default function MaterialModal({ material, onClose }: MaterialModalProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
    const [quizComplete, setQuizComplete] = useState(false);
    const [currentCard, setCurrentCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Parse quiz questions from jsonData
    const getQuizQuestions = (): Question[] => {
        if (!material.jsonData) return [];
        if (Array.isArray(material.jsonData.questions)) {
            return material.jsonData.questions;
        }
        if (Array.isArray(material.jsonData)) {
            return material.jsonData;
        }
        return [];
    };

    // Parse flashcards from jsonData
    const getFlashcards = (): Flashcard[] => {
        if (!material.jsonData) return [];
        if (Array.isArray(material.jsonData.flashcards)) {
            return material.jsonData.flashcards;
        }
        if (Array.isArray(material.jsonData)) {
            return material.jsonData.map((item: any) => ({
                front: item.front || item.question || item.term || '',
                back: item.back || item.answer || item.definition || ''
            }));
        }
        return [];
    };

    const questions = getQuizQuestions();
    const flashcards = getFlashcards();

    // Initialize quiz answers
    if (questions.length > 0 && quizAnswers.length === 0) {
        setQuizAnswers(new Array(questions.length).fill(null));
    }

    const handleAnswerSelect = (optionIndex: number) => {
        if (showResult) return;
        setSelectedAnswer(optionIndex);
        const newAnswers = [...quizAnswers];
        newAnswers[currentQuestion] = optionIndex;
        setQuizAnswers(newAnswers);
    };

    const handleCheckAnswer = () => {
        setShowResult(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(quizAnswers[currentQuestion + 1]);
            setShowResult(false);
        } else {
            setQuizComplete(true);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedAnswer(quizAnswers[currentQuestion - 1]);
            setShowResult(quizAnswers[currentQuestion - 1] !== null);
        }
    };

    const calculateScore = () => {
        return quizAnswers.reduce((acc: number, answer, idx) => {
            return answer === questions[idx]?.correct ? acc + 1 : acc;
        }, 0);
    };

    const renderArticleContent = () => {
        const content = material.content || material.jsonData?.content || '';
        return (
            <div className={styles.articleContent}>
                <div className={styles.articleText} dangerouslySetInnerHTML={{
                    __html: content.replace(/\n/g, '<br/>')
                }} />
            </div>
        );
    };

    const renderQuizContent = () => {
        if (questions.length === 0) {
            return <div className={styles.emptyContent}>No quiz questions available</div>;
        }

        if (quizComplete) {
            const score = calculateScore();
            const percentage = Math.round((score / questions.length) * 100);
            return (
                <div className={styles.quizResults}>
                    <div className={styles.resultsEmoji}>
                        {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
                    </div>
                    <h3>{percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}</h3>
                    <div className={styles.scoreCircle}>
                        <span className={styles.scoreValue}>{percentage}%</span>
                    </div>
                    <div className={styles.scoreStats}>
                        <span>✅ Correct: {score}</span>
                        <span>❌ Incorrect: {questions.length - score}</span>
                    </div>
                    <button
                        className={styles.retryBtn}
                        onClick={() => {
                            setCurrentQuestion(0);
                            setSelectedAnswer(null);
                            setShowResult(false);
                            setQuizAnswers(new Array(questions.length).fill(null));
                            setQuizComplete(false);
                        }}
                    >
                        🔄 Try Again
                    </button>
                </div>
            );
        }

        const question = questions[currentQuestion];
        return (
            <div className={styles.quizContainer}>
                <div className={styles.quizProgress}>
                    Question {currentQuestion + 1} of {questions.length}
                </div>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                </div>

                <h3 className={styles.questionText}>{question.question}</h3>

                <div className={styles.optionsList}>
                    {question.options.map((option, idx) => (
                        <button
                            key={idx}
                            className={`${styles.optionBtn} 
                                ${selectedAnswer === idx ? styles.selected : ''} 
                                ${showResult && idx === question.correct ? styles.correct : ''} 
                                ${showResult && selectedAnswer === idx && idx !== question.correct ? styles.incorrect : ''}`}
                            onClick={() => handleAnswerSelect(idx)}
                        >
                            <span className={styles.optionLetter}>{String.fromCharCode(65 + idx)}</span>
                            <span>{option}</span>
                            {showResult && idx === question.correct && <span className={styles.checkIcon}>✓</span>}
                            {showResult && selectedAnswer === idx && idx !== question.correct && <span className={styles.wrongIcon}>✗</span>}
                        </button>
                    ))}
                </div>

                {showResult && question.explanation && (
                    <div className={`${styles.explanation} ${selectedAnswer === question.correct ? styles.correctExp : styles.incorrectExp}`}>
                        <strong>{selectedAnswer === question.correct ? '✅ Correct!' : '❌ Incorrect'}</strong>
                        <p>{question.explanation}</p>
                    </div>
                )}

                <div className={styles.quizNav}>
                    <button
                        className={styles.navBtn}
                        onClick={handlePrevQuestion}
                        disabled={currentQuestion === 0}
                    >
                        ← Previous
                    </button>
                    {!showResult ? (
                        <button
                            className={styles.checkBtn}
                            onClick={handleCheckAnswer}
                            disabled={selectedAnswer === null}
                        >
                            Check Answer
                        </button>
                    ) : (
                        <button className={styles.nextBtn} onClick={handleNextQuestion}>
                            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next →'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderFlashcards = () => {
        if (flashcards.length === 0) {
            return <div className={styles.emptyContent}>No flashcards available</div>;
        }

        const card = flashcards[currentCard];
        return (
            <div className={styles.flashcardContainer}>
                <div className={styles.flashcardProgress}>
                    Card {currentCard + 1} of {flashcards.length}
                </div>

                <div
                    className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className={styles.flashcardInner}>
                        <div className={styles.flashcardFront}>
                            <span className={styles.flipHint}>Click to flip</span>
                            <p>{card.front}</p>
                        </div>
                        <div className={styles.flashcardBack}>
                            <span className={styles.flipHint}>Click to flip</span>
                            <p>{card.back}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.flashcardNav}>
                    <button
                        onClick={() => { setCurrentCard(Math.max(0, currentCard - 1)); setIsFlipped(false); }}
                        disabled={currentCard === 0}
                    >
                        ← Previous
                    </button>
                    <button
                        onClick={() => { setCurrentCard(Math.min(flashcards.length - 1, currentCard + 1)); setIsFlipped(false); }}
                        disabled={currentCard === flashcards.length - 1}
                    >
                        Next →
                    </button>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (material.type) {
            case 'quiz':
                return renderQuizContent();
            case 'article':
            case 'announcement':
            case 'resource':
                if (flashcards.length > 0) {
                    return renderFlashcards();
                }
                return renderArticleContent();
            default:
                if (questions.length > 0) {
                    return renderQuizContent();
                }
                if (flashcards.length > 0) {
                    return renderFlashcards();
                }
                return renderArticleContent();
        }
    };

    const materialIcons: Record<string, string> = {
        quiz: '📊',
        assignment: '📝',
        video: '🎥',
        article: '📄',
        resource: '📚',
        announcement: '📢'
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <span className={styles.icon}>{materialIcons[material.type] || '📄'}</span>
                        <div>
                            <h2 className={styles.title}>{material.title}</h2>
                            <p className={styles.meta}>
                                {material.teacher?.name && <span>By {material.teacher.name}</span>}
                                {material.createdAt && (
                                    <span> • {new Date(material.createdAt).toLocaleDateString()}</span>
                                )}
                            </p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.body}>
                    {material.description && (
                        <p className={styles.description}>{material.description}</p>
                    )}
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
