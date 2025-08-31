import React from 'react'


export default function Scorecard({ title, progress, total }){
const pct = total ? Math.round((progress/total)*100) : 0
return (
<div className="bg-white/90 shadow p-4 rounded-lg w-full max-w-3xl mx-auto">
<div className="flex justify-between items-start">
<div>
<h2 className="text-xl font-bold">{title}</h2>
<p className="text-sm text-slate-600">Progress: {progress} / {total}</p>
</div>
<div className="text-right">
<div className="text-sm font-medium">{pct}%</div>
</div>
</div>


<div className="mt-3 bg-slate-200 h-3 rounded overflow-hidden">
<div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
</div>
</div>
)
}
