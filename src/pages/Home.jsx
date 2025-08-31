import React from 'react'

export default function Home({ topics, onOpen, onAdmin }) {
  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Topics</h2>
        {/* Admin button */}
        <button 
          onClick={onAdmin} 
          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded"
        >
          Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map(t => (
          <article key={t.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-lg">{t.title}</h3>
            <p className="text-sm text-slate-500">{t.description}</p>
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => onOpen(t.id)} 
                className="px-3 py-1 bg-indigo-600 text-white rounded"
              >
                Open
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
