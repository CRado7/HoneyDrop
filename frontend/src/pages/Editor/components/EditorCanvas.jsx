import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDrop } from 'react-dnd';

import '../styles/Editor.css';

import ComponentLibraryPanel from './ComponentLibraryPanel';
import Inspector from './Inspector/Inspector';
import CanvasItem from './CanvasItem';

export default function EditorCanvas() {
  const { siteName } = useParams();

  const [elements, setElements] = useState([]);
  const [devicePreview, setDevicePreview] = useState('desktop');
  const [bodyStyles, setBodyStyles] = useState({});
  const [selectedBlock, setSelectedBlock] = useState(null);

  // --- Body styles ---
  const handleUpdateBodyStyle = (key, value) => {
    setBodyStyles(prev => ({ ...prev, [key]: value }));
  };

  // --- Canvas drop ---
  const [, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item) => {
      const newComponent = {
        defaults: { ...item.defaults },
        type: item.type,
        tag: item.tag || item.defaults?.tag || 'div',
        label: item.label,
        inspectorFields: item.inspectorFields || [],
      };
      setElements(prev => [...prev, newComponent]);
    },
  }));

  // --- Component / Block select ---
  const handleSelect = (blockInfo) => {
    console.log('[EditorCanvas] selectedBlock updated:', blockInfo);
    setSelectedBlock(blockInfo);
  };

  // --- Update nested block ---
  const handleUpdateBlock = (parentIndex, updatedBlock) => {
    setElements(prev => {
      const updated = [...prev];
      const blocks = updated[parentIndex].defaults.contentBlocks || [];
      updated[parentIndex].defaults.contentBlocks = blocks.map(b =>
        b.id === updatedBlock.id ? updatedBlock : b
      );
      return updated;
    });
    // Update selected block if it's the one being edited
    if (selectedBlock?.id === updatedBlock.id) {
      setSelectedBlock({ ...selectedBlock, block: updatedBlock });
    }
  };

  const handleUpdateDefaults = (parentIndex, updatedDefaults) => {
    setElements(prev => {
      const updated = [...prev];
      updated[parentIndex] = {
        ...updated[parentIndex],
        defaults: updatedDefaults
      };
      return updated;
    });
  };  

  // --- Delete element ---
  const handleDelete = (index) => {
    setElements(prev => prev.filter((_, i) => i !== index));

    if (selectedBlock?.parentIndex === index) {
      setSelectedBlock(null);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row vh-100">
        {/* Sidebar */}
        <div className="col-2 bg-light p-3" style={{ overflowY: 'scroll' }}>
          <h5>Components</h5>
          <ComponentLibraryPanel
            onAddComponent={(component) => {
              setElements(prev => [
                ...prev,
                {
                  defaults: { ...component.defaults },
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
            className="canvas-preview"
            style={{
              minHeight: '80vh',
              backgroundColor: 'white',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              borderRadius: '0px',
              paddingTop: '1px',
            }}
          >
            {elements.length === 0 && (
              <p className="text-muted text-center py-5">
                Drag components from the left panel to start building your page
              </p>
            )}

            {elements.map((el, idx) => (
              <CanvasItem
                key={idx}
                component={el}
                index={idx}
                selectedBlock={selectedBlock}
                onSelect={handleSelect}
                onDelete={handleDelete}
                onUpdate={(updatedBlock) => handleUpdateBlock(idx, updatedBlock)}
              />
            ))}
          </div>
        </div>

        {/* Inspector */}
        <div className="col-3 bg-light p-3 border-start text-black">
          <Inspector
            devicePreview={devicePreview}
            setDevicePreview={setDevicePreview}
            component={selectedBlock?.parentIndex != null ? elements[selectedBlock.parentIndex] : null}
            selectedSubBlock={selectedBlock?.block || null}
            updateSubBlock={(updatedBlock) => {
              if (selectedBlock?.parentIndex != null) {
                handleUpdateBlock(selectedBlock.parentIndex, updatedBlock);
              }
            }}
             onUpdate={(path, value) => {
                 if (selectedBlock?.parentIndex == null) return;
              
                 if (path === "defaults") {
                   handleUpdateDefaults(selectedBlock.parentIndex, value);   // 🔑 parent styles
                 } else if (path === "defaults.contentBlocks") {
                   // full contentBlocks replacement
                   handleUpdateDefaults(selectedBlock.parentIndex, {
                     ...elements[selectedBlock.parentIndex].defaults,
                     contentBlocks: value
                   });
                 } else {
                   // fallback: updating a block field
                   handleUpdateBlock(selectedBlock.parentIndex, {
                     ...selectedBlock.block,
                     [path]: value,
                   });
                 }
               }}
            bodyStyles={bodyStyles}
            onUpdateBodyStyles={handleUpdateBodyStyle}
          />
        </div>
      </div>
    </div>
  );
}
