import React, { useState, useEffect } from 'react';
import QuizCard from './QuizCard';

export default function QuizContainer({ topic, onBack }) {
  const total = topic.questions.length;
  const [idx, setIdx] = useState(-1); // -1 = before start
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Reset quiz state whenever topic changes
    setIdx(-1);
    setSelected(null);
    setLocked(false);
    setShowCorrect(false);
    setFinished(false);
    setScore(0);
  }, [topic.id]);

  function handleStart() {
    setIdx(0);
  }

  function handleSelect(i) {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    const correct = i === topic.questions[idx].correct;
    if (correct) {
      setShowCorrect(true);
      setScore(s => s + 1);
    } else {
      setShowCorrect(false);
    }
  }

  function handleNext() {
    setSelected(null);
    setLocked(false);
    setShowCorrect(false);
    if (idx + 1 < total) {
      setIdx(idx + 1);
    } else {
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">{topic.title} – Completed!</h2>
        <p className="mb-4 text-lg">
          Your Score: <strong>{score}</strong> / {total}
        </p>
        <button className="btn" onClick={onBack}>
          ← Back to Topics
        </button>
      </div>
    );
  }

  if (idx === -1) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">{topic.title}</h2>
        <p className="mb-4">This quiz has {total} questions.</p>
        <button className="btn" onClick={handleStart}>
          Start Quiz
        </button>
        <div className="mt-4">
          <button className="btn secondary" onClick={onBack}>
            ← Back to Topics
          </button>
        </div>
      </div>
    );
  }

  const curQ = topic.questions[idx];

  return (
    <div className="p-4">
      <div className="quiz-header flex justify-between items-center mb-4">
        <button className="btn small" onClick={onBack}>
          ← Topics
        </button>
        <h2 className="font-bold">{topic.title}</h2>
        <div className="score-mini">
          Score: {score}/{total}
        </div>
      </div>

      <QuizCard
        question={curQ}
        index={idx}
        onSelect={handleSelect}
        selectedIndex={selected}
        showCorrect={showCorrect}
        disabled={locked}
      />

      {locked && (
        <div className="text-center mt-4">
          <button className="btn" onClick={handleNext}>
            {idx + 1 < total ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
}
