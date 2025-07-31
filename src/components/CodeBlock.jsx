import React from 'react';

export default function CodeBlock({ code }) {
  return (
    <pre className="bg-gray-800 p-4 rounded-md text-green-300 overflow-x-auto">
      <code>{code}</code>
    </pre>
  );
}
