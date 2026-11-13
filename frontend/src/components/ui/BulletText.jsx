import React from 'react';

/** Renders multi-line text as a bullet list (one line = one point); single line renders as a paragraph. */
export const BulletText = ({ text, className = '' }) => {
  const lines = (text || '')
    .split('\n')
    .map((l) => l.replace(/^\s*[-•*]\s*/, '').trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return <p className={`text-sm text-slate-600 leading-relaxed ${className}`}>{lines[0]}</p>;
  }

  return (
    <ul className={`space-y-2 ${className}`}>
      {lines.map((line, i) => (
        <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
          <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 shrink-0" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
};
