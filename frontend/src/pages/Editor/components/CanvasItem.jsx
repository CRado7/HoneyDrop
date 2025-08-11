import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

// Helper to convert style values with units
const normalizeUnitStyle = (styleObj, key, defaultValue = 100, defaultUnit = '%') => {
  if (styleObj[key] && typeof styleObj[key] === 'object') {
    const value = styleObj[key].value ?? defaultValue;
    const unit = styleObj[key].unit ?? defaultUnit;
    styleObj[key] = `${value}${unit}`;
  }
};

const CanvasItem = ({
  component,
  index,
  onSelect,
  selected,
  onDelete,
  onUpdate,
  devicePreview = 'desktop',
}) => {
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

  const ref = (node) => drag(drop(node));
  const isSelected = selected === index;

  // Merge global + device styles
  const allStyles = component.defaults?.styles || {};
  const deviceStyles = allStyles[devicePreview] || {};
  const globalStyles = Object.entries(allStyles).reduce((acc, [key, value]) => {
    if (!['desktop', 'tablet', 'mobile'].includes(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
  const styles = { ...globalStyles, ...deviceStyles };

  // Normalize unit styles
  normalizeUnitStyle(styles, 'width');
  normalizeUnitStyle(styles, 'height', 'auto', '');

  const className = `position-relative p-3 border mb-2 ${
    isSelected ? 'bg-primary bg-opacity-10' : 'bg-white'
  }`;

  // Handler for plain text content editing
  const handleTextChange = (e) => {
    const updated = e.currentTarget.textContent;
    onUpdate(index, 'defaults.text', updated);
  };

  // Handler for editable HTML content (cards)
  const handleContentChange = (e) => {
    const updatedHtml = e.currentTarget.innerHTML;
    onUpdate(index, 'defaults.content', updatedHtml);
  };

  const renderContent = () => {
    const defaults = component.defaults || {};

    // If it's an image element
    if (defaults.src) {
      return (
        <img
          src={defaults.src}
          alt={defaults.alt || ''}
          style={styles}
          draggable={false}
        />
      );
    }

    // If it has raw HTML content (cards)
    if (defaults.content) {
      return isSelected ? (
        <div
          style={styles}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          dangerouslySetInnerHTML={{ __html: defaults.content }}
          onClick={(e) => e.stopPropagation()} // prevent click bubbling to parent div
          className="editable-content"
        />
      ) : (
        <div
          style={styles}
          dangerouslySetInnerHTML={{ __html: defaults.content }}
          draggable={false}
        />
      );
    }

    // Otherwise, plain text element
    const Tag = defaults.tag || 'div';
    const text = defaults.text || 'Sample Text';

    if (isSelected && component.type !== 'section') {
      return (
        <Tag
          contentEditable
          suppressContentEditableWarning
          style={styles}
          onInput={handleTextChange}
        >
          {text}
        </Tag>
      );
    }
    return <Tag style={styles}>{text}</Tag>;
  };

  return (
    <div
      ref={ref}
      className={className}
      onClick={() => onSelect('select', index)}
      style={{ cursor: isSelected ? 'text' : 'pointer' }}
    >
      {/* Delete Button */}
      {isSelected && (
        <button
          className="btn btn-lg position-absolute top-0 end-0 m-0 text-black"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
        >
          ×
        </button>
      )}

      {renderContent()}
    </div>
  );
};

export default CanvasItem;

