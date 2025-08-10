import React, { useState } from 'react';
import {
  Form,
  Row,
  Col,
  ButtonGroup,
  ToggleButton,
  Tab,
  Nav,
  OverlayTrigger,
  Tooltip,
  Accordion,
} from 'react-bootstrap';
import { BsTextLeft, BsTextCenter, BsTextRight } from 'react-icons/bs';

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

function updateNestedValue(obj, path, value) {
  const parts = path.split('.');
  const last = parts.pop();
  const newObj = { ...obj };
  let current = newObj;

  for (const part of parts) {
    if (typeof current[part] !== 'object' || current[part] === null) {
      current[part] = {};
    } else {
      current[part] = { ...current[part] };
    }
    current = current[part];
  }

  current[last] = value;
  return newObj;
}

const DEVICE_TYPES = ['desktop', 'tablet', 'mobile'];

export default function Inspector({ component, onUpdate }) {
  const [selectedDevice, setSelectedDevice] = useState('desktop');

  if (!component) return <p>Select an element to edit its content</p>;

  const fields = component.inspectorFields || [];
  const defaults = component.defaults || {};

  const getStyle = (key) => getNestedValue(defaults, key) ?? '';
  const updateStyle = (key, value) => {
    const updatedDefaults = updateNestedValue(defaults, key, value);
    onUpdate('defaults', updatedDefaults);
  };

  const renderMarginPaddingControl = (type) => {
    const sides = ['Top', 'Right', 'Bottom', 'Left'];
    const isMargin = type.toLowerCase() === 'margin';
  
    // Note: No device here since styles are flat
    const margin = getStyle(`styles.${type}`) || '';
    const marginLeft = getStyle(`styles.${type}Left`) || '';
    const marginRight = getStyle(`styles.${type}Right`) || '';
  
    console.log('Getting margin:', getStyle('styles.margin'));
console.log('Getting padding:', getStyle('styles.padding'));
console.log('margin:', margin, 'marginLeft:', marginLeft, 'marginRight:', marginRight);
  
    const marginAuto =
      isMargin &&
      (
        margin === '0 auto' ||
        (marginLeft === 'auto' && marginRight === 'auto')
      );
  
      const toggleMarginAuto = (checked) => {
        if (!isMargin) return;
      
        let updatedDefaults = { ...defaults };
      
        if (checked) {
          // Remove shorthand margin, set marginLeft/right to 'auto' and preserve top/bottom margins or default to '0px'
          const marginTop = getStyle(`styles.${type}Top`) || '0px';
          const marginBottom = getStyle(`styles.${type}Bottom`) || '0px';
      
          updatedDefaults = updateNestedValue(updatedDefaults, `styles.${type}`, ''); // Clear shorthand
          updatedDefaults = updateNestedValue(updatedDefaults, `styles.${type}Left`, 'auto');
          updatedDefaults = updateNestedValue(updatedDefaults, `styles.${type}Right`, 'auto');
          updatedDefaults = updateNestedValue(updatedDefaults, `styles.${type}Top`, marginTop);
          updatedDefaults = updateNestedValue(updatedDefaults, `styles.${type}Bottom`, marginBottom);
        } else {
          // Clear shorthand margin, set all sides explicitly to '0px'
          updatedDefaults = updateNestedValue(updatedDefaults, `styles.${type}`, '');
          updatedDefaults = updateNestedValue(updatedDefaults, `styles.${type}Left`, '0px');
          updatedDefaults = updateNestedValue(updatedDefaults, `styles.${type}Right`, '0px');
          updatedDefaults = updateNestedValue(updatedDefaults, `styles.${type}Top`, '0px');
          updatedDefaults = updateNestedValue(updatedDefaults, `styles.${type}Bottom`, '0px');
        }
      
        onUpdate('defaults', updatedDefaults);
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
          const key = `styles.${type}${side}`;
          const rawValue = getStyle(key) || '';
          const match = /^(-?\d+(?:\.\d+)?)(\D+)?$/.exec(rawValue);
          const valueNum = match ? parseFloat(match[1]) : 0;
          const currentUnit = match?.[2] ?? 'px';
  
          const disabled =
            isMargin && marginAuto && (side === 'Left' || side === 'Right');
  
          return (
            <Form.Group key={`${key}-slider`} className="mb-2">
              <Form.Label>
                {type.charAt(0).toUpperCase() + type.slice(1)} {side}:{' '}
                {disabled ? 'auto' : valueNum}
                {disabled ? '' : currentUnit}
              </Form.Label>
              <Row>
                <Col xs={9}>
                  <Form.Range
                    min={-100}
                    max={100}
                    step={1}
                    value={disabled ? 0 : valueNum}
                    disabled={disabled}
                    onChange={(e) =>
                      updateStyle(key, `${e.target.value}${currentUnit}`)
                    }
                  />
                </Col>
                <Col xs={3}>
                  <Form.Select
                    size="sm"
                    value={currentUnit}
                    disabled={disabled}
                    onChange={(e) =>
                      updateStyle(key, `${valueNum}${e.target.value}`)
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
  };   

  const renderTextAlignControl = () => {
    const alignment = getStyle(`styles.${selectedDevice}.textAlign`) || 'left';

    const options = [
      { value: 'left', icon: <BsTextLeft />, tooltip: 'Align Left' },
      { value: 'center', icon: <BsTextCenter />, tooltip: 'Align Center' },
      { value: 'right', icon: <BsTextRight />, tooltip: 'Align Right' },
    ];

    return (
      <Form.Group className="mb-3">
        <Form.Label>Text Align</Form.Label>
        <ButtonGroup>
          {options.map(({ value, icon, tooltip }) => (
            <OverlayTrigger
              key={value}
              placement="top"
              overlay={<Tooltip>{tooltip}</Tooltip>}
            >
              <ToggleButton
                id={`align-${value}`}
                type="radio"
                variant="outline-secondary"
                name="align"
                value={value}
                checked={alignment === value}
                onChange={(e) =>
                  updateStyle(`styles.${selectedDevice}.textAlign`, e.currentTarget.value)
                }
              >
                {icon}
              </ToggleButton>
            </OverlayTrigger>
          ))}
        </ButtonGroup>
      </Form.Group>
    );
  };

  return (
    <div className="vh-100" style={{ overflowY: 'scroll' }}>
      <h5>Inspector</h5>
      <p>
        Editing: <strong>{component.label || component.type}</strong>
      </p>

      <Tab.Container activeKey={selectedDevice} onSelect={(k) => setSelectedDevice(k)}>
        <Nav variant="pills" className="mb-3">
          {DEVICE_TYPES.map((device) => (
            <Nav.Item key={device}>
              <Nav.Link eventKey={device} className="text-capitalize">
                {device}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey={selectedDevice}>
            {fields.map(({ key, label, type, options, config }) => {
              const currentValue = getNestedValue(defaults, key) ?? '';

              switch (type) {
                case 'text':
                  return (
                    <Form.Group key={key} className="mb-3">
                      <Form.Label>{label}</Form.Label>
                      <Form.Control
                        type="text"
                        value={currentValue}
                        onChange={(e) => updateStyle(key, e.target.value)}
                      />
                    </Form.Group>
                  );

                case 'select':
                  return (
                    <Form.Group key={key} className="mb-3">
                      <Form.Label>{label}</Form.Label>
                      <Form.Select
                        value={currentValue}
                        onChange={(e) => updateStyle(key, e.target.value)}
                      >
                        {options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  );

                case 'color':
                  return (
                    <Form.Group key={key} className="mb-3">
                      <Form.Label>{label}</Form.Label>
                      <Form.Control
                        type="color"
                        value={/^#[0-9A-Fa-f]{6}$/.test(currentValue) ? currentValue : '#000000'}
                        onChange={(e) => updateStyle(key, e.target.value)}
                      />
                    </Form.Group>
                  );

                case 'slider': {
                  const {
                    min = 0,
                    max = 100,
                    step = 1,
                    units = ['px'],
                    defaultUnit = 'px',
                  } = config || {};

                  const match = /^(-?\d+(?:\.\d+)?)(\D+)?$/.exec(currentValue);
                  const valueNum = match ? parseFloat(match[1]) : 0;
                  const currentUnit = match?.[2] ?? defaultUnit;

                  return (
                    <Form.Group key={key} className="mb-3">
                      <Form.Label>
                        {label}: {valueNum}
                        {currentUnit}
                      </Form.Label>
                      <Row>
                        <Col xs={9}>
                          <Form.Range
                            min={min}
                            max={max}
                            step={step}
                            value={valueNum}
                            onChange={(e) =>
                              updateStyle(key, `${e.target.value}${currentUnit}`)
                            }
                          />
                        </Col>
                        <Col xs={3}>
                          {units.length > 1 && (
                            <Form.Select
                              size="sm"
                              value={currentUnit}
                              onChange={(e) =>
                                updateStyle(key, `${valueNum}${e.target.value}`)
                              }
                            >
                              {units.map((u) => (
                                <option key={u} value={u}>
                                  {u}
                                </option>
                              ))}
                            </Form.Select>
                          )}
                        </Col>
                      </Row>
                    </Form.Group>
                  );
                }

                default:
                  return null;
              }
            })}

            <Accordion defaultActiveKey="0" className="mt-4">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Layout Controls</Accordion.Header>
                <Accordion.Body>
                  {renderMarginPaddingControl('margin')}
                  {renderMarginPaddingControl('padding')}
                  {renderTextAlignControl()}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
