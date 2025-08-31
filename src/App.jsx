import React, { useEffect, useState } from 'react';
import { loadData, saveData, uid } from './utils/storage';
import Header from './components/Header';
import Home from './components/Home';
import QuizTopic from './components/QuizTopic';
import AdminPanel from './components/AdminPanel';


export default function App(){
const [data, setData] = useState(loadData);
useEffect(()=> saveData(data), [data]);


const [screen, setScreen] = useState({ name: 'home' });


return (
<div className="app-root">
<Header onGoAdmin={() => setScreen({name:'admin'})} onGoHome={() => setScreen({name:'home'})} />
<main className="container">
{screen.name === 'home' && (
<Home topics={data.topics} onOpenTopic={(topicId)=> setScreen({name:'quiz', topicId})} onCreateTopic={(title)=>{
const t={id:uid(), title:title||'Untitled', questions:[]};
setData(s=> ({...s, topics:[...s.topics, t]}));
}} />
)}
{screen.name === 'quiz' && (
<QuizTopic data={data} setData={setData} topicId={screen.topicId} onBack={()=> setScreen({name:'home'})} />
)}
{screen.name === 'admin' && (
<AdminPanel data={data} setData={setData} onBack={()=> setScreen({name:'home'})} />
)}
</main>
<footer className="footer">QuizBox • Simple cue-card quizzes • Data saved to localStorage</footer>
</div>
);
}
