import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const BORDER_STYLES = ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];

export default function BorderOptions({ mergedStyles, updateStyle, parseValueUnit }) {
  const borderWidthRaw = mergedStyles.borderWidth || '0px';
  const [borderWidthNum, borderWidthUnit] = parseValueUnit(borderWidthRaw);

  const borderStyle = mergedStyles.borderStyle || 'none';
  const borderColor = /^#[0-9A-Fa-f]{6}$/.test(mergedStyles.borderColor) ? mergedStyles.borderColor : '#000000';

  const borderRadiusRaw = mergedStyles.borderRadius || '0px';
  const [borderRadiusNum, borderRadiusUnit] = parseValueUnit(borderRadiusRaw);

  const updateBorderWidth = (valueNum, unit) => updateStyle('borderWidth', `${valueNum}${unit}`);
  const updateBorderStyle = (value) => updateStyle('borderStyle', value);
  const updateBorderColor = (value) => updateStyle('borderColor', value);
  const updateBorderRadius = (valueNum, unit) => updateStyle('borderRadius', `${valueNum}${unit}`);

  return (
    <>
      <h6 className="mb-3">Border</h6>
      <Form.Group className="mb-3">
        <Form.Label>Border Width</Form.Label>
        <Row>
          <Col xs={3}>
            <Form.Control
              type="number"
              min={0}
              max={50}
              step={1}
              value={borderWidthNum}
              onChange={(e) => updateBorderWidth(parseFloat(e.target.value) || 0, borderWidthUnit)}
            />
          </Col>
          <Col xs={6}>
            <Form.Range
              min={0}
              max={50}
              step={1}
              value={borderWidthNum}
              onChange={(e) => updateBorderWidth(parseFloat(e.target.value), borderWidthUnit)}
            />
          </Col>
          <Col xs={3}>
            <Form.Select
              size="sm"
              value={borderWidthUnit}
              onChange={(e) => updateBorderWidth(borderWidthNum, e.target.value)}
            >
              <option value="px">px</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
              <option value="%">%</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Border Style</Form.Label>
        <Form.Select
          value={borderStyle}
          onChange={(e) => updateBorderStyle(e.target.value)}
        >
          {BORDER_STYLES.map((style) => (
            <option key={style} value={style}>
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Border Color</Form.Label>
        <Form.Control
          type="color"
          value={borderColor}
          onChange={(e) => updateBorderColor(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Border Radius</Form.Label>
        <Row>
          <Col xs={3}>
            <Form.Control
              type="number"
              min={0}
              max={100}
              step={1}
              value={borderRadiusNum}
              onChange={(e) => updateBorderRadius(parseFloat(e.target.value) || 0, borderRadiusUnit)}
            />
          </Col>
          <Col xs={6}>
            <Form.Range
              min={0}
              max={100}
              step={1}
              value={borderRadiusNum}
              onChange={(e) => updateBorderRadius(parseFloat(e.target.value), borderRadiusUnit)}
            />
          </Col>
          <Col xs={3}>
            <Form.Select
              size="sm"
              value={borderRadiusUnit}
              onChange={(e) => updateBorderRadius(borderRadiusNum, e.target.value)}
            >
              <option value="px">px</option>
              <option value="%">%</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    </>
  );
}
