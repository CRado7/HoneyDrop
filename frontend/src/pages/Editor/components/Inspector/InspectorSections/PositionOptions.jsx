import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export default function PositionOptions({ mergedStyles, updateStyle }) {
  const position = mergedStyles.position || 'static';
  const zIndex = mergedStyles.zIndex || '';

  const sides = ['top', 'right', 'bottom', 'left'];

  const parseValueUnit = (val) => {
    if (!val) return { value: '', unit: 'px' };
    const match = val.match(/^(-?\d*\.?\d+)([a-z%]*)$/i);
    return match ? { value: match[1], unit: match[2] || 'px' } : { value: val, unit: 'px' };
  };

  return (
    <div className="p-3 border rounded bg-white mb-3">
      <h6 className="fw-bold mb-3">Position</h6>

      {/* Position Type */}
      <Form.Group className="mb-3">
        <Form.Label>Position Type</Form.Label>
        <Form.Select
          value={position}
          onChange={(e) => updateStyle('position', e.target.value)}
        >
          <option value="static">Static</option>
          <option value="relative">Relative</option>
          <option value="absolute">Absolute</option>
          <option value="fixed">Fixed</option>
          <option value="sticky">Sticky</option>
        </Form.Select>
      </Form.Group>

      {/* Z-Index */}
      <Form.Group className="mb-3">
        <Form.Label>Z-Index</Form.Label>
        <Form.Control
          type="number"
          value={zIndex}
          onChange={(e) => updateStyle('zIndex', e.target.value)}
        />
      </Form.Group>

      {/* Sides */}
      {sides.map((side) => {
        const { value, unit } = parseValueUnit(mergedStyles[side]);
        return (
          <Form.Group className="mb-3" key={side}>
            <Form.Label>{side.charAt(0).toUpperCase() + side.slice(1)}</Form.Label>
            <Row>
              <Col xs={8}>
                <Form.Control
                  type="number"
                  value={value}
                  onChange={(e) =>
                    updateStyle(side, e.target.value ? e.target.value + unit : '')
                  }
                />
              </Col>
              <Col xs={4}>
                <Form.Select
                  value={unit}
                  onChange={(e) =>
                    updateStyle(side, value ? value + e.target.value : '')
                  }
                >
                  <option value="px">px</option>
                  <option value="%">%</option>
                  <option value="em">em</option>
                  <option value="rem">rem</option>
                  <option value="dvh">dvh</option>
                  <option value="dvw">dvw</option>
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>
        );
      })}
    </div>
  );
}
