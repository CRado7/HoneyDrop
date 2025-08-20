import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

export default function MarginPaddingControl({ type, mergedStyles, updateStyle }) {
  const sides = ['Top', 'Right', 'Bottom', 'Left'];
  const isMargin = type.toLowerCase() === 'margin';

  // Ensure all side-specific styles exist
  const stylesWithDefaults = {
    [`${type}Top`]: '0px',
    [`${type}Right`]: '0px',
    [`${type}Bottom`]: '0px',
    [`${type}Left`]: '0px',
    ...mergedStyles
  };

  const marginAuto =
    isMargin &&
    (stylesWithDefaults[`${type}Left`] === 'auto' &&
      stylesWithDefaults[`${type}Right`] === 'auto');

  const parseValueUnit = (raw) => {
    const match = /^(-?\d+(\.\d+)?)([a-z%]*)$/.exec(raw);
    if (!match) return [0, 'px'];
    return [parseFloat(match[1]), match[3] || 'px'];
  };

  const toggleMarginAuto = (checked) => {
    if (!isMargin) return;

    const newStyles = { ...stylesWithDefaults };

    if (checked) {
      newStyles[`${type}Left`] = 'auto';
      newStyles[`${type}Right`] = 'auto';
    } else {
      newStyles[`${type}Left`] = '0px';
      newStyles[`${type}Right`] = '0px';
    }

    // Keep top/bottom as-is
    updateStyle(newStyles);
  };

  const onSliderChange = (side, valueNum, unit) => {
    const newStyles = { ...stylesWithDefaults };

    // Only disable left/right sliders if marginAuto is true
    if (!(isMargin && marginAuto && (side === 'Left' || side === 'Right'))) {
      newStyles[`${type}${side}`] = `${valueNum}${unit}`;
      updateStyle(newStyles);
    }
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
        const rawValue = stylesWithDefaults[`${type}${side}`];
        const [valueNum, currentUnit] = parseValueUnit(rawValue);

        const disabled = isMargin && marginAuto && (side === 'Left' || side === 'Right');

        return (
          <Form.Group key={`${type}${side}-slider`} className="mb-2">
            <Form.Label>
              {type.charAt(0).toUpperCase() + type.slice(1)} {side}:{' '}
              {disabled ? 'auto' : valueNum + currentUnit}
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
