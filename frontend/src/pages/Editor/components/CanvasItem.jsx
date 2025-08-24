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
  'area','base','br','col','embed','hr','link','meta','source','track','wbr'
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

  const isSelected = selectedBlock?.id ? selectedBlock.id === block.id : false;

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect({ parentIndex, id: block.id, block });
  };

  const outlineStyle = isSelected
    ? 'inset 0 0 0 2px lightblue'
    : hovered
    ? 'inset 0 0 0 2px lightblue'
    : 'none';

    const imageOutlineStyle = isSelected
    ? '0 0 0 2px lightblue'
    : hovered
    ? '0 0 0 2px lightblue'
    : 'none';

  const selectedBackground = isSelected ? 'rgba(173,216,230,0.2)' : 'transparent';

  // --- img handling ---
  if (Tag === 'img') {
    return (
      <img
        style={{ ...styles, boxShadow: imageOutlineStyle, background: selectedBackground, cursor: 'pointer' }}
        src={block.src || ''}
        alt={block.alt || ''}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...(block.attrs || {})}
      />
    );
  }

  // --- void elements (e.g. <br>, <hr>) ---
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

  // --- textarea handling ---
  if (Tag === 'textarea') {
    return (
      <textarea
        style={{ ...styles, boxShadow: outlineStyle, background: selectedBackground, cursor: 'pointer' }}
        value={block.content || ''}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onChange={(e) => onUpdate({ ...block, content: e.currentTarget.value })}
        {...(block.attrs || {})}
        disabled
      />
    );
  }

  // --- input handling ---
  if (Tag === 'input') {
    return (
      <input
        style={{ ...styles, boxShadow: outlineStyle, background: selectedBackground, cursor: 'pointer' }}
        value={block.content || ''}
        onClick={handleClick}
        onMouseEnter={() => setHovered(false)}
        onMouseLeave={() => setHovered(false)}
        onChange={(e) => onUpdate({ ...block, content: e.currentTarget.value })}
        {...(block.attrs || {})}
        disabled
      />
    );
  }

  // --- span handling ---
  if (Tag === 'span') {
    return (
      <span
        style={{ ...styles, boxShadow: outlineStyle, background: selectedBackground, cursor: 'pointer' }}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        contentEditable={isSelected && block.type === 'text'}
        suppressContentEditableWarning
        onInput={(e) =>
          onUpdate({ ...block, content: e.currentTarget.textContent, innerHtml: e.currentTarget.textContent })
        }
        onBlur={(e) => {
          if (Tag !== 'img') onUpdate({ ...block, innerHtml: e.currentTarget.innerHTML });
        }}
        {...(block.attrs || {})}
      >
        {block.content || block.text || block.innerHtml || ''}
      </span>
    );
  }

  // --- default rendering ---
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
      style={{
        ...styles,
        boxShadow: outlineStyle,
        background: selectedBackground,
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      contentEditable={isSelected && block.type === 'text'}
      suppressContentEditableWarning
      onInput={(e) =>
        onUpdate({ ...block, content: e.currentTarget.textContent, innerHtml: e.currentTarget.textContent })
      }
      onBlur={(e) => {
        if (Tag !== 'img') onUpdate({ ...block, innerHtml: e.currentTarget.innerHTML });
      }}
      {...(block.attrs || {})}
      dangerouslySetInnerHTML={isHtmlContainer && !hasChildren ? { __html: rawContent } : undefined}
    >
      {(!isHtmlContainer || hasChildren) ? rawContent : null}
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
          width: '100%',              // keep full-row wrapper
          position: 'relative',
          opacity: isDragging ? 0.5 : 1,
          cursor: 'pointer',
        }}
        onClick={handleComponentClick}
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
          onMouseEnter={() => setHovered(true)}      // <— move hover handlers here
          onMouseLeave={() => setHovered(false)}
          style={{
            ...component.defaults.styles,            // component’s real box
            position: 'relative',                    // <— must be in style, not as a prop
            boxShadow: component.defaults.styles?.boxShadow || 'none',
          }}
        >
          {component.defaults.contentBlocks?.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              parentStyles={(() => {
                const s = {};
                inheritableProps.forEach((k) => {
                  if (component.defaults.styles?.[k] !== undefined) s[k] = component.defaults.styles[k];
                });
                return s;
              })()}
              selectedBlock={selectedBlock}
              onSelect={(b) => onSelect({ parentIndex: index, ...b })}
              onUpdate={(updated) => onUpdate(updated)}
              parentIndex={index}
            />
          ))}

          {/* Hover ring only on the component box */}
          {hovered && !isParentSelected && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                boxShadow: 'inset 0 0 0 2px lightblue',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Parent selection ring (also inside, so it doesn’t clobber default shadows) */}
          {isParentSelected && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                boxShadow: 'inset 0 0 0 2px lightblue',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </div>
  );
};

export default CanvasItem;
