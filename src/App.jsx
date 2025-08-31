import React, { useState } from 'react'
import { TOPICS } from './data/topics'
import Home from './pages/Home'
import TopicPage from './pages/TopicPage'
import Header from './components/Header'


export default function App(){
const [route, setRoute] = useState({ name: 'home' })


function openTopic(id){
const topic = TOPICS.find(t => t.id === id)
setRoute({ name: 'topic', topic })
}


function goHome(){
setRoute({ name: 'home' })
}


return (
<div className="min-h-screen bg-slate-50">
<Header title="Quiz App" onHome={goHome} />


{route.name === 'home' && (
<Home topics={TOPICS} onOpen={openTopic} />
)}


{route.name === 'topic' && (
<TopicPage topic={route.topic} onHome={goHome} />
)}


<footer className="text-center p-4 text-xs text-slate-500">Built with ❤️</footer>
</div>
)
}
