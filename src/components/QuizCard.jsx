// FILE: src/components/QuizCard.jsx
import React from "react";

export default function QuizCard({
  question,
  index,
  onSelect,
  selectedIndex,
  showCorrect,
  disabled,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow max-w-3xl mx-auto">
      {/* Question number */}
      <div className="mb-2 text-sm text-slate-500">Question {index + 1}</div>

      {/* Question text */}
      <div className="text-lg font-semibold mb-4">{question.question}</div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options.map((opt, i) => {
          let classes =
            "px-3 py-2 rounded border text-left cursor-pointer select-none transition";

          // Highlight selected & correct/incorrect answers
          if (disabled) {
            if (i === question.correct) {
              // Always highlight correct answer when disabled
              classes += " border-emerald-500 bg-emerald-50";
            } else if (selectedIndex === i && selectedIndex !== question.correct) {
              // Highlight wrong selection in red
              classes += " border-red-500 bg-red-50";
            } else {
              classes += " border-slate-200";
            }
          } else {
            classes += " border-slate-200 hover:bg-slate-50";
          }

          return (
            <button
              key={i}
              className={classes}
              onClick={() => onSelect(i)}
              disabled={disabled}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
