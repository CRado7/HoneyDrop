// src/components/InspectorSections/MarginPaddingControl.js
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export default function MarginPaddingControl({ type, mergedStyles, updateStyle }) {
  const sides = ['Top', 'Right', 'Bottom', 'Left'];
  const isMargin = type.toLowerCase() === 'margin';
  const margin = mergedStyles[`${type}`] || '';
  const marginLeft = mergedStyles[`${type}Left`] || '';
  const marginRight = mergedStyles[`${type}Right`] || '';
  const marginAuto =
    isMargin &&
    (margin === '0 auto' || (marginLeft === 'auto' && marginRight === 'auto'));

  const parseValueUnit = (raw) => {
    const match = /^(-?\d+(\.\d+)?)([a-z%]*)$/.exec(raw);
    if (!match) return [0, 'px'];
    return [parseFloat(match[1]), match[3] || 'px'];
  };

  const toggleMarginAuto = (checked) => {
    if (!isMargin) return;

    let newStyles = { ...mergedStyles };

    if (checked) {
      newStyles[`${type}`] = '';
      newStyles[`${type}Left`] = 'auto';
      newStyles[`${type}Right`] = 'auto';
      newStyles[`${type}Top`] = newStyles[`${type}Top`] || '0px';
      newStyles[`${type}Bottom`] = newStyles[`${type}Bottom`] || '0px';
    } else {
      newStyles[`${type}`] = '';
      newStyles[`${type}Left`] = '0px';
      newStyles[`${type}Right`] = '0px';
      newStyles[`${type}Top`] = newStyles[`${type}Top`] || '0px';
      newStyles[`${type}Bottom`] = newStyles[`${type}Bottom`] || '0px';
    }

    updateStyle(null, newStyles);
  };

  const onSliderChange = (side, valueNum, unit) => {
    let newStyles = { ...mergedStyles };
    if (isMargin && marginAuto && (side === 'Left' || side === 'Right')) {
      return;
    }
    newStyles[`${type}${side}`] = `${valueNum}${unit}`;
    updateStyle(null, newStyles);
  };

  return (
    <div className="mb-4">
      <h6 className="mb-3 text-capitalize">{type}</h6>

      {isMargin && (
        <Form.Check
          type="checkbox"
          id={`${type}-auto`}
          label="Center with margin: auto"
          checked={marginAuto}
          onChange={(e) => toggleMarginAuto(e.target.checked)}
          className="mb-3"
        />
      )}

      {sides.map((side) => {
        const rawValue = mergedStyles[`${type}${side}`] || '0px';
        const [valueNum, currentUnit] = parseValueUnit(rawValue);

        const disabled = isMargin && marginAuto && (side === 'Left' || side === 'Right');

        return (
          <Form.Group key={`${type}${side}-slider`} className="mb-2">
            <Form.Label>
              {type.charAt(0).toUpperCase() + type.slice(1)} {side}: {disabled ? 'auto' : valueNum}
              {disabled ? '' : currentUnit}
            </Form.Label>
            <Row>
              <Col xs={3}>
                <Form.Control
                  type="number"
                  value={disabled ? 0 : valueNum}
                  disabled={disabled}
                  onChange={(e) =>
                    onSliderChange(side, parseFloat(e.target.value) || 0, currentUnit)
                  }
                />
              </Col>
              <Col xs={6}>
                <Form.Range
                  min={-100}
                  max={100}
                  step={1}
                  value={disabled ? 0 : valueNum}
                  disabled={disabled}
                  onChange={(e) =>
                    onSliderChange(side, parseFloat(e.target.value), currentUnit)
                  }
                />
              </Col>
              <Col xs={3}>
                <Form.Select
                  size="sm"
                  value={currentUnit}
                  disabled={disabled}
                  onChange={(e) =>
                    onSliderChange(side, valueNum, e.target.value)
                  }
                >
                  <option value="px">px</option>
                  <option value="%">%</option>
                  <option value="rem">rem</option>
                  <option value="em">em</option>
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>
        );
      })}
    </div>
  );
}
