// FILE: src/components/Header.jsx
import React from "react"

export default function Header({ title, onHome, onAdmin }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-white/5 backdrop-blur-md border-b border-white/10">
      {/* App Title */}
      <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent tracking-wide drop-shadow-md">
        {title}
      </h1>

      {/* Nav Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onHome}
          className="px-3 py-1.5 rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm transition-all shadow-md hover:shadow-indigo-500/30"
        >
          Home
        </button>
        <button
          onClick={onAdmin}
          className="px-3 py-1.5 rounded-md bg-cyan-600/80 hover:bg-cyan-600 text-white text-sm transition-all shadow-md hover:shadow-cyan-500/30"
        >
          Admin
        </button>
      </div>
    </header>
  )
}
