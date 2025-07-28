import React from 'react';
import { useParams } from 'react-router-dom';

export default function Editor() {
  const { siteId, pageId } = useParams();

  return (
    <div className="container py-5">
      <h1>Editor</h1>
      <p>Editing page <strong>{pageId}</strong> of site <strong>{siteId}</strong>.</p>
      {/* Visual Builder UI will go here */}
    </div>
  );
}
