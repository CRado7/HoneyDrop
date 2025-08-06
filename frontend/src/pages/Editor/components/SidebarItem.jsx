// src/components/SidebarItem.js
import React from 'react';
import { useDrag } from 'react-dnd';

export default function SidebarItem({ component }) {
  const [, drag] = useDrag(() => ({
    type: 'component',
    item: component,
  }));

  return (
    <div ref={drag} className="p-2 mb-2 bg-light border rounded text-center">
      {component.label}
    </div>
  );
}
