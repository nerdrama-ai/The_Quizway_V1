import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CodeOptimise() {
  const [code, setCode] = useState('');
  const [instruction, setInstruction] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('optimised-code');
    if (saved) setCode(saved);
  }, []);

  useEffect(() => {
    if (code || instruction) {
      localStorage.setItem('optimised-code', code);
    }
  }, [code, instruction]);

  const handleBack = () => {
    if (!code && !instruction) {
      navigate('/');
    }
  };

  return (
    <div className="p-4">
      <button onClick={handleBack} className="text-blue-500 mb-2">← Back</button>
      <textarea
        value={instruction}
        onChange={e => setInstruction(e.target.value)}
        placeholder="Instruction"
        className="w-full p-2 text-black"
      />
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Paste your code here..."
        className="w-full p-2 mt-2 text-black"
      />
    </div>
  );
}
