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

function buildBoxShadow(styles) {
  const {
    boxShadowOffsetX = '0px',
    boxShadowOffsetY = '0px',
    boxShadowBlur = '0px',
    boxShadowSpread = '0px',
    boxShadowColor = '#000000',
  } = styles;
  return `${boxShadowOffsetX} ${boxShadowOffsetY} ${boxShadowBlur} ${boxShadowSpread} ${boxShadowColor}`;
}

function buildTextShadow(styles) {
  const {
    textShadowOffsetX = '0px',
    textShadowOffsetY = '0px',
    textShadowBlur = '0px',
    textShadowColor = '#000000',
  } = styles;
  return `${textShadowOffsetX} ${textShadowOffsetY} ${textShadowBlur} ${textShadowColor}`;
}

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
  const combinedStyles = {
    ...styles,
    boxShadow: buildBoxShadow(styles),
    textShadow: buildTextShadow(styles),
  };

  // Normalize unit styles
  normalizeUnitStyle(styles, 'width');
  normalizeUnitStyle(styles, 'height', 'auto', '');

  const className = `position-relative border ${
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
    const src = defaults.src?.trim();
    const tag = defaults.tag || component.type || '';

    const placeholderUrl = 'https://via.placeholder.com/600x400';
    const isPlaceholderOrEmpty = !src || src === '' || src === placeholderUrl;

    // Only show plus button if this is an image component or img tag with empty src
    if ((component.type === 'image' || tag === 'img') && isPlaceholderOrEmpty) {
      return (
        <div
          style={{
            ...combinedStyles,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f9fa', // light gray
            border: '1px dashed #6c757d',
            cursor: 'pointer',
            position: 'relative',
            userSelect: 'none',
            minHeight: combinedStyles.height || '150px',
            width: combinedStyles.width || '100%',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect('edit', index); // open image uploader or editor
          }}
          title="Add image"
          aria-label="Add image"
        >
          <button
            type="button"
            className="btn btn-outline-primary"
            style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect('edit', index);
            }}
          >
            +
          </button>
        </div>
      );
    }

    // If it's an image with a valid src
    if ((component.type === 'image' || tag === 'img') && src && !isPlaceholderOrEmpty) {
      return (
        <img
          src={defaults.src}
          alt={defaults.alt || ''}
          style={combinedStyles}
          draggable={false}
        />
      );
    }

    // If it has raw HTML content (cards)
    if (defaults.content) {
      return isSelected ? (
        <div
          style={combinedStyles}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          dangerouslySetInnerHTML={{ __html: defaults.content }}
          onClick={(e) => e.stopPropagation()}
          className="editable-content"
        />
      ) : (
        <div
          style={combinedStyles}
          dangerouslySetInnerHTML={{ __html: defaults.content }}
          draggable={false}
        />
      );
    }

    // Otherwise, plain text element
    const Tag = tag || 'div';
    const text = defaults.text || 'Sample Text';

    if (isSelected && component.type !== 'section') {
      return (
        <Tag
          contentEditable
          suppressContentEditableWarning
          style={combinedStyles}
          onInput={handleTextChange}
        >
          {text}
        </Tag>
      );
    }
    return <Tag style={combinedStyles}>{text}</Tag>;
  };

  return (
    <div
      ref={ref}
      className={isSelected ? className : undefined}
      onClick={() => onSelect('select', index)}
      style={{
        cursor: isSelected ? 'text' : 'pointer',
      }}
    >
      {isSelected && (
        <button
          className="btn btn-sm position-absolute top-0 end-0 m-0 text-black"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
        >
          Close
        </button>
      )}
      <button
        className="btn btn-sm position-absolute top-0 start-0 m-0 text-black"
        onClick={(e) => {
          e.stopPropagation();
          onSelect('edit', index);
        }}
      >
        Save
      </button>

      {renderContent()}
    </div>
  );
};

export default CanvasItem;
