import React, { useState } from 'react'
import { getTopics } from './data/topics'
import Home from './pages/Home'
import TopicPage from './pages/TopicPage'
import Header from './components/Header'
import Admin from './pages/Admin'

export default function App() {
  // ✅ load topics into state so we can update dynamically
  const [topics, setTopics] = useState(getTopics())
  const [route, setRoute] = useState({ name: 'home' })

  function openTopic(id) {
    const topic = topics.find(t => t.id === id)
    setRoute({ name: 'topic', topic })
  }

  function goHome() {
    // refresh topics in case Admin made changes
    setTopics(getTopics())
    setRoute({ name: 'home' })
  }

  function goAdmin() {
    setRoute({ name: 'admin' })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="The Quizway" onHome={goHome} />

      {route.name === 'home' && (
        <Home topics={topics} onOpen={openTopic} onAdmin={goAdmin} />
      )}

      {route.name === 'topic' && (
        <TopicPage topic={route.topic} onHome={goHome} />
      )}

      {route.name === 'admin' && (
        <Admin onHome={goHome} />
      )}

      <footer className="text-center p-4 text-xs text-slate-500">
        Built with ❤️ by Vishnu and Adi
      </footer>
    </div>
  )
}
