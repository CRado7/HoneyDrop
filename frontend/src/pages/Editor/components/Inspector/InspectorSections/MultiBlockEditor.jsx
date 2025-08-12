import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import RichTextEditor from './RichTextEditor'; // your existing editor component

// Helper: Parse HTML string into blocks of either image or HTML string
function parseContentToBlocks(html) {
  if (!html) return [];

  const div = document.createElement('div');
  div.innerHTML = html;

  const blocks = [];
  // Loop through direct children only to separate images and other blocks
  div.childNodes.forEach((node) => {
    if (node.nodeType === 1) { // element node
      if (node.tagName.toLowerCase() === 'img') {
        blocks.push({ type: 'image', src: node.getAttribute('src'), alt: node.getAttribute('alt') || '' });
      } else {
        blocks.push({ type: 'html', content: node.outerHTML });
      }
    } else if (node.nodeType === 3) { // text node (e.g. whitespace, new lines)
      const trimmed = node.textContent.trim();
      if (trimmed) {
        blocks.push({ type: 'html', content: trimmed });
      }
    }
  });

  return blocks;
}

// Helper: Combine blocks back to single HTML string
function combineBlocksToHtml(blocks) {
  return blocks
    .map(block => {
      if (block.type === 'image') {
        return `<img src="${block.src}" alt="${block.alt}" />`;
      }
      return block.content;
    })
    .join('');
}

export default function MultiBlockEditor({ initialHtml = '', onChange, mergedStyles}) {
  const [blocks, setBlocks] = useState(() => parseContentToBlocks(initialHtml));

  useEffect(() => {
    // If initialHtml changes externally, update blocks accordingly
    setBlocks(parseContentToBlocks(initialHtml));
  }, [initialHtml]);

  // Called when a block updates (only for HTML blocks)
  const updateBlockContent = (index, newContent) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = { ...updatedBlocks[index], content: newContent };
    setBlocks(updatedBlocks);
    onChange && onChange(combineBlocksToHtml(updatedBlocks));
  };

  return (
    <div>
      {blocks.map((block, idx) => {
        if (block.type === 'image') {
          return (
            <div key={idx} style={{ marginBottom: 12 }}>
              <img
                src={block.src}
                alt={block.alt}
                style={{ maxWidth: '100%', borderRadius: 4 }}
              />
            </div>
          );
        } else if (block.type === 'html') {
          return (
            <div key={idx} style={{ marginBottom: 16 }}>
              <RichTextEditor
                initialHtml={block.content}
                onChange={(newHtml) => updateBlockContent(idx, newHtml)}
                mergedStyles={mergedStyles}
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
