import React from 'react';

export default function QuizCard({ question, index, onSelect, selectedIndex, showCorrect, disabled }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow max-w-3xl mx-auto">
      <div className="mb-2 text-sm text-slate-500">Question {index + 1}</div>
      <div className="text-lg font-semibold mb-4">{question.question}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options.map((opt, i) => {
          let classes = 'px-3 py-2 rounded border text-left cursor-pointer select-none';

          if (selectedIndex === i && disabled) {
            if (showCorrect) {
              classes += ' border-emerald-500 bg-emerald-50';
            } else {
              classes += ' border-red-500 bg-red-50';
            }
          } else {
            classes += ' border-slate-200 hover:bg-slate-50';
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
