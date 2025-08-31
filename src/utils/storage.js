const STORAGE_KEY = 'quizbox_data_v1';


export const DEFAULT_DATA = {
topics: [
{
id: 't1',
title: 'General Knowledge',
questions: [
{
id: 'q1',
question: 'What is the capital of France?',
options: ['Paris','Berlin','Madrid','Rome'],
correct: 0,
hint: 'It is also called the city of lights.',
explanation: 'Paris is the capital and largest city of France.'
},
{
id: 'q2',
question: 'Which planet is known as the Red Planet?',
options: ['Earth','Mars','Jupiter','Venus'],
correct: 1,
hint: 'It is named after the Roman god of war.',
explanation: 'Mars is called the Red Planet due to iron oxide on its surface.'
}
]
}
]
};


export function loadData(){
try{
const raw = localStorage.getItem(STORAGE_KEY);
if(!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
return JSON.parse(raw);
}catch(e){
console.error('Failed load',e);
return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
}


export function saveData(data){
localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}


export function uid() { return Math.random().toString(36).slice(2,9); }
