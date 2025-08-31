// FILE: src/pages/Admin.jsx
import React, { useState } from 'react'
import { getTopics, saveTopics } from '../data/topics'

export default function Admin({ onHome }) {
  const [topics, setTopics] = useState(getTopics())
  const [selected, setSelected] = useState(null)

  function addTopic() {
    const newTopic = { id: Date.now().toString(), title: 'New Topic', description: '', questions: [] }
    const updated = [...topics, newTopic]
    setTopics(updated)
    saveTopics(updated)
  }

  function deleteTopic(id) {
    const updated = topics.filter(t => t.id !== id)
    setTopics(updated)
    saveTopics(updated)
    setSelected(null)
  }

  function updateTopic(id, field, value) {
    const updated = topics.map(t => t.id === id ? { ...t, [field]: value } : t)
    setTopics(updated)
    saveTopics(updated)
  }

  function addQuestion(topicId) {
    const updated = topics.map(t => {
      if (t.id === topicId) {
        const newQ = {
          id: Date.now().toString(),
          q: 'New question',
          options: ['', '', '', ''],
          correctIndex: 0,
          hint: '',
          explanation: ''
        }
        return { ...t, questions: [...t.questions, newQ] }
      }
      return t
    })
    setTopics(updated)
    saveTopics(updated)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <button onClick={onHome} className="px-3 py-1 bg-slate-200 rounded">Home</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Sidebar with topics */}
        <div className="col-span-1">
          <button onClick={addTopic} className="mb-3 w-full bg-indigo-600 text-white py-2 rounded">+ Add Topic</button>
          {topics.map(t => (
            <div key={t.id} className={`p-2 border rounded mb-2 cursor-pointer ${selected?.id===t.id?'bg-slate-100':''}`}
              onClick={()=>setSelected(t)}>
              <div className="font-medium">{t.title}</div>
              <button onClick={(e)=>{e.stopPropagation(); deleteTopic(t.id)}} className="text-xs text-red-500">Delete</button>
            </div>
          ))}
        </div>

        {/* Topic editor */}
        <div className="col-span-2">
          {selected ? (
            <div>
              <input
                className="border p-2 w-full mb-2"
                value={selected.title}
                onChange={e=>updateTopic(selected.id, 'title', e.target.value)}
                placeholder="Topic title"
              />
              <textarea
                className="border p-2 w-full mb-4"
                value={selected.description}
                onChange={e=>updateTopic(selected.id, 'description', e.target.value)}
                placeholder="Topic description"
              />

              <h3 className="font-semibold mb-2">Questions</h3>
              <button onClick={()=>addQuestion(selected.id)} className="mb-2 bg-indigo-500 text-white px-2 py-1 rounded">+ Add Question</button>

              {selected.questions.map((q, i) => (
                <div key={q.id} className="border rounded p-2 mb-2">
                  <input className="border p-1 w-full mb-1" value={q.q} placeholder="Question text"
                    onChange={e=>{
                      const updated = selected.questions.map(qq => qq.id===q.id ? {...qq, q: e.target.value}:qq)
                      updateTopic(selected.id, 'questions', updated)
                    }}
                  />
                  {q.options.map((opt, idx)=>(
                    <input key={idx} className="border p-1 w-full mb-1" value={opt} placeholder={`Option ${idx+1}`}
                      onChange={e=>{
                        const updated = selected.questions.map(qq => qq.id===q.id ? {
                          ...qq,
                          options: qq.options.map((oo,j)=> j===idx?e.target.value:oo)
                        }:qq)
                        updateTopic(selected.id, 'questions', updated)
                      }}
                    />
                  ))}
                  <input className="border p-1 w-full mb-1" value={q.hint} placeholder="Hint"
                    onChange={e=>{
                      const updated = selected.questions.map(qq => qq.id===q.id ? {...qq, hint:e.target.value}:qq)
                      updateTopic(selected.id, 'questions', updated)
                    }}
                  />
                  <input className="border p-1 w-full" value={q.explanation} placeholder="Explanation"
                    onChange={e=>{
                      const updated = selected.questions.map(qq => qq.id===q.id ? {...qq, explanation:e.target.value}:qq)
                      updateTopic(selected.id, 'questions', updated)
                    }}
                  />
                  <div className="text-xs mt-1">Correct answer index: 
                    <input type="number" min="0" max="3" className="border p-1 ml-2 w-16" value={q.correctIndex}
                      onChange={e=>{
                        const updated = selected.questions.map(qq => qq.id===q.id ? {...qq, correctIndex:Number(e.target.value)}:qq)
                        updateTopic(selected.id, 'questions', updated)
                      }}
                    />
                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="text-slate-500">Select a topic to edit</div>
          )}
        </div>
      </div>
    </div>
  )
}
