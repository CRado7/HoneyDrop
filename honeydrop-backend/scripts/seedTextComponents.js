// seedTextComponents.js
import { v4 as uuidv4 } from 'uuid';
import ComponentLibrary from '../src/models/ComponentLibrary.js';

const baseStyles = {
  fontSize: '16px',
  fontWeight: 'normal',
  color: '#000000',
  fontFamily: 'Arial, sans-serif',
  lineHeight: '1.6',
  letterSpacing: '0px',
  marginTop: '16px',
  marginRight: '0px',
  marginBottom: '16px',
  marginLeft: '0px',
  paddingTop: '0px',
  paddingRight: '0px',
  paddingBottom: '0px',
  paddingLeft: '0px',
};

export const seedTextComponents = async () => {
  // Clear existing text components
  const typesToDelete = ['paragraph', 'span', 'blockquote', 'preformatted'];
  await ComponentLibrary.deleteMany({ type: { $in: typesToDelete } });

  const components = [
    {
      category: 'Text',
      type: 'paragraph',
      label: 'Paragraph',
      defaults: {
        tag: 'div',
        styles: {},
        contentBlocks: [
          {
            id: uuidv4(),
            type: 'text',
            tag: 'p',
            innerHtml: 'This is a paragraph. You can edit this text.',
            styles: { ...baseStyles },
          },
        ],
      },
    },
    {
      category: 'Text',
      type: 'span',
      label: 'Span',
      defaults: {
        tag: 'div',
        styles: {},
        contentBlocks: [
          {
            id: uuidv4(),
            type: 'text',
            tag: 'span',
            innerHtml: 'This is inline span text.',
            styles: { ...baseStyles },
          },
        ],
      },
    },
    {
      category: 'Text',
      type: 'blockquote',
      label: 'Blockquote',
      defaults: {
        tag: 'div',
        styles: {},
        contentBlocks: [
          {
            id: uuidv4(),
            type: 'text',
            tag: 'blockquote',
            innerHtml: '“This is a quote. Customize it as you like.”',
            styles: {
              ...baseStyles,
              fontStyle: 'italic',
              borderLeft: '4px solid #ccc',
              paddingLeft: '16px',
            },
          },
        ],
      },
    },
    {
      category: 'Text',
      type: 'preformatted',
      label: 'Preformatted',
      defaults: {
        tag: 'div',
        styles: {},
        contentBlocks: [
          {
            id: uuidv4(),
            type: 'text',
            tag: 'pre',
            innerHtml: `Preformatted
  Indented
    Spacing preserved.`,
            styles: {
              ...baseStyles,
              fontFamily: '"Courier New", monospace',
              backgroundColor: '#f5f5f5',
              padding: '16px',
              overflowX: 'auto',
            },
          },
        ],
      },
    },
  ];

  await ComponentLibrary.insertMany(components);
  console.log('✅ Text components seeded successfully');
};
