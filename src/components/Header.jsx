import React from 'react';


export default function Header({onGoAdmin,onGoHome}){
return (
<header className="header">
<h1 className="logo" onClick={onGoHome}>📦 The Quizway</h1>
<div>
<button className="btn" onClick={onGoAdmin}>Admin</button>
</div>
</header>
);
}
