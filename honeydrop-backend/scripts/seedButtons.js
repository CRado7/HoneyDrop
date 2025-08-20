import ComponentLibrary from '../src/models/ComponentLibrary.js';
import { v4 as uuidv4 } from 'uuid';

const baseStyles = {
  paddingTop: '12px',
  paddingRight: '24px',
  paddingBottom: '12px',
  paddingLeft: '24px',
  borderRadius: '4px',
  fontWeight: '600',
  fontSize: '16px',
  cursor: 'pointer',
  width: 'auto',
  height: 'auto',
  marginTop: '16px',
  marginRight: 'auto',
  marginBottom: '16px',
  marginLeft: 'auto',
  fontFamily: 'Arial, sans-serif',
  border: 'none',
  color: '#333',
  boxShadow: '0px 2px 8px 0px #0000000d',
  display: 'inline-block',
};

const buttons = [
  {
    category: 'Buttons',
    type: 'btn-primary',
    label: 'Primary Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseStyles,
        backgroundColor: '#007bff',
        boxShadowOffsetX: '0px',
        boxShadowOffsetY: '4px',
        boxShadowBlur: '6px',
        boxShadowSpread: '0px',
        boxShadowColor: '#0056b3',
      },
      contentBlocks: [
        { id: uuidv4(), type: 'text', tag: 'span', innerHtml: 'Primary', styles: {} },
      ],
    },
  },
  {
    category: 'Buttons',
    type: 'btn-secondary',
    label: 'Secondary Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseStyles,
        backgroundColor: '#6c757d',
        boxShadowColor: '#545b62',
      },
      contentBlocks: [
        { id: uuidv4(), type: 'text', tag: 'span', innerHtml: 'Secondary', styles: {} },
      ],
    },
  },
  {
    category: 'Buttons',
    type: 'btn-success',
    label: 'Success Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseStyles,
        backgroundColor: '#28a745',
        boxShadowColor: '#1e7e34',
      },
      contentBlocks: [
        { id: uuidv4(), type: 'text', tag: 'span', innerHtml: 'Success', styles: {} },
      ],
    },
  },
  {
    category: 'Buttons',
    type: 'btn-danger',
    label: 'Danger Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseStyles,
        backgroundColor: '#dc3545',
        boxShadowColor: '#bd2130',
      },
      contentBlocks: [
        { id: uuidv4(), type: 'text', tag: 'span', innerHtml: 'Danger', styles: {} },
      ],
    },
  },
  {
    category: 'Buttons',
    type: 'btn-warning',
    label: 'Warning Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseStyles,
        backgroundColor: '#ffc107',
        color: '#212529',
        boxShadowColor: '#d39e00',
      },
      contentBlocks: [
        { id: uuidv4(), type: 'text', tag: 'span', innerHtml: 'Warning', styles: {} },
      ],
    },
  },
  {
    category: 'Buttons',
    type: 'btn-outline-primary',
    label: 'Outline Primary Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: '#007bff',
        border: '2px solid #007bff',
        boxShadowColor: 'transparent',
      },
      contentBlocks: [
        { id: uuidv4(), type: 'text', tag: 'span', innerHtml: 'Outline Primary', styles: {} },
      ],
    },
  },
  {
    category: 'Buttons',
    type: 'btn-link',
    label: 'Link Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: '#007bff',
        border: 'none',
        textDecoration: 'underline',
        paddingTop: '0px',
        paddingBottom: '0px',
        boxShadowColor: 'transparent',
      },
      contentBlocks: [
        { id: uuidv4(), type: 'text', tag: 'span', innerHtml: 'Link', styles: {} },
      ],
    },
  },
];


export const seedButtons = async () => {
  await ComponentLibrary.deleteMany({ type: { $in: buttons.map((b) => b.type) } });
  await ComponentLibrary.insertMany(buttons);
  console.log('✅ Buttons seeded successfully');
};
