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
  const [topics, setTopics] = useState(() => getTopics() || [])
  const [activeTopicId, setActiveTopicId] = useState(() => {
    const t = getTopics() || []
    return t.length ? t[0].id : null
  })

  // Derived active topic (keeps source of truth in topics[])
  const activeTopic = topics.find((t) => t.id === activeTopicId) || null

  // If topics exist but activeTopicId doesn't match, auto-select the first one
  useEffect(() => {
    if (!activeTopicId && topics && topics.length > 0) {
      setActiveTopicId(topics[0].id)
    }
    if (activeTopicId && !topics.find((t) => t.id === activeTopicId)) {
      setActiveTopicId(topics[0]?.id || null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics])

  const [search, setSearch] = useState("")

  // Confirmation dialog state: { type: 'topic'|'question', id, parentId? }
  const [confirmDialog, setConfirmDialog] = useState(null)

  // Toasts
  const [toasts, setToasts] = useState([])
  const addToast = (message, type = "info") => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2)
    setToasts((s) => [...s, { id, message, type }])
    // auto-remove
    setTimeout(() => {
      setToasts((s) => s.filter((t) => t.id !== id))
    }, 3500)
  }

  // Helper to save topics state centrally
  const saveAndSetTopics = (updatedTopics) => {
    setTopics(updatedTopics)
    saveTopics(updatedTopics)
  }

  const handleAddTopic = () => {
    const newTopic = {
      id: Date.now().toString(),
      title: "Untitled Topic",
      description: "",
      questions: [],
    }
    const updatedTopics = [...topics, newTopic]
    saveAndSetTopics(updatedTopics)
    setActiveTopicId(newTopic.id)
    addToast("Topic added", "success")
  }

  const handleDuplicateTopic = (id) => {
    const idx = topics.findIndex((t) => t.id === id)
    if (idx === -1) return
    const topic = topics[idx]
    const clone = {
      ...JSON.parse(JSON.stringify(topic)),
      id: Date.now().toString(),
      title: topic.title + " (Copy)",
      questions: topic.questions.map((q) => ({ ...q, id: Date.now().toString() + Math.random().toString(36).slice(2) })),
    }
    const updatedTopics = [...topics.slice(0, idx + 1), clone, ...topics.slice(idx + 1)]
    saveAndSetTopics(updatedTopics)
    setActiveTopicId(clone.id)
    addToast("Topic duplicated", "success")
  }

  const handleDeleteTopic = (id) => {
    const updatedTopics = topics.filter((t) => t.id !== id)
    saveAndSetTopics(updatedTopics)
    // choose next active topic
    if (activeTopicId === id) {
      setActiveTopicId(updatedTopics[0]?.id || null)
    }
    addToast("Topic deleted", "warning")
  }

  const handleUpdateTopic = (id, key, value) => {
    const updatedTopics = topics.map((t) => (t.id === id ? { ...t, [key]: value } : t))
    saveAndSetTopics(updatedTopics)
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
    const updatedTopics = topics.map((t) => (t.id === topicId ? { ...t, questions: [...t.questions, newQuestion] } : t))
    saveAndSetTopics(updatedTopics)
    setActiveTopicId(topicId)
    addToast("Question added", "success")
  }

  const handleUpdateQuestion = (topicId, questionId, updater) => {
    const updatedTopics = topics.map((t) => {
      if (t.id !== topicId) return t
      return { ...t, questions: t.questions.map((q) => (q.id === questionId ? updater(q) : q)) }
    })
    saveAndSetTopics(updatedTopics)
  }

  const handleDeleteQuestion = (topicId, questionId) => {
    const updatedTopics = topics.map((t) => (t.id === topicId ? { ...t, questions: t.questions.filter((q) => q.id !== questionId) } : t))
    saveAndSetTopics(updatedTopics)
    addToast("Question deleted", "warning")
  }

  const handleDuplicateQuestion = (topicId, questionId) => {
    const updatedTopics = topics.map((t) => {
      if (t.id !== topicId) return t
      const q = t.questions.find((q) => q.id === questionId)
      if (!q) return t
      const clone = { ...JSON.parse(JSON.stringify(q)), id: Date.now().toString(), question: q.question + " (Copy)" }
      return { ...t, questions: [...t.questions, clone] }
    })
    saveAndSetTopics(updatedTopics)
    addToast("Question duplicated", "success")
  }

  // Confirm dialog actions
  const confirmDelete = () => {
    if (!confirmDialog) return
    const { type, id, parentId } = confirmDialog
    if (type === "topic") {
      handleDeleteTopic(id)
    } else if (type === "question") {
      handleDeleteQuestion(parentId, id)
    }
    setConfirmDialog(null)
  }

  const cancelDelete = () => {
    setConfirmDialog(null)
  }

  /** ---------- LOGIN SCREEN ---------- **/
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-6 rounded-xl shadow-md w-80"
          aria-label="admin-login-form"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>

          {error && (
            <div className="text-red-500 text-sm mb-3 text-center" role="alert">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-full mb-3 rounded bg-white dark:bg-slate-700"
            aria-label="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-4 rounded bg-white dark:bg-slate-700"
            aria-label="password"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  /** ---------- ADMIN PANEL ---------- **/
  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <div className="flex gap-2">
          <button
            onClick={onHome}
            className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-200 dark:bg-red-700 text-red-700 dark:text-red-100 rounded hover:bg-red-300 dark:hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Sidebar */}
        <aside className="col-span-1">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-2 rounded bg-white dark:bg-slate-800"
              aria-label="search-topics"
            />
          </div>

          <div className="mb-3 flex gap-2">
            <button
              onClick={handleAddTopic}
              className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              + Add Topic
            </button>
            <button
              onClick={() => { navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(topics)); addToast('Topics JSON copied to clipboard', 'info') }}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              title="Copy topics JSON"
            >
              Export
            </button>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
            {topics.filter((t) => t.title.toLowerCase().includes(search.toLowerCase())).map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveTopicId(t.id)}
                className={`p-2 border rounded mb-2 cursor-pointer flex items-center justify-between ${
                  activeTopicId === t.id
                    ? "bg-white dark:bg-slate-800 ring-2 ring-indigo-300"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex-1 pr-2">
                  <div className="font-medium truncate">{t.title}</div>
                  {t.description && (
                    <div className="text-xs text-slate-500 dark:text-slate-300 truncate">{t.description}</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDuplicateTopic(t.id) }}
                    className="text-xs text-indigo-500 hover:underline"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDialog({ type: 'topic', id: t.id }) }}
                    className="text-xs text-red-500 hover:underline"
                    aria-label={`delete-topic-${t.id}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Editor */}
        <main className="col-span-2">
          {activeTopic ? (
            <div>
              {/* Topic Fields */}
              <input
                className="border p-2 w-full mb-2 rounded bg-white dark:bg-slate-800"
                value={activeTopic.title}
                onChange={(e) => handleUpdateTopic(activeTopic.id, 'title', e.target.value)}
                placeholder="Topic title"
                aria-label="topic-title"
              />

              <textarea
                className="border p-2 w-full mb-4 rounded bg-white dark:bg-slate-800"
                value={activeTopic.description}
                onChange={(e) => handleUpdateTopic(activeTopic.id, 'description', e.target.value)}
                placeholder="Topic description"
                aria-label="topic-description"
              />

              {/* Questions Section */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Questions</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddQuestion(activeTopic.id)}
                    className="bg-indigo-500 dark:bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-600 dark:hover:bg-indigo-500 transition"
                  >
                    + Add Question
                  </button>
                  <button
                    onClick={() => { const dataStr = JSON.stringify(activeTopic, null, 2); navigator.clipboard && navigator.clipboard.writeText(dataStr); addToast('Active topic copied to clipboard', 'info') }}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition"
                  >
                    Export Topic
                  </button>
                </div>
              </div>

              {activeTopic.questions.length === 0 && (
                <div className="text-slate-500 italic mb-2">No questions yet — add one!</div>
              )}

              {activeTopic.questions.map((q) => (
                <div key={q.id} className="border rounded p-3 mb-3 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex justify-between items-start mb-2 gap-3">
                    <input
                      className="border p-1 flex-1 rounded bg-white dark:bg-slate-700"
                      value={q.question}
                      placeholder="Question text"
                      onChange={(e) => handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({ ...oldQ, question: e.target.value }))}
                      aria-label={`question-${q.id}`}
                    />
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => handleDuplicateQuestion(activeTopic.id, q.id)}
                        className="text-xs text-indigo-500 hover:underline"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => setConfirmDialog({ type: 'question', id: q.id, parentId: activeTopic.id })}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {q.options.map((opt, idx) => (
                    <input
                      key={idx}
                      className="border p-1 w-full mb-1 rounded bg-white dark:bg-slate-700"
                      value={opt}
                      placeholder={`Option ${idx + 1}`}
                      onChange={(e) => handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({ ...oldQ, options: oldQ.options.map((o, j) => (j === idx ? e.target.value : o)) }))}
                    />
                  ))}

                  <input
                    className="border p-1 w-full mb-1 rounded bg-white dark:bg-slate-700"
                    value={q.hint}
                    placeholder="Hint"
                    onChange={(e) => handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({ ...oldQ, hint: e.target.value }))}
                  />

                  <input
                    className="border p-1 w-full mb-1 rounded bg-white dark:bg-slate-700"
                    value={q.explanation}
                    placeholder="Explanation"
                    onChange={(e) => handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({ ...oldQ, explanation: e.target.value }))}
                  />

                  <div className="text-xs mt-1 flex items-center">
                    Correct answer index:
                    <input
                      type="number"
                      min="0"
                      max={Math.max(0, q.options.length - 1)}
                      className="border p-1 ml-2 w-16 rounded bg-white dark:bg-slate-700"
                      value={q.correct}
                      onChange={(e) => handleUpdateQuestion(activeTopic.id, q.id, (oldQ) => ({ ...oldQ, correct: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 italic">Select a topic to start editing</div>
          )}
        </main>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 px-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Confirm Delete</h3>
            <p className="text-sm mb-4 text-slate-600 dark:text-slate-300">Are you sure you want to delete this {confirmDialog.type}? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={cancelDelete}
                className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div key={t.id} className={`px-3 py-2 rounded shadow-md text-sm w-64 ${t.type === 'success' ? 'bg-green-500 text-white' : t.type === 'warning' ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-white'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}
