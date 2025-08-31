import React, { useEffect, useState } from 'react';

export default function QuizTopic({ data, setData, topicId, onBack }) {
  const topic = data.topics.find(t => t.id === topicId);
  const [index, setIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setIndex(0);
    setShowCard(true);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
  }, [topicId]);

  if (!topic)
    return (
      <div>
        <p>Topic not found.</p>
        <button className="btn" onClick={onBack}>
          Back
        </button>
      </div>
    );

  const q = topic.questions[index];

  function handleAnswer(i) {
    if (revealed) return;
    setSelected(i);
    const correct = q.correct === i;
    setRevealed(true);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (index + 1 >= topic.questions.length) {
        setFinished(true);
        setShowCard(false);
      } else {
        setIndex(ind => ind + 1);
        setSelected(null);
        setRevealed(false);
        setShowCard(false);
        setTimeout(() => setShowCard(true), 300);
      }
    }, 1200);
  }

  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <button className="btn" onClick={onBack}>
          ← Topics
        </button>
        <h2>{topic.title}</h2>
        <div className="score-mini">
          Score: {score}/{topic.questions.length}
        </div>
      </div>

      <div className="quiz-stage">
        {/* Open box animation */}
        <div className={`open-box ${showCard ? 'open' : ''}`} aria-hidden>
          <div className="lid" />
          <div className="box" />
        </div>

        {/* Finished screen */}
        {finished ? (
          <div className="results">
            <h3>Quiz Finished!</h3>
            <p>
              Your Score: {score} / {topic.questions.length}
            </p>
            <button className="btn" onClick={onBack}>
              Back to Topics
            </button>
          </div>
        ) : q ? (
          <div className={`cue-card-wrapper ${showCard ? 'rise' : 'drop'}`}>
            <div className="cue-card">
              <h3>{q.text}</h3>
              <div className="options">
                {q.options.map((opt, i) => {
                  const isCorrect = q.correct === i;
                  const isSelected = selected === i;

                  let className = "option";
                  if (revealed && isSelected && isCorrect) className += " correct";
                  else if (revealed && isSelected && !isCorrect) className += " wrong";

                  return (
                    <button
                      key={i}
                      className={className}
                      onClick={() => handleAnswer(i)}
                      disabled={revealed}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Feedback after answer */}
              {revealed && (
                <div className="feedback">
                  {selected === q.correct ? (
                    <p className="explanation">✅ {q.explanation}</p>
                  ) : (
                    <p className="hint">❌ Hint: {q.hint}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
