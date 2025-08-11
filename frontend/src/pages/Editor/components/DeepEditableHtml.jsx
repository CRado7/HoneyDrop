import React, { useState, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';

// Helper functions to parse and serialize nodes

function parseHTMLToNodes(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html || '<div></div>', 'text/html');
  return Array.from(doc.body.childNodes);
}

function nodesToHtml(nodes) {
  const container = document.createElement('div');
  nodes.forEach((node) => {
    container.appendChild(node.cloneNode(true));
  });
  return container.innerHTML;
}

function serializeNodeAttributes(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) return {};

  const attrs = {};
  for (const attr of node.attributes) {
    attrs[attr.name] = attr.value;
  }
  return attrs;
}

function styleObjectToString(styleObj) {
  return Object.entries(styleObj)
    .map(([key, val]) => `${key}: ${val}`)
    .join('; ');
}

function stringToStyleObject(styleStr) {
  const styleObj = {};
  styleStr.split(';').forEach((pair) => {
    const [key, val] = pair.split(':').map(s => s.trim());
    if (key && val) styleObj[key] = val;
  });
  return styleObj;
}

export default function DeepEditableHtml({ htmlContent, onChange }) {
  const [nodes, setNodes] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({}); // track expand state by path

  useEffect(() => {
    const parsed = parseHTMLToNodes(htmlContent);
    setNodes(parsed);
  }, [htmlContent]);

  const updateHtml = useCallback(
    (newNodes) => {
      const dirtyHtml = nodesToHtml(newNodes);
      // Sanitize before sending up!
      const cleanHtml = DOMPurify.sanitize(dirtyHtml);
      onChange(cleanHtml);
    },
    [onChange]
  );

  // Helper: deep clone nodes (because DOM nodes are mutable)
  const deepCloneNodes = (nodes) => {
    const container = document.createElement('div');
    nodes.forEach((node) => container.appendChild(node.cloneNode(true)));
    return Array.from(container.childNodes);
  };

  // Update a node at a given path with a mutator callback
  const updateNodeAtPath = (path, mutator) => {
    setNodes((prevNodes) => {
      const newNodes = deepCloneNodes(prevNodes);
      let current = newNodes;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].childNodes;
      }
      mutator(current[path[path.length - 1]]);
      updateHtml(newNodes);
      return newNodes;
    });
  };

  // Toggle expand/collapse nodes
  const toggleExpand = (key) => {
    setExpandedNodes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Render a node recursively
  const renderNode = (node, path = []) => {
    const key = path.join('-');
    const isExpanded = expandedNodes[key] ?? false;

    if (node.nodeType === Node.TEXT_NODE) {
      return (
        <div key={key} style={{ marginLeft: 20, border: '1px dotted #ccc', padding: 5 }}>
          <strong>#text</strong>:
          <div
            contentEditable
            suppressContentEditableWarning
            style={{ minHeight: 20, whiteSpace: 'pre-wrap', cursor: 'text' }}
            onInput={(e) => {
              const newText = e.currentTarget.textContent;
              updateNodeAtPath(path, (targetNode) => {
                targetNode.textContent = newText;
              });
            }}
          >
            {node.textContent}
          </div>
        </div>
      );
    }

    // ELEMENT NODE
    const attrs = serializeNodeAttributes(node);
    const inlineStyles = node.style.cssText || '';

    const children = node.childNodes ? Array.from(node.childNodes) : [];

    return (
      <div
        key={key}
        style={{
          marginLeft: 10,
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: 5,
          marginBottom: 5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {children.length > 0 && (
            <button
              type="button"
              onClick={() => toggleExpand(key)}
              aria-label={isExpanded ? 'Collapse children' : 'Expand children'}
              style={{
                marginRight: 6,
                userSelect: 'none',
                cursor: 'pointer',
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}

          <strong>{`<${node.nodeName.toLowerCase()}>`}</strong>

          <button
            type="button"
            onClick={() => {
              // Delete node
              updateNodeAtPath(path.slice(0, -1), (parentNode) => {
                parentNode.removeChild(parentNode.childNodes[path[path.length - 1]]);
              });
            }}
            style={{
              marginLeft: 'auto',
              background: 'red',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
            title="Delete node"
          >
            ×
          </button>
        </div>

        {/* Attributes editor */}
        <div style={{ marginTop: 6, marginLeft: 24 }}>
          {Object.entries(attrs).map(([attrName, attrValue]) => (
            <div key={attrName} style={{ marginBottom: 4 }}>
              <label>
                {attrName}:{' '}
                <input
                  type="text"
                  value={attrValue}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    updateNodeAtPath(path, (targetNode) => {
                      if (newVal === '') {
                        targetNode.removeAttribute(attrName);
                      } else {
                        targetNode.setAttribute(attrName, newVal);
                      }
                    });
                  }}
                  style={{ width: 200 }}
                />
              </label>
            </div>
          ))}

          {/* Allow adding a new attribute */}
          <AddAttributeInput nodePath={path} updateNodeAtPath={updateNodeAtPath} />
        </div>

        {/* Inline styles editor */}
        <div style={{ marginTop: 6, marginLeft: 24 }}>
          <label>
            Styles:
            <textarea
              rows={3}
              value={inlineStyles}
              onChange={(e) => {
                const styleText = e.target.value;
                updateNodeAtPath(path, (targetNode) => {
                  targetNode.style.cssText = styleText;
                });
              }}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        {/* Editable inner text */}
        <div
          contentEditable
          suppressContentEditableWarning
          style={{
            marginTop: 6,
            minHeight: 24,
            border: '1px dashed #999',
            padding: 4,
            whiteSpace: 'pre-wrap',
            cursor: 'text',
          }}
          onInput={(e) => {
            const newText = e.currentTarget.textContent;
            updateNodeAtPath(path, (targetNode) => {
              // Clear existing children, set text content
              while (targetNode.firstChild) targetNode.removeChild(targetNode.firstChild);
              targetNode.appendChild(document.createTextNode(newText));
            });
          }}
        >
          {node.textContent}
        </div>

        {/* Recursively render children if expanded */}
        {isExpanded && children.length > 0 && (
          <div style={{ marginLeft: 20, marginTop: 6 }}>
            {children.map((childNode, idx) => renderNode(childNode, [...path, idx]))}
          </div>
        )}
      </div>
    );
  };

  // Subcomponent to add a new attribute
  const AddAttributeInput = ({ nodePath, updateNodeAtPath }) => {
    const [attrName, setAttrName] = useState('');
    const [attrValue, setAttrValue] = useState('');

    const handleAdd = () => {
      if (!attrName.trim()) return;
      updateNodeAtPath(nodePath, (targetNode) => {
        targetNode.setAttribute(attrName, attrValue);
      });
      setAttrName('');
      setAttrValue('');
    };

    return (
      <div style={{ marginTop: 4 }}>
        <input
          placeholder="attr name"
          value={attrName}
          onChange={(e) => setAttrName(e.target.value)}
          style={{ width: '40%', marginRight: 4 }}
        />
        <input
          placeholder="attr value"
          value={attrValue}
          onChange={(e) => setAttrValue(e.target.value)}
          style={{ width: '40%', marginRight: 4 }}
        />
        <button type="button" onClick={handleAdd}>
          Add Attribute
        </button>
      </div>
    );
  };

  return <div>{nodes.map((node, i) => renderNode(node, [i]))}</div>;
}
