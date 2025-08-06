import React from 'react';
import { useDrag } from 'react-dnd';

export default function DraggableElement({ type, label }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'ELEMENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className={`btn btn-outline-secondary w-100 mb-2 ${isDragging ? 'opacity-50' : ''}`}
    >
      {label}
    </div>
  );
}
