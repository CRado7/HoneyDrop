// seedCards.js
import { v4 as uuidv4 } from 'uuid';
import ComponentLibrary from '../src/models/ComponentLibrary.js';

const baseStyles = {
  paddingTop: '16px',
  paddingRight: '16px',
  paddingBottom: '16px',
  paddingLeft: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0px 2px 8px 0px #0000000d',
  boxShadowColor: '#0000000d',
  width: '400px',
  height: 'auto',
  color: '#000000',
  marginTop: '16px',
  marginRight: 'auto',
  marginBottom: '16px',
  marginLeft: 'auto',
  fontFamily: 'Arial, sans-serif',
};

const cards = [
  {
    category: 'Cards',
    type: 'card-basic',
    label: 'Basic Card',
    defaults: {
      tag: 'div',
      styles: { ...baseStyles },
      contentBlocks: [
        { id: uuidv4(), type: 'heading', tag: 'h3', text: 'Card Title', styles: {} },
        { id: uuidv4(), type: 'text', tag: 'p', innerHtml: 'This is a basic card with content inside.', styles: {} },
      ],
    },
  },
  {
    category: 'Cards',
    type: 'card-image',
    label: 'Card with Image',
    defaults: {
      tag: 'div',
      styles: { ...baseStyles },
      contentBlocks: [
        { id: uuidv4(), type: 'image', tag: 'img', src: 'https://placehold.co/600x200', alt: 'Card image', styles: { width: '100%', height: 'auto', borderRadius: '4px 4px 0 0' } },
        { id: uuidv4(), type: 'div', tag: 'div', innerHtml: 'Card content container', styles: { padding: '12px' }, contentBlocks: [
          { id: uuidv4(), type: 'heading', tag: 'h4', innerHtml: 'Card Title', styles: {} },
          { id: uuidv4(), type: 'text', tag: 'p', innerHtml: 'This card includes an image at the top.', styles: {} },
        ]},
      ],
    },
  },
  {
    category: 'Cards',
    type: 'card-structured',
    label: 'Card with Header, Body & Footer',
    defaults: {
      tag: 'div',
      styles: { ...baseStyles },
      contentBlocks: [
        { id: uuidv4(), type: 'div', tag: 'div', innerHtml: 'Header', styles: { borderBottom: '1px solid #ddd', paddingBottom: '8px', fontWeight: 'bold' } },
        { id: uuidv4(), type: 'text', tag: 'div', innerHtml: 'This is the body content of the card.', styles: { padding: '12px 0' } },
        { id: uuidv4(), type: 'div', tag: 'div', innerHtml: 'Footer', styles: { borderTop: '1px solid #ddd', paddingTop: '8px', textAlign: 'right', fontStyle: 'italic' } },
      ],
    },
  },
  {
    category: 'Cards',
    type: 'card-profile',
    label: 'Profile Card',
    defaults: {
      tag: 'div',
      styles: { ...baseStyles, textAlign: 'center' },
      contentBlocks: [
        { id: uuidv4(), type: 'image', tag: 'img', src: 'https://placehold.co/100x100', alt: 'Avatar', styles: { borderRadius: '50%', width: '100px', height: '100px', marginBottom: '12px' } },
        { id: uuidv4(), type: 'heading', tag: 'h4', innerHtml: 'Jane Doe', styles: {} },
        { id: uuidv4(), type: 'text', tag: 'p', innerHtml: 'Frontend Developer', styles: {} },
      ],
    },
  },
];

export const seedCards = async () => {
  await ComponentLibrary.deleteMany({ type: { $in: cards.map((c) => c.type) } });
  await ComponentLibrary.insertMany(cards);
  console.log('✅ Cards seeded successfully');
};
