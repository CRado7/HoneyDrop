import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import EditorCanvas from '../Editor/components/EditorCanvas';

export default function EditorWrapper() {
  return (
    <DndProvider backend={HTML5Backend}>
      <EditorCanvas />
    </DndProvider>
  );
}
