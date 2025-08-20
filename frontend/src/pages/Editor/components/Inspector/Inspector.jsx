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

const DEVICE_TYPES = ['desktop', 'tablet', 'mobile'];

// --- Helper to flatten nested blocks ---
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
  
  // 🔹 Fix: handle updating nested sub-blocks
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

  // Flatten blocks whenever the component changes
  useEffect(() => {
    if (component?.defaults?.contentBlocks?.length) {
      const flat = flattenBlocks(component.defaults.contentBlocks);
      setFlattenedBlocks(flat);
  
      // Only show the selected sub-block in inspector
      if (selectedSubBlock) {
        const foundBlock = flat.find(b => b.id === selectedSubBlock.id);
        setCurrentBlock(foundBlock || null);
        setOpenSection(foundBlock?.type === "text" || foundBlock?.type === "heading" ? "text" : null);
      } else {
        // No sub-block selected: only show parent styles, do not select first child
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
  if (!currentBlock) return <p>No content blocks available</p>;

  const mergedStyles = { ...GLOBAL_DEFAULT_STYLES, ...currentBlock.styles };

  const updateStyle = (key, value) => {
    const updatedBlock = { ...currentBlock, styles: { ...mergedStyles, [key]: value } };
    handleUpdateSubBlock(updatedBlock);
  };

  const updateContent = (newContent) => {
    const updatedBlock = { ...currentBlock, text: newContent };
    handleUpdateSubBlock(updatedBlock);
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
                    component={currentBlock}
                    GLOBAL_DEFAULT_STYLES={GLOBAL_DEFAULT_STYLES}
                    onUpdateBodyStyles={(k, v) => updateStyle(k, v)}
                  />
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="text">
                <Accordion.Header>Content Editor</Accordion.Header>
                <Accordion.Body>
                 {selectedElement?.defaults?.contentBlocks?.length > 1 && (
                    <div className="my-3">
                      <label htmlFor="block-selector" className="form-label">Select Block</label>
                      <select
                        id="block-selector"
                        className="form-select"
                        value={currentBlock?.id || ''}
                        onChange={(e) => {
                          const selected = selectedElement.defaults.contentBlocks.find(
                            b => b.id === e.target.value
                          );
                          setCurrentBlock(selected);
                        }}
                      >
                        {selectedElement.defaults.contentBlocks.map(block => (
                          <option key={block.id} value={block.id}>
                            {block.type} ({block.tag})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {currentBlock && (
                    <TextOptions
                      selectedBlock={currentBlock}
                      updateStyle={(key, value) => {
                        const updatedBlock = { ...currentBlock, styles: { ...currentBlock.styles, [key]: value } };
                        setCurrentBlock(updatedBlock);
                        handleUpdateSubBlock(updatedBlock);
                      }}
                      parseValueUnit={parseValueUnit}
                      onChange={(newHtml) => {
                        const updatedBlock = { ...currentBlock, innerHtml: newHtml };
                        setCurrentBlock(updatedBlock);
                        handleUpdateSubBlock(updatedBlock);
                      }}
                    />
                  )}
                  </Accordion.Body>
                </Accordion.Item>
              
              {currentBlock.type === 'image' && (
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
