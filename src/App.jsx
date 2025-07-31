import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import ChatInterface from './pages/ChatInterface';
import CodeOptimise from './pages/CodeOptimise';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/new" element={<ChatInterface />} />
      <Route path="/optimise" element={<CodeOptimise />} />
    </Routes>
  );
}
