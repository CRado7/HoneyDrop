import React from 'react';
import { useParams } from 'react-router-dom';

export default function Editor() {
  const { siteName } = useParams();

  return (
    <div className="container py-5">
      <h1>Editor</h1>
      <p>Editing Site <strong>{siteName}</strong>.</p>
      {/* Visual Builder UI will go here */}
    </div>
  );
}
