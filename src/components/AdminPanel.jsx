import React, { useState } from 'react';

// utility for unique IDs
function uid() {
  return Date.now() + Math.random().toString(36).substring(2, 9);
}

export default function AdminPanel({ data, setData, onBack }) {
  const [editingTopicId, setEditingTopicId] = useState(null);

  const selectedTopic = data.topics.find(t => t.id === editingTopicId) || null;

  function addQuestion(topicId) {
    const newQ = {
      id: uid(),
      question: "New question",
      options: ["", "", "", ""],
      correct: 0,
      hint: "",
      explanation: ""
    };
    setData(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === topicId ? { ...t, questions: [...t.questions, newQ] } : t
      )
    }));
  }

  function updateQuestion(topicId, qid, update) {
    setData(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === topicId
          ? {
              ...t,
              questions: t.questions.map(q =>
                q.id === qid ? { ...q, ...update } : q
              )
            }
          : t
      )
    }));
  }

  function removeQuestion(topicId, qid) {
    setData(d => ({
      ...d,
      topics: d.topics.map(t =>
        t.id === topicId
          ? { ...t, questions: t.questions.filter(q => q.id !== qid) }
          : t
      )
    }));
  }

  return (
    <div className="admin-panel">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin</h2>
        <div>
          <button className="btn" onClick={onBack}>Back</button>
        </div>
      </div>

      {/* Two columns layout */}
      <div className="admin-columns">
        {/* Left side: topics */}
        <div className="admin-left">
          <h3>Topics</h3>
          {data.topics.map(t => (
            <div
              key={t.id}
              className={`topic-row ${editingTopicId === t.id ? "active" : ""}`}
            >
              <div onClick={() => setEditingTopicId(t.id)}>
                <strong>{t.title}</strong>
                <div className="muted">{t.questions.length} questions</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn small"
                  onClick={() => {
                    const title = prompt("Rename topic", t.title);
                    if (title != null) {
                      setData(d => ({
                        ...d,
                        topics: d.topics.map(x =>
                          x.id === t.id ? { ...x, title } : x
                        )
                      }));
                    }
                  }}
                >
                  Rename
                </button>
                <button
                  className="btn small danger"
                  onClick={() => {
                    if (window.confirm("Delete topic?")) {
                      setData(d => ({
                        ...d,
                        topics: d.topics.filter(x => x.id !== t.id)
                      }));
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 12 }}>
            <button
              className="btn"
              onClick={() => {
                const t = { id: uid(), title: "New topic", questions: [] };
                setData(d => ({ ...d, topics: [...d.topics, t] }));
              }}
            >
              + New topic
            </button>
          </div>
        </div>

        {/* Right side: question editor */}
        <div className="admin-right">
          {selectedTopic ? (
            <div>
              <h3>Editing: {selectedTopic.title}</h3>
              <div style={{ marginBottom: 8 }}>
                <button className="btn" onClick={() => addQuestion(selectedTopic.id)}>
                  + Add question
                </button>
              </div>

              {selectedTopic.questions.map(q => (
                <div className="q-edit" key={q.id}>
                  <input
                    className="full"
                    value={q.question}
                    onChange={e =>
                      updateQuestion(selectedTopic.id, q.id, { question: e.target.value })
                    }
                  />
                  <div className="opts-edit">
                    {q.options.map((opt, i) => (
                      <input
                        key={i}
                        value={opt}
                        onChange={e =>
                          updateQuestion(selectedTopic.id, q.id, {
                            options: q.options.map((o, ii) =>
                              ii === i ? e.target.value : o
                            )
                          })
                        }
                      />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <label>Correct:</label>
                    <select
                      value={q.correct}
                      onChange={e =>
                        updateQuestion(selectedTopic.id, q.id, {
                          correct: Number(e.target.value)
                        })
                      }
                    >
                      {q.options.map((_, i) => (
                        <option key={i} value={i}>
                          {String.fromCharCode(65 + i)}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn small danger"
                      onClick={() => removeQuestion(selectedTopic.id, q.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <textarea
                    placeholder="Hint"
                    value={q.hint}
                    onChange={e =>
                      updateQuestion(selectedTopic.id, q.id, { hint: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Explanation"
                    value={q.explanation}
                    onChange={e =>
                      updateQuestion(selectedTopic.id, q.id, { explanation: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="muted">
              Select a topic on the left to edit its questions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
