import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Welcome to Nerdrama</h1>
      <div className="space-x-4">
        <button onClick={() => navigate('/new')} className="bg-purple-500 px-6 py-3 rounded-lg">New Code</button>
        <button onClick={() => navigate('/optimise')} className="bg-pink-500 px-6 py-3 rounded-lg">Optimise Code</button>
      </div>
    </div>
  );
}
