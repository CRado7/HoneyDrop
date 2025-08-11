import React from 'react';
import { Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function ShadowEffects({ mergedStyles, updateStyle, parseValueUnit }) {
  const boxShadowProps = [
    { key: 'boxShadowOffsetX', label: 'Offset X' },
    { key: 'boxShadowOffsetY', label: 'Offset Y' },
    { key: 'boxShadowBlur', label: 'Blur' },
    { key: 'boxShadowSpread', label: 'Spread' },
  ];

  const textShadowProps = [
    { key: 'textShadowOffsetX', label: 'Offset X' },
    { key: 'textShadowOffsetY', label: 'Offset Y' },
    { key: 'textShadowBlur', label: 'Blur' },
  ];

  const renderShadowGroup = (title, propsArray, colorKey) => (
    <div className="mb-4">
      <h6 className="mb-3">{title}</h6>

      {propsArray.map(({ key, label }) => {
        const rawValue = mergedStyles[key] || '0px';
        const [valueNum, unit] = parseValueUnit(rawValue);
        return (
          <Form.Group key={key} className="mb-3">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`${key}-tooltip`}>{`Adjust the ${label.toLowerCase()} of ${title.toLowerCase()}.`}</Tooltip>}
            >
              <Form.Label>{label}</Form.Label>
            </OverlayTrigger>
            <Row>
              <Col xs={3}>
                <Form.Control
                  type="number"
                  value={valueNum}
                  onChange={(e) => updateStyle(key, `${e.target.value}${unit}`)}
                />
              </Col>
              <Col xs={6}>
                <Form.Range
                  min={-100}
                  max={100}
                  step={1}
                  value={valueNum}
                  onChange={(e) => updateStyle(key, `${e.target.value}${unit}`)}
                />
              </Col>
              <Col xs={3}>
                <Form.Select
                  size="sm"
                  value={unit}
                  onChange={(e) => updateStyle(key, `${valueNum}${e.target.value}`)}
                >
                  <option value="px">px</option>
                  <option value="rem">rem</option>
                  <option value="em">em</option>
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>
        );
      })}

      {colorKey && (
        <Form.Group className="mb-3">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`${colorKey}-tooltip`}>Choose the color of the {title.toLowerCase()}.</Tooltip>}
          >
            <Form.Label>{title} Color</Form.Label>
          </OverlayTrigger>
          <Form.Control
            type="color"
            value={
              /^#[0-9A-Fa-f]{6}$/.test(mergedStyles[colorKey])
                ? mergedStyles[colorKey]
                : '#000000'
            }
            onChange={(e) => updateStyle(colorKey, e.target.value)}
          />
        </Form.Group>
      )}
    </div>
  );

  return (
    <>
      {renderShadowGroup('Box Shadow', boxShadowProps, 'boxShadowColor')}
      {renderShadowGroup('Text Shadow', textShadowProps, 'textShadowColor')}
    </>
  );
}
