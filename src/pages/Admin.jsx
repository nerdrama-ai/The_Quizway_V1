// FILE: src/pages/Admin.jsx
import React, { useState, useEffect } from "react"
import { getTopics, saveTopics } from "../data/topics"

export default function Admin({ onHome }) {
  /** ---------- LOGIN STATE ---------- **/
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const ADMIN_USER = "admin"
  const ADMIN_PASS = "password123"

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
  const [topics, setTopics] = useState(() => getTopics() || [])
  const [activeTopicId, setActiveTopicId] = useState(() => {
    const t = getTopics() || []
    return t.length ? t[0].id : null
  })

  const activeTopic = topics.find((t) => t.id === activeTopicId) || null

  useEffect(() => {
    if (!activeTopicId && topics.length > 0) {
      setActiveTopicId(topics[0].id)
    }
    if (activeTopicId && !topics.find((t) => t.id === activeTopicId)) {
      setActiveTopicId(topics[0]?.id || null)
    }
  }, [topics, activeTopicId])

  const [search, setSearch] = useState("")
  const [confirmDialog, setConfirmDialog] = useState(null)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = "info") => {
    const id = Date.now().toString()
    setToasts((s) => [...s, { id, message, type }])
    setTimeout(() => {
      setToasts((s) => s.filter((t) => t.id !== id))
    }, 3000)
  }

  const saveAndSetTopics = (updated) => {
    setTopics(updated)
    saveTopics(updated)
  }

  const handleAddTopic = () => {
    const newTopic = {
      id: Date.now().toString(),
      title: "Untitled Topic",
      description: "",
      timer: 0, // seconds
      keywords: [],
      questions: [],
    }
    saveAndSetTopics([...topics, newTopic])
    setActiveTopicId(newTopic.id)
    addToast("Topic added", "success")
  }

  const handleUpdateTopic = (id, key, value) => {
    const updated = topics.map((t) => (t.id === id ? { ...t, [key]: value } : t))
    saveAndSetTopics(updated)
  }

  const handleAddQuestion = (topicId) => {
    const newQ = {
      id: Date.now().toString(),
      question: "Untitled Question",
      options: ["", "", "", ""],
      correct: 0,
      hint: "",
      explanation: "",
    }
    const updated = topics.map((t) =>
      t.id === topicId ? { ...t, questions: [...t.questions, newQ] } : t
    )
    saveAndSetTopics(updated)
    addToast("Question added", "success")
  }

  const handleUpdateQuestion = (topicId, qid, updater) => {
    const updated = topics.map((t) =>
      t.id !== topicId
        ? t
        : { ...t, questions: t.questions.map((q) => (q.id === qid ? updater(q) : q)) }
    )
    saveAndSetTopics(updated)
  }

  /** ---------- LOGIN SCREEN ---------- **/
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md w-80"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="border p-2 w-full mb-2 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border p-2 w-full mb-4 rounded"
          />
          <button className="w-full bg-indigo-600 text-white py-2 rounded">
            Login
          </button>
        </form>
      </div>
    )
  }

  /** ---------- ADMIN PANEL ---------- **/
  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
      <header className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <div className="flex gap-2">
          <button onClick={onHome} className="px-3 py-1 bg-slate-200 rounded">
            Home
          </button>
          <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded">
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
        {/* Sidebar */}
        <aside className="col-span-1">
          <div className="mb-3 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics..."
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={handleAddTopic}
              className="bg-indigo-600 text-white px-3 rounded"
            >
              +
            </button>
          </div>

          <div className="space-y-2 max-h-[65vh] overflow-y-auto">
            {topics
              .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
              .map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTopicId(t.id)}
                  className={`p-2 border rounded cursor-pointer ${
                    activeTopicId === t.id ? "bg-indigo-100" : "hover:bg-slate-100"
                  }`}
                >
                  <div className="font-semibold">{t.title}</div>
                  {t.description && (
                    <div className="text-xs text-slate-500">{t.description}</div>
                  )}
                </div>
              ))}
          </div>
        </aside>

        {/* Editor */}
        <main className="col-span-2 space-y-6">
          {activeTopic ? (
            <>
              {/* Topic Info */}
              <section className="p-4 bg-white dark:bg-slate-800 rounded shadow">
                <h3 className="font-bold mb-2">Topic Info</h3>
                <input
                  className="border p-2 w-full mb-2 rounded"
                  value={activeTopic.title}
                  onChange={(e) => handleUpdateTopic(activeTopic.id, "title", e.target.value)}
                  placeholder="Title"
                />
                <textarea
                  className="border p-2 w-full mb-2 rounded"
                  value={activeTopic.description}
                  onChange={(e) =>
                    handleUpdateTopic(activeTopic.id, "description", e.target.value)
                  }
                  placeholder="Description"
                />
                <input
                  type="number"
                  className="border p-2 w-full mb-2 rounded"
                  value={activeTopic.timer}
                  onChange={(e) =>
                    handleUpdateTopic(activeTopic.id, "timer", Number(e.target.value))
                  }
                  placeholder="Timer (seconds, 0 = no limit)"
                />
                <input
                  className="border p-2 w-full mb-2 rounded"
                  value={activeTopic.keywords?.join(", ")}
                  onChange={(e) =>
                    handleUpdateTopic(
                      activeTopic.id,
                      "keywords",
                      e.target.value.split(",").map((k) => k.trim())
                    )
                  }
                  placeholder="Keywords (comma separated)"
                />
              </section>

              {/* Questions */}
              <section className="p-4 bg-white dark:bg-slate-800 rounded shadow">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">Questions</h3>
                  <button
                    onClick={() => handleAddQuestion(activeTopic.id)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded"
                  >
                    + Add Question
                  </button>
                </div>

                {activeTopic.questions.length === 0 && (
                  <p className="text-sm text-slate-500">No questions yet</p>
                )}

                {activeTopic.questions.map((q, qi) => (
                  <div key={q.id} className="p-3 border rounded mb-3">
                    <p className="font-medium mb-2">Q{qi + 1}</p>
                    <input
                      className="border p-1 w-full mb-2 rounded"
                      value={q.question}
                      onChange={(e) =>
                        handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({
                          ...oldQ,
                          question: e.target.value,
                        }))
                      }
                      placeholder="Question text"
                    />
                    {q.options.map((opt, oi) => (
                      <input
                        key={oi}
                        className="border p-1 w-full mb-1 rounded"
                        value={opt}
                        onChange={(e) =>
                          handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({
                            ...oldQ,
                            options: oldQ.options.map((o, j) =>
                              j === oi ? e.target.value : o
                            ),
                          }))
                        }
                        placeholder={`Option ${oi + 1}`}
                      />
                    ))}
                    <input
                      className="border p-1 w-full mb-1 rounded"
                      value={q.hint}
                      onChange={(e) =>
                        handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({
                          ...oldQ,
                          hint: e.target.value,
                        }))
                      }
                      placeholder="Hint"
                    />
                    <input
                      className="border p-1 w-full mb-1 rounded"
                      value={q.explanation}
                      onChange={(e) =>
                        handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({
                          ...oldQ,
                          explanation: e.target.value,
                        }))
                      }
                      placeholder="Explanation"
                    />
                    <label className="text-xs block mt-1">
                      Correct answer #:{" "}
                      <input
                        type="number"
                        min="1"
                        max={q.options.length}
                        value={q.correct + 1}
                        onChange={(e) =>
                          handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({
                            ...oldQ,
                            correct: Number(e.target.value) - 1,
                          }))
                        }
                        className="border p-1 w-16 ml-2 rounded"
                      />
                    </label>
                  </div>
                ))}
              </section>
            </>
          ) : (
            <p className="italic text-slate-500">Select a topic to edit</p>
          )}
        </main>
      </div>

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-3 py-2 rounded text-white ${
              t.type === "success"
                ? "bg-green-500"
                : t.type === "warning"
                ? "bg-yellow-500 text-black"
                : "bg-slate-800"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}
