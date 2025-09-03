// FILE: src/pages/Home.jsx
import React from "react"
import { motion } from "framer-motion"

export default function Home({ topics, onOpen, onAdmin }) {
  return (
    <main className="p-8 min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
          🚀 Explore Topics
        </h2>

        <button
          onClick={onAdmin}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-red-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          Admin
        </button>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {topics.map((t, idx) => (
          <motion.article
            key={t.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-[1.02] transition cursor-pointer border border-white/20"
          >
            <h3 className="font-bold text-xl mb-2">{t.title}</h3>
            <p className="text-sm text-slate-300">{t.description}</p>

            <div className="mt-4">
              <button
                onClick={() => onOpen(t.id)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
              >
                Start Quiz →
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </main>
  )
}
