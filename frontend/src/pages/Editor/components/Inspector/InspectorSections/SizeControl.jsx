// src/components/InspectorSections/SizeControl.js
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export default function SizeControl({ mergedStyles, updateStyle }) {
  const parseValueUnit = (raw) => {
    const match = /^(-?\d+(\.\d+)?)([a-z%]*)$/.exec(raw);
    if (!match) return [0, 'px'];
    return [parseFloat(match[1]), match[3] || 'px'];
  };

  const widthRaw = mergedStyles.width || '';
  const [widthNum, widthUnit] = parseValueUnit(widthRaw || '0px');

  const heightRaw = mergedStyles.height || '';
  const isHeightAuto = heightRaw === 'auto' || heightRaw === '';
  const [heightNum, heightUnit] = isHeightAuto ? [0, 'px'] : parseValueUnit(heightRaw);

  const updateWidth = (valueNum, unit) => {
    updateStyle('width', `${valueNum}${unit}`);
  };

  const updateHeight = (valueNum, unit) => {
    updateStyle('height', `${valueNum}${unit}`);
  };

  const toggleHeightAuto = (checked) => {
    if (checked) {
      updateStyle('height', 'auto');
    } else {
      updateStyle('height', '0px');
    }
  };

  return (
    <div className="mb-4">
      <h6 className="mb-3">Size</h6>
      <Form.Group className="mb-3">
        <Form.Label>Width</Form.Label>
        <Row>
          <Col xs={3}>
            <Form.Control
              type="number"
              min={0}
              max={widthUnit === '%' ? 100 : 1000}
              step={1}
              value={widthNum}
              onChange={(e) => updateWidth(parseFloat(e.target.value) || 0, widthUnit)}
            />
          </Col>
          <Col xs={6}>
            <Form.Range
              min={0}
              max={widthUnit === '%' ? 100 : 1000}
              step={1}
              value={widthNum}
              onChange={(e) => updateWidth(parseFloat(e.target.value), widthUnit)}
            />
          </Col>
          <Col xs={3}>
            <Form.Select
              size="sm"
              value={widthUnit}
              onChange={(e) => updateWidth(widthNum, e.target.value)}
            >
              <option value="px">px</option>
              <option value="%">%</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          id="height-auto"
          label="Height: auto"
          checked={isHeightAuto}
          onChange={(e) => toggleHeightAuto(e.target.checked)}
          className="mb-2"
        />
        <Form.Label>Height</Form.Label>
        <Row>
          <Col xs={3}>
            <Form.Control
              type="number"
              min={0}
              max={1000}
              step={1}
              value={heightNum}
              disabled={isHeightAuto}
              onChange={(e) => updateHeight(parseFloat(e.target.value) || 0, heightUnit)}
            />
          </Col>
          <Col xs={6}>
            <Form.Range
              min={0}
              max={1000}
              step={1}
              value={heightNum}
              disabled={isHeightAuto}
              onChange={(e) => updateHeight(parseFloat(e.target.value), heightUnit)}
            />
          </Col>
          <Col xs={3}>
            <Form.Select
              size="sm"
              value={heightUnit}
              disabled={isHeightAuto}
              onChange={(e) => updateHeight(heightNum, e.target.value)}
            >
              <option value="px">px</option>
              <option value="%">%</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    </div>
  );
}
