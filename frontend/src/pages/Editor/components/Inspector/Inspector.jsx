import React, { useState, useEffect } from 'react';
import { Accordion, Nav, Tab } from 'react-bootstrap';
import BodyStyles from './InspectorSections/bodyStyles';
import MarginPaddingControls from './InspectorSections/MarginPaddingControls';
import SizeControl from './InspectorSections/SizeControl';
import TextOptions from './InspectorSections/TextOptions';
import ShadowEffects from './InspectorSections/ShadowEffects';
import BorderOptions from './InspectorSections/BorderOptions';
import BackgroundOptions from './InspectorSections/BackgroundOptions';
import LayoutOptions from './InspectorSections/LayoutOptions';
import ImageOptions from './InspectorSections/ImageOptions';
import PositionOptions from './InspectorSections/PositionOptions';

const GLOBAL_DEFAULT_STYLES = { /* ...same as your previous definition... */ };
const DEVICE_TYPES = ['desktop', 'tablet', 'mobile'];

function flattenBlocks(blocks, parentPath = '') {
  return blocks.reduce((acc, block, index) => {
    const path = parentPath ? `${parentPath}.${index}` : `${index}`;
    acc.push({ ...block, path, label: (block.text ? `${block.text.slice(0, 20)}` : '') });
    if (block.contentBlocks && block.contentBlocks.length) {
      acc.push(...flattenBlocks(block.contentBlocks, path));
    }
    return acc;
  }, []);
}

const parseValueUnit = (raw) => {
  const match = /^(-?\d+(\.\d+)?)([a-z%]*)$/.exec(raw);
  if (!match) return [0, 'px'];
  return [parseFloat(match[1]), match[3] || 'px'];
};

export default function Inspector ({ component, selectedElement, onUpdate, selectedSubBlock }) {
  const [selectedDevice, setSelectedDevice] = useState('desktop');
  const [currentBlock, setCurrentBlock] = useState(null);
  const [flattenedBlocks, setFlattenedBlocks] = useState([]);
  const [openSection, setOpenSection] = useState(null);

  // Update a nested sub-block
  const handleUpdateSubBlock = (updatedBlock) => {
    const updateRecursively = (blocks) =>
      blocks.map(b =>
        b.id === updatedBlock.id
          ? updatedBlock
          : { ...b, contentBlocks: b.contentBlocks ? updateRecursively(b.contentBlocks) : [] }
      );

    const updatedBlocks = updateRecursively(component.defaults.contentBlocks);
    onUpdate('defaults.contentBlocks', updatedBlocks);
    setCurrentBlock(updatedBlock);
  };

  useEffect(() => {
    if (component?.defaults?.contentBlocks?.length) {
      const flat = flattenBlocks(component.defaults.contentBlocks);
      setFlattenedBlocks(flat);

      // 🔹 Key change: only select a child if explicitly passed
      if (selectedSubBlock) {
        const foundBlock = flat.find(b => b.id === selectedSubBlock.id);
        setCurrentBlock(foundBlock || null);
        setOpenSection(foundBlock?.type === "text" || foundBlock?.type === "heading" ? "text" : null);
      } else {
        // Parent component is selected: do not auto-select a child
        setCurrentBlock(null);
        setOpenSection(null);
      }
    } else {
      setFlattenedBlocks([]);
      setCurrentBlock(null);
      setOpenSection(null);
    }
  }, [component, selectedSubBlock]);

  if (!component) return <p>Select an element to edit its content</p>;

  // Show component-level styles if no block selected
  const mergedStyles = currentBlock
    ? { ...GLOBAL_DEFAULT_STYLES, ...currentBlock.styles }
    : { ...GLOBAL_DEFAULT_STYLES, ...component.defaults.styles };

  const updateStyle = (key, value) => {
    if (currentBlock) {
      const updatedBlock = { ...currentBlock, styles: { ...mergedStyles, [key]: value } };
      handleUpdateSubBlock(updatedBlock);
    } else {
      const updatedDefaults = {
        ...component.defaults,
        styles: { ...mergedStyles, [key]: value }
      };
      onUpdate('defaults', updatedDefaults);
    }
  };

  const updateContent = (newContent) => {
    if (currentBlock) {
      const updatedBlock = { ...currentBlock, text: newContent };
      handleUpdateSubBlock(updatedBlock);
    }
  };

  return (
    <div className="vh-100" style={{ overflowY: 'auto', padding: '1rem' }}>
      <h5>Inspector</h5>
      <p>
        Editing Component: <strong>{component.label || component.type}</strong>
      </p>

      <Tab.Container activeKey={selectedDevice} onSelect={setSelectedDevice}>
        <Nav variant="pills" className="mb-3">
          {DEVICE_TYPES.map(device => (
            <Nav.Item key={device}>
              <Nav.Link eventKey={device} className="text-capitalize">{device}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey={selectedDevice}>
            <Accordion activeKey={openSection} onSelect={(key) => setOpenSection(key)} flush>

              <Accordion.Item eventKey="body">
                <Accordion.Header>Body Styles</Accordion.Header>
                <Accordion.Body>
                  <BodyStyles
                    component={currentBlock || component.defaults}
                    GLOBAL_DEFAULT_STYLES={GLOBAL_DEFAULT_STYLES}
                    onUpdateBodyStyles={(k, v) => updateStyle(k, v)}
                  />
                </Accordion.Body>
              </Accordion.Item>

              {currentBlock && (currentBlock.type === 'text' || currentBlock.type === 'heading') && (
                <Accordion.Item eventKey="text">
                  <Accordion.Header>Content Editor</Accordion.Header>
                  <Accordion.Body>
                    <TextOptions
                      selectedBlock={currentBlock}
                      updateStyle={(k, v) => updateStyle(k, v)}
                      parseValueUnit={parseValueUnit}
                      onChange={(newHtml) => updateContent(newHtml)}
                    />
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {currentBlock?.type === 'image' && (
                <Accordion.Item eventKey="image">
                  <Accordion.Header>Image Options</Accordion.Header>
                  <Accordion.Body>
                    <ImageOptions component={currentBlock} mergedStyles={mergedStyles} updateStyle={updateStyle} />
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {/* Shared styling options */}
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

              <Accordion.Item eventKey="marginpadding">
                <Accordion.Header>Margin & Padding</Accordion.Header>
                <Accordion.Body>
                  <MarginPaddingControls type="margin" mergedStyles={mergedStyles} updateStyle={updateStyle} />
                  <MarginPaddingControls type="padding" mergedStyles={mergedStyles} updateStyle={updateStyle} />
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="position">
                <Accordion.Header>Position</Accordion.Header>
                <Accordion.Body>
                  <PositionOptions mergedStyles={mergedStyles} updateStyle={updateStyle} />
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
                  <BorderOptions mergedStyles={mergedStyles} updateStyle={updateStyle} parseValueUnit={parseValueUnit}/>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="background">
                <Accordion.Header>Background</Accordion.Header>
                <Accordion.Body>
                  <BackgroundOptions mergedStyles={mergedStyles} updateStyle={updateStyle} />
                </Accordion.Body>
              </Accordion.Item>

            </Accordion>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
