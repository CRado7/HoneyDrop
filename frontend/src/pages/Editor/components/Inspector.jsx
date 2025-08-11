import React, { useState } from 'react';
import {
  Form,
  Row,
  Col,
  Accordion,
  ButtonGroup,
  ToggleButton,
  Nav,
  Tab,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { BsTextLeft, BsTextCenter, BsTextRight } from 'react-icons/bs';
import RichTextEditor from './RichTextEditor';

// Your global default styles (seed defaults)
const GLOBAL_DEFAULT_STYLES = {
  fontSize: '16px',
  fontWeight: 'normal',
  color: '#000000',
  fontFamily: 'Arial, sans-serif',
  lineHeight: '1.6',
  letterSpacing: '0px',

  marginTop: '0px',
  marginRight: '0px',
  marginBottom: '16px',
  marginLeft: '0px',

  paddingTop: '0px',
  paddingRight: '0px',
  paddingBottom: '0px',
  paddingLeft: '0px',

  textAlign: 'left',

  boxShadowOffsetX: '0px',
  boxShadowOffsetY: '0px',
  boxShadowBlur: '0px',
  boxShadowSpread: '0px',
  boxShadowColor: '#000000',
  
  backgroundColor: 'transparent',
  backgroundImage: '',
};

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

  const defaults = component.defaults || {};
  // Merge global defaults with current styles (flatten)
  // Use only styles, ignore device-specific styles here for simplicity
  const mergedStyles = { ...GLOBAL_DEFAULT_STYLES, ...defaults.styles };

  // Update style for key (flat style keys)
// Adjust your updateStyle to accept either a key/value or full styles update
const updateStyle = (keyOrNull, valueOrStyles) => {
  const updatedDefaults = { ...defaults };
  if (keyOrNull === null && typeof valueOrStyles === 'object') {
    // Update entire styles object at once
    updatedDefaults.styles = { ...valueOrStyles };
  } else {
    // Update single key
    updatedDefaults.styles = { ...mergedStyles, [keyOrNull]: valueOrStyles };
  }
  onUpdate('defaults', updatedDefaults);
};


  // Helper to parse number + unit from string like "16px"
  const parseValueUnit = (raw) => {
    const match = /^(-?\d+(\.\d+)?)([a-z%]*)$/.exec(raw);
    if (!match) return [0, 'px'];
    return [parseFloat(match[1]), match[3] || 'px'];
  };

  // Determine which key to use for content: prefer 'content', fallback to 'text'
  const contentKey = defaults.content !== undefined ? 'content' : 'text';

  // Determine content value to edit
  const content = defaults[contentKey] ?? '';

  // Update content and keep key consistent
  const updateContent = (newContent) => {
    const updatedDefaults = { ...defaults, [contentKey]: newContent };
    onUpdate('defaults', updatedDefaults);
  };

  // Renders sliders for margin/padding sides grouped by type
  const renderMarginPaddingControl = (type) => {
    const sides = ['Top', 'Right', 'Bottom', 'Left'];
    const isMargin = type.toLowerCase() === 'margin';
  
    // Get the flat styles object
    const margin = mergedStyles[`${type}`] || '';
    const marginLeft = mergedStyles[`${type}Left`] || '';
    const marginRight = mergedStyles[`${type}Right`] || '';
  
    // marginAuto true if either shorthand "0 auto" or left+right are 'auto'
    const marginAuto =
      isMargin &&
      (
        margin === '0 auto' ||
        (marginLeft === 'auto' && marginRight === 'auto')
      );
  
    // Toggle margin auto on/off
    const toggleMarginAuto = (checked) => {
      if (!isMargin) return;
  
      let newStyles = { ...mergedStyles };
  
      if (checked) {
        // Preserve top and bottom, clear margin shorthand, set left/right to auto
        newStyles[`${type}`] = '';
        newStyles[`${type}Left`] = 'auto';
        newStyles[`${type}Right`] = 'auto';
        newStyles[`${type}Top`] = newStyles[`${type}Top`] || '0px';
        newStyles[`${type}Bottom`] = newStyles[`${type}Bottom`] || '0px';
      } else {
        // Remove auto and reset left/right to 0px, clear shorthand
        newStyles[`${type}`] = '';
        newStyles[`${type}Left`] = '0px';
        newStyles[`${type}Right`] = '0px';
        newStyles[`${type}Top`] = newStyles[`${type}Top`] || '0px';
        newStyles[`${type}Bottom`] = newStyles[`${type}Bottom`] || '0px';
      }
  
      updateStyle(null, newStyles); // update whole styles object
    };
  
    // Handle slider changes for individual sides
    const onSliderChange = (side, valueNum, unit) => {
      let newStyles = { ...mergedStyles };
  
      // Prevent changes to left/right if marginAuto enabled
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
  };
  // Helper to render width/height sliders with unit and auto toggle for height
  const renderSizeControl = () => {
    // Width
    const widthRaw = mergedStyles.width || '';
    const [widthNum, widthUnit] = parseValueUnit(widthRaw || '0px');

    // Height
    const heightRaw = mergedStyles.height || '';
    const isHeightAuto = heightRaw === 'auto' || heightRaw === '';
    const [heightNum, heightUnit] = isHeightAuto ? [0, 'px'] : parseValueUnit(heightRaw);

    // Update handlers
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
        // default fallback to 0px when auto disabled
        updateStyle('height', '0px');
      }
    };

    return (
      <div className="mb-4">
        <h6 className="mb-3">Size</h6>

        {/* Width */}
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

        {/* Height */}
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
  };   

  // Render Text Options section
  const renderTextOptions = () => {
    // TextAlign with button group and tooltip
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
            {['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Font Family</Form.Label>
          <Form.Control
            type="text"
            value={mergedStyles.fontFamily || ''}
            onChange={(e) => updateStyle('fontFamily', e.target.value)}
            placeholder="e.g. Arial, sans-serif"
          />
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
  };

  // Render Shadow Effects section
  const renderShadowEffects = () => {
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
  
    // Helper to render a group of sliders
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
  };   

  // Render Background section
  const renderBackgroundOptions = () => (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Background Color</Form.Label>
        <Form.Control
          type="color"
          value={/^#[0-9A-Fa-f]{6}$/.test(mergedStyles.backgroundColor) ? mergedStyles.backgroundColor : '#ffffff'}
          onChange={(e) => updateStyle('backgroundColor', e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Background Image URL</Form.Label>
        <Form.Control
          type="text"
          value={mergedStyles.backgroundImage || ''}
          onChange={(e) => updateStyle('backgroundImage', e.target.value)}
          placeholder="e.g. https://example.com/image.png"
        />
      </Form.Group>
    </>
  );

  // Render Layout section (margin, padding)
  const renderLayoutOptions = () => (
    <>
      {renderMarginPaddingControl('margin')}
      {renderMarginPaddingControl('padding')}
      {renderSizeControl()}
    </>
  );

  const renderShadowOptions = () => (
    <>
      {renderShadowEffects()}
    </>
  );

  return (
    <div className="vh-100" style={{ overflowY: 'auto', padding: '1rem' }}>
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
            <Accordion defaultActiveKey="0" flush>

              <Accordion.Item eventKey="1">
                <Accordion.Header>Content Editor</Accordion.Header>
                <Accordion.Body>
                  {renderTextOptions()}
                  <RichTextEditor initialHtml={content} onChange={updateContent} />
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>Shadow Effects</Accordion.Header>
                <Accordion.Body>{renderShadowOptions()}</Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3">
                <Accordion.Header>Layout (Margin & Padding)</Accordion.Header>
                <Accordion.Body>{renderLayoutOptions()}</Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="4">
                <Accordion.Header>Background</Accordion.Header>
                <Accordion.Body>{renderBackgroundOptions()}</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
