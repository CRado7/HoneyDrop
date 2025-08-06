import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const CanvasItem = ({ component, index, onSelect, selected, onDelete, onUpdate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'canvas-item',
    item: { index },
  }));

  const [, drop] = useDrop({
    accept: 'canvas-item',
    hover(item) {
      if (item.index !== index) {
        onSelect('reorder', item.index, index);
        item.index = index;
      }
    },
  });

  const ref = node => drag(drop(node));

  const isSelected = selected === index;

  // Use defaults.tag and defaults.text for rendering
  const Tag = component.defaults?.tag || 'div';
  const content = component.defaults?.text || 'Sample Text';
  const styles = component.defaults?.styles || {};

  const className = `position-relative p-3 border mb-2 ${
    isSelected ? 'bg-primary bg-opacity-10' : 'bg-white'
  }`;

  return (
    <div ref={ref} className={className} onClick={() => onSelect('select', index)}>
      {/* Delete Button */}
      <button
        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
      >
        ×
      </button>

      {/* Editable or display view */}
      {isSelected ? (
        <Tag
          contentEditable
          suppressContentEditableWarning
          style={styles}
          onInput={(e) => {
            const updatedText = e.currentTarget.textContent;
            onUpdate(index, 'defaults', { text: updatedText });
          }}
        >
            {content}
        </Tag>
      ) : (
        <Tag style={styles}>{content}</Tag>
      )}
    </div>
  );
};

export default CanvasItem;
