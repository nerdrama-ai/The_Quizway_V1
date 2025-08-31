import React, { useState, useEffect } from 'react'
import Scorecard from '../components/Scorecard'
import QuizContainer from '../components/QuizContainer'


export default function TopicPage({ topic, onHome }){
const total = topic.questions.length
const [progress, setProgress] = useState(0)
const [started, setStarted] = useState(false)
const [showBox, setShowBox] = useState(false)
const [completed, setCompleted] = useState(false)


useEffect(()=>{
if(completed){
setShowBox(false)
}
},[completed])


function handleStart(){
setStarted(true)
setShowBox(true)
}


function handleComplete(){
setCompleted(true)
setProgress(total)
// optional: could play animation or show confetti
}


return (
<div className="p-6">
<div className="mb-4 flex justify-between items-center">
<Scorecard title={topic.title} progress={progress} total={total} />
<div className="ml-4">
<button onClick={onHome} className="px-3 py-1 rounded bg-slate-100">Home</button>
</div>
</div>


<div className="max-w-3xl mx-auto text-center mt-8">
<p className="text-slate-600 mb-4">{topic.description}</p>
{!started && (
<button onClick={handleStart} className="px-6 py-3 rounded bg-indigo-600 text-white">Start</button>
)}


{completed && (
<div className="mt-6 text-emerald-700 font-semibold">Quiz complete! Well done.</div>
)}
</div>


{showBox && !completed && (
<QuizContainer
questions={topic.questions}
onComplete={handleComplete}
onProgressUpdate={(qIdx) => setProgress(qIdx)}
/>
)}


</div>
)
}
