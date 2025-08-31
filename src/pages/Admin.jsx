// FILE: src/pages/Admin.jsx
import React, { useState, useEffect } from "react"
import { getTopics, saveTopics } from "../data/topics"

export default function Admin({ onHome }) {
  /** ---------- LOGIN STATE ---------- **/
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Change these values as needed
  const ADMIN_USER = "admin"
  const ADMIN_PASS = "password123"

  // Restore login from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated")
    if (storedAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      setError("")
    } else {
      setError("Invalid username or password")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("isAuthenticated")
  }

  /** ---------- TOPIC STATE ---------- **/
  const [topics, setTopics] = useState(getTopics())
  const [activeTopic, setActiveTopic] = useState(null)

  const handleAddTopic = () => {
    const newTopic = {
      id: Date.now().toString(),
      title: "Untitled Topic",
      description: "",
      questions: [],
    }
    const updatedTopics = [...topics, newTopic]
    setTopics(updatedTopics)
    saveTopics(updatedTopics)
    setActiveTopic(newTopic)
  }

  const handleDeleteTopic = (id) => {
    const updatedTopics = topics.filter((t) => t.id !== id)
    setTopics(updatedTopics)
    saveTopics(updatedTopics)
    if (activeTopic?.id === id) setActiveTopic(null)
  }

  const handleUpdateTopic = (id, key, value) => {
    const updatedTopics = topics.map((t) =>
      t.id === id ? { ...t, [key]: value } : t
    )
    setTopics(updatedTopics)
    saveTopics(updatedTopics)
    if (activeTopic?.id === id) setActiveTopic({ ...activeTopic, [key]: value })
  }

  const handleAddQuestion = (topicId) => {
    const newQuestion = {
      id: Date.now().toString(),
      question: "Untitled Question",
      options: ["", "", "", ""],
      correct: 0,
      hint: "",
      explanation: "",
    }

    const updatedTopics = topics.map((t) =>
      t.id === topicId
        ? { ...t, questions: [...t.questions, newQuestion] }
        : t
    )

    setTopics(updatedTopics)
    saveTopics(updatedTopics)
    if (activeTopic?.id === topicId) {
      setActiveTopic({
        ...activeTopic,
        questions: [...activeTopic.questions, newQuestion],
      })
    }
  }

  const handleUpdateQuestion = (topicId, questionId, updater) => {
    const updatedTopics = topics.map((t) => {
      if (t.id !== topicId) return t
      return {
        ...t,
        questions: t.questions.map((q) =>
          q.id === questionId ? updater(q) : q
        ),
      }
    })

    setTopics(updatedTopics)
    saveTopics(updatedTopics)

    if (activeTopic?.id === topicId) {
      setActiveTopic({
        ...activeTopic,
        questions: activeTopic.questions.map((q) =>
          q.id === questionId ? updater(q) : q
        ),
      })
    }
  }

  /** ---------- LOGIN SCREEN ---------- **/
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-xl shadow-md w-80"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>

          {error && (
            <div className="text-red-500 text-sm mb-3 text-center">{error}</div>
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full mb-3 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  /** ---------- ADMIN PANEL ---------- **/
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <div className="flex gap-2">
          <button
            onClick={onHome}
            className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Sidebar */}
        <aside className="col-span-1">
          <button
            onClick={handleAddTopic}
            className="mb-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            + Add Topic
          </button>
          {topics.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveTopic(t)}
              className={`p-2 border rounded mb-2 cursor-pointer ${
                activeTopic?.id === t.id ? "bg-slate-100" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium truncate">{t.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTopic(t.id)
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </aside>

        {/* Main Editor */}
        <main className="col-span-2">
          {activeTopic ? (
            <div>
              {/* Topic Fields */}
              <input
                className="border p-2 w-full mb-2 rounded"
                value={activeTopic.title}
                onChange={(e) =>
                  handleUpdateTopic(activeTopic.id, "title", e.target.value)
                }
                placeholder="Topic title"
              />
              <textarea
                className="border p-2 w-full mb-4 rounded"
                value={activeTopic.description}
                onChange={(e) =>
                  handleUpdateTopic(
                    activeTopic.id,
                    "description",
                    e.target.value
                  )
                }
                placeholder="Topic description"
              />

              {/* Questions Section */}
              <h3 className="font-semibold mb-2">Questions</h3>
              <button
                onClick={() => handleAddQuestion(activeTopic.id)}
                className="mb-2 bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
              >
                + Add Question
              </button>

              {activeTopic.questions.map((q) => (
                <div
                  key={q.id}
                  className="border rounded p-3 mb-3 bg-white shadow-sm"
                >
                  {/* Question text */}
                  <input
                    className="border p-1 w-full mb-2 rounded"
                    value={q.question}
                    placeholder="Question text"
                    onChange={(e) =>
                      handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({
                        ...oldQ,
                        question: e.target.value,
                      }))
                    }
                  />

                  {/* Options */}
                  {q.options.map((opt, idx) => (
                    <input
                      key={idx}
                      className="border p-1 w-full mb-1 rounded"
                      value={opt}
                      placeholder={`Option ${idx + 1}`}
                      onChange={(e) =>
                        handleUpdateQuestion(
                          activeTopic.id,
                          q.id,
                          (oldQ) => ({
                            ...oldQ,
                            options: oldQ.options.map((o, j) =>
                              j === idx ? e.target.value : o
                            ),
                          })
                        )
                      }
                    />
                  ))}

                  {/* Hint */}
                  <input
                    className="border p-1 w-full mb-1 rounded"
                    value={q.hint}
                    placeholder="Hint"
                    onChange={(e) =>
                      handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({
                        ...oldQ,
                        hint: e.target.value,
                      }))
                    }
                  />

                  {/* Explanation */}
                  <input
                    className="border p-1 w-full mb-1 rounded"
                    value={q.explanation}
                    placeholder="Explanation"
                    onChange={(e) =>
                      handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({
                        ...oldQ,
                        explanation: e.target.value,
                      }))
                    }
                  />

                  {/* Correct Answer Index */}
                  <div className="text-xs mt-1 flex items-center">
                    Correct answer index:
                    <input
                      type="number"
                      min="0"
                      max="3"
                      className="border p-1 ml-2 w-16 rounded"
                      value={q.correct}
                      onChange={(e) =>
                        handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({
                          ...oldQ,
                          correct: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 italic">
              Select a topic to start editing
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
