import React, { useState } from 'react';
import { Accordion, Nav, Tab } from 'react-bootstrap';
import BodyStyles from './InspectorSections/bodyStyles';
import MarginPaddingControls from './InspectorSections/MarginPaddingControls';
import SizeControl from './InspectorSections/SizeControl';
import TextOptions from './InspectorSections/TextOptions';
import RichTextEditor from './InspectorSections/RichTextEditor';
import ShadowEffects from './InspectorSections/ShadowEffects';
import BorderOptions from './InspectorSections/BorderOptions';
import BackgroundOptions from './InspectorSections/BackgroundOptions';
import LayoutOptions from './InspectorSections/LayoutOptions';
import ImageOptions from './InspectorSections/ImageOptions';

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

  borderWidth: '0px',
  borderStyle: 'none',
  borderColor: '#000000',
  borderRadius: '0px',
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

export default function Inspector({ component, onUpdate, bodyStyles, onUpdateBodyStyles, selectedItem = {} }) {
  const [selectedDevice, setSelectedDevice] = useState('desktop');

  if (!component) return <p>Select an element to edit its content</p>;

  const defaults = component.defaults || {};
  const mergedStyles = { ...GLOBAL_DEFAULT_STYLES, ...defaults.styles };
  const updateStyle = (keyOrNull, valueOrStyles) => {
    const updatedDefaults = { ...defaults };
    if (keyOrNull === null && typeof valueOrStyles === 'object') {
      updatedDefaults.styles = { ...valueOrStyles };
    } else {
      updatedDefaults.styles = { ...mergedStyles, [keyOrNull]: valueOrStyles };
    }
    onUpdate('defaults', updatedDefaults);
  };

  const parseValueUnit = (raw) => {
    const match = /^(-?\d+(\.\d+)?)([a-z%]*)$/.exec(raw);
    if (!match) return [0, 'px'];
    return [parseFloat(match[1]), match[3] || 'px'];
  };

  const contentKey = defaults.content !== undefined ? 'content' : 'text';
  const content = defaults[contentKey] ?? '';
  const updateContent = (newContent) => {
    const updatedDefaults = { ...defaults, [contentKey]: newContent };
    onUpdate('defaults', updatedDefaults);
  };
  
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

            <Accordion.Item eventKey="body">
              <Accordion.Header>Body Styles</Accordion.Header>
              <Accordion.Body>
              <BodyStyles
                component={component}
                GLOBAL_DEFAULT_STYLES={GLOBAL_DEFAULT_STYLES}
                onUpdateBodyStyles={onUpdateBodyStyles}
              />
              </Accordion.Body>
            </Accordion.Item>


            <Accordion.Item eventKey="text">
              <Accordion.Header>Content Editor</Accordion.Header>
              <Accordion.Body>
                <TextOptions mergedStyles={mergedStyles} updateStyle={updateStyle} parseValueUnit={parseValueUnit} />
                <RichTextEditor initialHtml={content} onChange={updateContent} imageSrc={selectedItem.imageUrl} />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="size">
              <Accordion.Header>Size</Accordion.Header>
              <Accordion.Body>
                <SizeControl mergedStyles={mergedStyles} updateStyle={updateStyle} />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="layout">
              <Accordion.Header>Layout Options</Accordion.Header>
              <Accordion.Body>
                <LayoutOptions mergedStyles={mergedStyles} updateStyle={updateStyle} />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Margin & Padding</Accordion.Header>
              <Accordion.Body>
                <MarginPaddingControls
                  type="margin"
                  mergedStyles={mergedStyles}
                  updateStyle={updateStyle}
                />
                <MarginPaddingControls
                  type="padding"
                  mergedStyles={mergedStyles}
                  updateStyle={updateStyle}
                />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="shadow">
              <Accordion.Header>Shadow Effects</Accordion.Header>
              <Accordion.Body>
                <ShadowEffects mergedStyles={mergedStyles} updateStyle={updateStyle} parseValueUnit={parseValueUnit} />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="border">
              <Accordion.Header>Border</Accordion.Header>
              <Accordion.Body>
                <BorderOptions mergedStyles={mergedStyles} updateStyle={updateStyle} parseValueUnit={parseValueUnit} />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="background">
              <Accordion.Header>Background</Accordion.Header>
              <Accordion.Body>
                <BackgroundOptions mergedStyles={mergedStyles} updateStyle={updateStyle} />
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="image">
              <Accordion.Header>Image Options</Accordion.Header>
              <Accordion.Body>
                <ImageOptions component={component} mergedStyles={mergedStyles} updateStyle={updateStyle} />
              </Accordion.Body>
            </Accordion.Item>

            </Accordion>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}