import React from 'react'
import clsx from 'clsx'


export default function Header({ title, onHome }){
return (
<header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur sticky top-0 z-20">
<h1 className="text-lg font-semibold">{title}</h1>
<button onClick={onHome} className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200">Home</button>
</header>
)
}
