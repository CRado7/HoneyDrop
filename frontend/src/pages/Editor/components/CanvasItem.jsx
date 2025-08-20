// src/components/CanvasItem.jsx
import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

// ----------------- Helpers -----------------
const buildBoxShadow = (styles) => {
  const x = styles.boxShadowOffsetX || '0px';
  const y = styles.boxShadowOffsetY || '0px';
  const blur = styles.boxShadowBlur || '0px';
  const spread = styles.boxShadowSpread || '0px';
  const color = styles.boxShadowColor || '#000000';
  return `${x} ${y} ${blur} ${spread} ${color}`;
};

const buildTextShadow = (styles) => {
  const x = styles.textShadowOffsetX || '0px';
  const y = styles.textShadowOffsetY || '0px';
  const blur = styles.textShadowBlur || '0px';
  const color = styles.textShadowColor || '#000000';
  return `${x} ${y} ${blur} ${color}`;
};

const inheritableProps = [
  'fontFamily','color','fontWeight','fontStyle','lineHeight',
  'letterSpacing','textAlign','boxShadow','textShadow','display','flexDirection'
];

const voidTags = [
  'area','base','br','col','embed','hr','input','link','meta','source','track','wbr'
];

const computeBlockStyles = (block, parentStyles = {}) => {
  const inherited = {};
  const blockStyles = block.styles || {};
  inheritableProps.forEach((key) => {
    if (parentStyles[key] && blockStyles[key] === undefined) inherited[key] = parentStyles[key];
  });
  const finalStyles = { ...inherited, ...blockStyles };
  finalStyles.boxShadow = buildBoxShadow(finalStyles);
  finalStyles.textShadow = buildTextShadow(finalStyles);
  return finalStyles;
};

// ----------------- Recursive Block Renderer -----------------
const BlockRenderer = ({ block, parentStyles = {}, selectedBlock, onSelect, onUpdate, parentIndex }) => {
  const [hovered, setHovered] = useState(false);
  const styles = computeBlockStyles(block, parentStyles);
  const Tag = block.tag || 'div';
  const hasChildren = Array.isArray(block.contentBlocks) && block.contentBlocks.length > 0;
  const isHtmlContainer = Tag === 'div' || Tag === 'span';

  // ✅ Only mark a block selected if selectedBlock.id exists
  const isSelected = selectedBlock?.id ? selectedBlock.id === block.id : false;

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect({ parentIndex, id: block.id, block });
  };

  const outlineStyle = isSelected
    ? '2px dashed lightblue'
    : hovered
    ? '1px dashed rgba(0,0,0,0.3)'
    : 'none';

  const selectedBackground = isSelected ? 'rgba(173,216,230,0.2)' : 'transparent';

  // --- img handling ---
  if (Tag === 'img') {
    return (
      <img
        style={{ ...styles, outline: outlineStyle, background: selectedBackground, cursor: 'pointer' }}
        src={block.src || ''}
        alt={block.alt || ''}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...(block.attrs || {})}
      />
    );
  }

  if (voidTags.includes(Tag)) {
    return (
      <Tag
        style={{ ...styles, outline: outlineStyle, background: selectedBackground, cursor: 'pointer' }}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...(block.attrs || {})}
      />
    );
  }

  const childNodes = hasChildren
    ? block.contentBlocks.map((child) => {
        const childParentStyles = {};
        inheritableProps.forEach((key) => {
          if (styles[key] !== undefined) childParentStyles[key] = styles[key];
        });
        return (
          <BlockRenderer
            key={child.id}
            block={child}
            parentStyles={childParentStyles}
            selectedBlock={selectedBlock}
            onSelect={onSelect}
            onUpdate={onUpdate}
            parentIndex={parentIndex}
          />
        );
      })
    : null;

  const rawContent = block.content || block.text || block.innerHtml || '';

  return (
    <Tag
      style={{ ...styles, outline: outlineStyle, background: selectedBackground, position: 'relative', cursor: 'pointer' }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      contentEditable={isSelected && block.type === 'text' && Tag !== 'textarea' && Tag !== 'input'}
      suppressContentEditableWarning
      onInput={(e) =>
        onUpdate({ ...block, content: e.currentTarget.textContent, innerHtml: e.currentTarget.textContent })
      }
      onBlur={(e) => {
        if (Tag === 'input' || Tag === 'textarea') onUpdate({ ...block, content: e.currentTarget.value });
        else if (Tag !== 'img') onUpdate({ ...block, innerHtml: e.currentTarget.innerHTML });
      }}
      {...(block.attrs || {})}
      dangerouslySetInnerHTML={isHtmlContainer && !hasChildren ? { __html: rawContent } : undefined}
    >
      {!isHtmlContainer || hasChildren ? rawContent : null}
      {childNodes}
    </Tag>
  );
};

// ----------------- Canvas Item -----------------
const CanvasItem = ({ component, index, onSelect, selectedBlock, onDelete, onUpdate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({ type: 'canvas-item', item: { index } }));
  const [, drop] = useDrop({
    accept: 'canvas-item',
    hover(item) {
      if (item.index !== index) {
        onSelect('reorder', item.index, index);
        item.index = index;
      }
    },
  });

  const [hovered, setHovered] = useState(false);
  const ref = (node) => drag(drop(node));

  const handleComponentClick = (e) => {
    e.stopPropagation();
    onSelect({ parentIndex: index, id: null }); // select parent only
  };

  const isParentSelected = selectedBlock?.parentIndex === index && !selectedBlock?.id;

  return (
    <div
      ref={ref}
      className="canvas-item-outer"
      style={{
        width: '100%',
        position: 'relative',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'pointer',
      }}
      onClick={handleComponentClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isParentSelected && (
        <button
          className="btn btn-sm position-absolute top-0 end-0 m-0 text-black"
          onClick={(e) => { e.stopPropagation(); onDelete(index); }}
        >
          Delete
        </button>
      )}

      <div
        className="canvas-item"
        style={{
          ...component.defaults.styles,
          outline: isParentSelected ? '2px dotted lightblue' : 'none',
        }}
      >
        {component.defaults.contentBlocks?.map((block) => {
          const childParentStyles = {};
          inheritableProps.forEach((key) => {
            if (component.defaults.styles?.[key] !== undefined) childParentStyles[key] = component.defaults.styles[key];
          });

          return (
            <BlockRenderer
              key={block.id}
              block={block}
              parentStyles={childParentStyles}
              selectedBlock={selectedBlock}
              onSelect={(b) => onSelect({ parentIndex: index, ...b })}
              onUpdate={(updated) => onUpdate(updated)}
              parentIndex={index}
            />
          );
        })}
      </div>

      {hovered && !isParentSelected && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '1px dashed rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export default CanvasItem;
