import React, { useState, useEffect } from 'react'
import QuizCard from './QuizCard'


export default function QuestionBox({ questions, onComplete, onProgressUpdate }){
const total = questions.length
const [idx, setIdx] = useState(0)
const [selected, setSelected] = useState(null)
const [locked, setLocked] = useState(false)
const [showCorrect, setShowCorrect] = useState(false)
const [finished, setFinished] = useState(false)


useEffect(()=>{
onProgressUpdate(idx)
},[idx])


const curQ = questions[idx]


function handleSelect(i){
if(locked) return
setSelected(i)
setLocked(true)
const correct = i === curQ.correctIndex
if(correct){
setShowCorrect(true)
} else {
setShowCorrect(false)
}
}


function handleNext(){
setSelected(null)
setLocked(false)
setShowCorrect(false)
if(idx + 1 < total){
setIdx(idx + 1)
} else {
// finished
setFinished(true)
onComplete()
}
}


}
