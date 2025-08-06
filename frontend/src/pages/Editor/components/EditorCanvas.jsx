// src/components/EditorCanvas.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDrop } from 'react-dnd';

import '../styles/Editor.css';

import ComponentLibraryPanel from './ComponentLibraryPanel';
import Inspector from './Inspector';
import CanvasItem from './CanvasItem';

export default function EditorCanvas() {
  const { siteName } = useParams();
  const [elements, setElements] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Accept dropped components from the library
  const [, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item) => {
      const newComponent = {
        ...item.defaults,
        type: item.type,
        tag: item.tag,
        inspectorFields: item.inspectorFields || [],
      };
      setElements((prev) => [...prev, newComponent]);
    },
  }));

  const handleSelect = (action, fromIndex, toIndex) => {
    if (action === 'select') {
      setSelectedIndex(fromIndex);
    } else if (action === 'reorder') {
      const updated = [...elements];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setElements(updated);
    }
  };

  const handleUpdate = (index, key, value) => {
    const updated = [...elements];
  
    if (key === 'defaults') {
      updated[index] = {
        ...updated[index],
        defaults: {
          ...updated[index].defaults,
          ...value,
          styles: {
            ...updated[index].defaults?.styles,
            ...value.styles,
          },
        },
      };
    } else {
      updated[index][key] = value;
    }
  
    setElements(updated);
  };  

  const handleDelete = (index) => {
    const updated = [...elements];
    updated.splice(index, 1);
    setElements(updated);
    if (selectedIndex === index) setSelectedIndex(null);
  };

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* Sidebar */}
        <div className="col-2 bg-light p-3 border-end">
          <h5>Components</h5>
          <ComponentLibraryPanel
            onAddComponent={(component) => {
              setElements((prev) => [
                ...prev,
                {
                  ...component.defaults,
                  type: component.type,
                  label: component.label,
                  tag: component.defaults?.tag || 'div',
                  inspectorFields: component.inspectorFields || [],
                },
              ]);
            }}
          />
        </div>

        {/* Canvas */}
        <div className="col-7 p-4 overflow-auto" ref={drop}>
          <h5>Editor: {siteName}</h5>
          <div
            className="canvas-preview rounded p-4"
            style={{
              minHeight: '80vh',
              backgroundColor: '#f7f7f7',
              border: '2px dashed #ddd',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              borderRadius: '8px',
            }}
          >
            {elements.length === 0 && (
              <p className="text-muted text-center py-5">Drag components from the left panel to start building your page</p>
            )}
            {elements.map((el, idx) => (
              <CanvasItem
                key={idx}
                component={el}
                index={idx}
                selected={selectedIndex}
                onSelect={handleSelect}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
          {elements.length < 1 && (
              <p className="text-muted text-center py-5">Drag components from the left panel to start building your page</p>
            )}
        </div>

        {/* Inspector */}
        <div className="col-3 bg-light p-3 border-start">
          <Inspector
            component={selectedIndex != null ? elements[selectedIndex] : null}
            onUpdate={(key, value) => {
              const updated = [...elements];
              updated[selectedIndex][key] = value;
              setElements(updated);
            }}
          />
        </div>
      </div>
    </div>
  );
}
