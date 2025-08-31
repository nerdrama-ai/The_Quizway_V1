import React, { useState } from 'react'
import { TOPICS } from './data/topics'
import Home from './pages/Home'
import TopicPage from './pages/TopicPage'
import Header from './components/Header'
import Admin from './pages/Admin'

export default function App() {
  const [route, setRoute] = useState({ name: 'home' })

  function openTopic(id) {
    const topic = TOPICS.find(t => t.id === id)
    setRoute({ name: 'topic', topic })
  }

  function goHome() {
    setRoute({ name: 'home' })
  }

  function goAdmin() {
    setRoute({ name: 'admin' })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Quiz App" onHome={goHome} />

      {route.name === 'home' && (
        <Home topics={TOPICS} onOpen={openTopic} onAdmin={goAdmin} />
      )}

      {route.name === 'topic' && (
        <TopicPage topic={route.topic} onHome={goHome} />
      )}

      {route.name === 'admin' && (
        <Admin onHome={goHome} />
      )}

      <footer className="text-center p-4 text-xs text-slate-500">
        Built with ❤️
      </footer>
    </div>
  )
}
