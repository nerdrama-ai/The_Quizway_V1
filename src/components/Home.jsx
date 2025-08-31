import React, { useState } from 'react';


export default function Home({topics, onOpenTopic, onCreateTopic}){
const [newTitle,setNewTitle]=useState('');
return (
<div className="home">
<h2>Topics</h2>
<div className="topics-grid">
{topics.map(t=> (
<div className="topic-card" key={t.id} onClick={()=> onOpenTopic(t.id)}>
<div className="box-illustration">
<div className="box-lid" />
<div className="box-base" />
</div>
<h3>{t.title}</h3>
<p>{t.questions.length} question{t.questions.length!==1?'s':''}</p>
</div>
))}
<div className="topic-card new">
<input placeholder="New topic title" value={newTitle} onChange={e=>setNewTitle(e.target.value)} />
<div style={{display:'flex', gap:8}}>
<button className="btn" onClick={()=>{ onCreateTopic(newTitle); setNewTitle(''); }}>Create</button>
</div>
</div>
</div>
</div>
);
}
