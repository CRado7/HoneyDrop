// src/components/InspectorSections/TextOptions.js
import React from 'react';
import { Form, Row, Col, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { BsTextLeft, BsTextCenter, BsTextRight } from 'react-icons/bs';
import FontList from '../../../../../data/systemFonts'

export default function TextOptions({ mergedStyles, updateStyle, parseValueUnit }) {
  const alignment = mergedStyles.textAlign || 'left';
  const fontSizeRaw = mergedStyles.fontSize || '16px';
  const [fontSizeNum, fontSizeUnit] = parseValueUnit(fontSizeRaw);

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Font Size</Form.Label>
        <Row>
          <Col xs={3}>
            <Form.Control
              type="number"
              min={fontSizeUnit === '%' ? 0 : 8}
              max={fontSizeUnit === '%' ? 100 : 72}
              step={1}
              value={fontSizeNum}
              onChange={(e) => updateStyle('fontSize', `${e.target.value}${fontSizeUnit}`)}
            />
          </Col>
          <Col xs={6}>
            <Form.Range
              min={fontSizeUnit === '%' ? 0 : 8}
              max={fontSizeUnit === '%' ? 100 : 72}
              step={1}
              value={fontSizeNum}
              onChange={(e) => updateStyle('fontSize', `${e.target.value}${fontSizeUnit}`)}
            />
          </Col>
          <Col xs={3}>
            <Form.Select
              size="sm"
              value={fontSizeUnit}
              onChange={(e) => updateStyle('fontSize', `${fontSizeNum}${e.target.value}`)}
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
        <Form.Label>Font Weight</Form.Label>
        <Form.Select
          value={mergedStyles.fontWeight || 'normal'}
          onChange={(e) => updateStyle('fontWeight', e.target.value)}
        >
          {[
            'normal', 'bold', 'bolder', 'lighter',
            '100', '200', '300', '400', '500', '600', '700', '800', '900',
          ].map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Font Family</Form.Label>
        <Form.Select
          value={mergedStyles.fontFamily || ''}
          onChange={(e) => updateStyle('fontFamily', e.target.value)}
        >
          <option value="">Select a font</option>
          {FontList.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Color</Form.Label>
        <Form.Control
          type="color"
          value={/^#[0-9A-Fa-f]{6}$/.test(mergedStyles.color) ? mergedStyles.color : '#000000'}
          onChange={(e) => updateStyle('color', e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Line Height</Form.Label>
        <Form.Control
          type="number"
          step="0.1"
          min="0"
          value={parseFloat(mergedStyles.lineHeight) || 1.6}
          onChange={(e) => updateStyle('lineHeight', e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Letter Spacing</Form.Label>
        <Row>
          <Col xs={9}>
            <Form.Range
              min={-5}
              max={20}
              step={0.1}
              value={parseFloat(mergedStyles.letterSpacing) || 0}
              onChange={(e) => updateStyle('letterSpacing', `${e.target.value}px`)}
            />
          </Col>
          <Col xs={3}>
            <Form.Text>px</Form.Text>
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Text Align</Form.Label>
        <ButtonGroup>
          {[
            { value: 'left', icon: <BsTextLeft /> },
            { value: 'center', icon: <BsTextCenter /> },
            { value: 'right', icon: <BsTextRight /> },
          ].map(({ value, icon }) => (
            <ToggleButton
              key={value}
              id={`text-align-${value}`}
              type="radio"
              variant="outline-secondary"
              name="textAlign"
              value={value}
              checked={alignment === value}
              onChange={(e) => updateStyle('textAlign', e.currentTarget.value)}
            >
              {icon}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Form.Group>
    </>
  );
}
