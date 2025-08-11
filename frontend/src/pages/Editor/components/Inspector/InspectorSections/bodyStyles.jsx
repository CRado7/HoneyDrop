// src/components/InspectorSections/BodyStyles.js
import React from 'react';
import { Form } from 'react-bootstrap';

export default function BodyStyles({ component, GLOBAL_DEFAULT_STYLES, onUpdateBodyStyles }) {
  const bodyStyles = component?.bodyStyles || GLOBAL_DEFAULT_STYLES;

  const updateBodyStyle = (key, value) => {
    if (typeof onUpdateBodyStyles === 'function') {
      onUpdateBodyStyles(key, value);
    }
  };

  const parseValueUnit = (raw) => {
    const match = /^(-?\d+(\.\d+)?)([a-z%]*)$/.exec(raw);
    if (!match) return [0, 'px'];
    return [parseFloat(match[1]), match[3] || 'px'];
  };

  // Paddings
  const [paddingTopNum, paddingTopUnit] = parseValueUnit(bodyStyles.paddingTop || '0px');
  const [paddingBottomNum, paddingBottomUnit] = parseValueUnit(bodyStyles.paddingBottom || '0px');
  const [paddingLeftNum, paddingLeftUnit] = parseValueUnit(bodyStyles.paddingLeft || '0px');

  // Background color default transparent
  const backgroundColor = /^#[0-9A-Fa-f]{6}$/.test(bodyStyles.backgroundColor)
    ? bodyStyles.backgroundColor
    : '#ffffff';

  // Layout options
  const display = bodyStyles.display || 'block';
  const flexDirection = bodyStyles.flexDirection || 'row';
  const justifyContent = bodyStyles.justifyContent || 'flex-start';
  const alignItems = bodyStyles.alignItems || 'stretch';

  // Update padding left & right together
  const updatePaddingSides = (valueNum, unit) => {
    const val = `${valueNum}${unit}`;
    updateBodyStyle('paddingLeft', val);
    updateBodyStyle('paddingRight', val);
  };

  return (
    <div>
      <h6>Body Styles</h6>

      <Form.Group className="mb-3">
        <Form.Label>Padding Top</Form.Label>
        <Form.Control
          type="number"
          min={0}
          value={paddingTopNum}
          onChange={(e) => updateBodyStyle('paddingTop', `${e.target.value}${paddingTopUnit}`)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Padding Bottom</Form.Label>
        <Form.Control
          type="number"
          min={0}
          value={paddingBottomNum}
          onChange={(e) => updateBodyStyle('paddingBottom', `${e.target.value}${paddingBottomUnit}`)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Padding Left & Right</Form.Label>
        <Form.Control
          type="number"
          min={0}
          value={paddingLeftNum}
          onChange={(e) => updatePaddingSides(parseFloat(e.target.value), paddingLeftUnit)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Background Color</Form.Label>
        <Form.Control
          type="color"
          value={backgroundColor}
          onChange={(e) => updateBodyStyle('backgroundColor', e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Display</Form.Label>
        <Form.Select
          value={display}
          onChange={(e) => updateBodyStyle('display', e.target.value)}
        >
          <option value="block">Block</option>
          <option value="flex">Flex</option>
        </Form.Select>
      </Form.Group>

      {display === 'flex' && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Flex Direction</Form.Label>
            <Form.Select
              value={flexDirection}
              onChange={(e) => updateBodyStyle('flexDirection', e.target.value)}
            >
              <option value="row">Row</option>
              <option value="column">Column</option>
              <option value="row-reverse">Row Reverse</option>
              <option value="column-reverse">Column Reverse</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Justify Content</Form.Label>
            <Form.Select
              value={justifyContent}
              onChange={(e) => updateBodyStyle('justifyContent', e.target.value)}
            >
              <option value="flex-start">Flex Start</option>
              <option value="center">Center</option>
              <option value="flex-end">Flex End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
              <option value="space-evenly">Space Evenly</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Align Items</Form.Label>
            <Form.Select
              value={alignItems}
              onChange={(e) => updateBodyStyle('alignItems', e.target.value)}
            >
              <option value="stretch">Stretch</option>
              <option value="flex-start">Flex Start</option>
              <option value="center">Center</option>
              <option value="flex-end">Flex End</option>
              <option value="baseline">Baseline</option>
            </Form.Select>
          </Form.Group>
        </>
      )}
    </div>
  );
}
