// FILE: src/components/Quiz.jsx
import React, { useState, useEffect } from "react";

export default function Quiz({ topic, onBack }) {
  const total = topic.questions.length;

  // === STATE MANAGEMENT ===
  const [idx, setIdx] = useState(-1); // Current question index (-1 means quiz not started)
  const [selected, setSelected] = useState(null); // User's selected option
  const [locked, setLocked] = useState(false); // Prevent selecting multiple answers
  const [showCorrect, setShowCorrect] = useState(false); // Highlight correct answer
  const [finished, setFinished] = useState(false); // Marks quiz completion
  const [score, setScore] = useState(0); // Tracks correct answers

  // Reset state when a new topic is chosen
  useEffect(() => {
    setIdx(-1);
    setSelected(null);
    setLocked(false);
    setShowCorrect(false);
    setFinished(false);
    setScore(0);
  }, [topic.id]);

  // Start quiz
  function handleStart() {
    setIdx(0);
  }

  // Handle option selection
  function handleSelect(i) {
    if (locked) return; // Ignore clicks after locking

    setSelected(i);
    setLocked(true);

    const correct = i === topic.questions[idx].correct;

    if (correct) {
      setShowCorrect(true);
      setScore((s) => s + 1); // Increase score
    } else {
      setShowCorrect(false);
    }
  }

  // Move to next question or finish
  function handleNext() {
    setSelected(null);
    setLocked(false);
    setShowCorrect(false);

    if (idx + 1 < total) {
      setIdx(idx + 1); // Go to next
    } else {
      setFinished(true); // End quiz
    }
  }

  // === QUIZ COMPLETED SCREEN ===
  if (finished) {
    return (
      <div className="p-8 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl text-white">
        <h2 className="text-3xl font-extrabold mb-4 tracking-wide">
          {topic.title} ✅ Completed!
        </h2>
        <p className="mb-6 text-xl">
          Your Score:{" "}
          <span className="text-emerald-400 font-bold">
            {score}
          </span>{" "}
          / {total}
        </p>
        <button
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium shadow-lg hover:shadow-cyan-500/50 transition-all"
          onClick={onBack}
        >
          ← Back to Topics
        </button>
      </div>
    );
  }

  // === QUIZ INTRO SCREEN (before starting) ===
  if (idx === -1) {
    return (
      <div className="p-8 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl text-white">
        <h2 className="text-2xl font-bold mb-4">{topic.title}</h2>
        <p className="mb-6">This quiz has {total} questions.</p>
        <button
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium shadow-lg hover:shadow-cyan-500/50 transition-all"
          onClick={handleStart}
        >
          🚀 Start Quiz
        </button>
        <div className="mt-4">
          <button
            className="px-4 py-2 rounded-lg bg-slate-700/80 text-slate-200 hover:bg-slate-600 transition-all"
            onClick={onBack}
          >
            ← Back to Topics
          </button>
        </div>
      </div>
    );
  }

  // === MAIN QUIZ SCREEN ===
  const curQ = topic.questions[idx];

  return (
    <div className="p-4">
      {/* Header with back + title + score */}
      <div className="quiz-header flex justify-between items-center mb-6 text-white">
        <button
          className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-sm transition-all shadow"
          onClick={onBack}
        >
          ← Topics
        </button>
        <h2 className="text-lg font-semibold tracking-wide">{topic.title}</h2>
        <div className="px-3 py-1.5 rounded-lg bg-slate-800/70 text-sm">
          Score:{" "}
          <span className="text-emerald-400 font-bold">
            {score}
          </span>{" "}
          / {total}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/10 max-w-3xl mx-auto text-white">
        {/* Question number */}
        <div className="mb-2 text-sm text-slate-300">
          Question {idx + 1}
        </div>

        {/* Question text */}
        <div className="text-xl font-semibold mb-6">
          {curQ.question}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {curQ.options.map((opt, i) => {
            let classes =
              "px-4 py-3 rounded-xl border text-left cursor-pointer select-none transition shadow-sm ";

            // Highlight selected & correct/incorrect answers
            if (locked) {
              if (i === curQ.correct) {
                classes +=
                  "border-emerald-400 bg-emerald-500/20 text-emerald-200";
              } else if (selected === i && selected !== curQ.correct) {
                classes +=
                  "border-red-400 bg-red-500/20 text-red-200";
              } else {
                classes += "border-slate-500/40 text-slate-300";
              }
            } else {
              classes +=
                "border-slate-500/40 hover:bg-white/10 hover:border-cyan-400";
            }

            return (
              <button
                key={i}
                className={classes}
                onClick={() => handleSelect(i)}
                disabled={locked}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next button (only visible after selection) */}
      {locked && (
        <div className="text-center mt-6">
          <button
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium shadow-lg hover:shadow-indigo-500/50 transition-all"
            onClick={handleNext}
          >
            {idx + 1 < total ? "Next Question →" : "Finish Quiz ✅"}
          </button>
        </div>
      )}
    </div>
  );
}
