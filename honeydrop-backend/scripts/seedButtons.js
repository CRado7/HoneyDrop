import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ComponentLibrary from '../src/models/ComponentLibrary.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const baseButtonStyles = {
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
  color: '#fff',
};

const buttons = [
  {
    category: 'Buttons',
    type: 'btn-primary',
    label: 'Primary Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseButtonStyles,
        backgroundColor: '#007bff',
        boxShadowOffsetX: '0px',
        boxShadowOffsetY: '4px',
        boxShadowBlur: '6px',
        boxShadowSpread: '0px',
        boxShadowColor: '#0056b3',
      },
      content: 'Primary',
    },
  },
  {
    category: 'Buttons',
    type: 'btn-secondary',
    label: 'Secondary Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseButtonStyles,
        backgroundColor: '#6c757d',
        boxShadowOffsetX: '0px',
        boxShadowOffsetY: '4px',
        boxShadowBlur: '6px',
        boxShadowSpread: '0px',
        boxShadowColor: '#545b62',
      },
      content: 'Secondary',
    },
  },
  {
    category: 'Buttons',
    type: 'btn-success',
    label: 'Success Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseButtonStyles,
        backgroundColor: '#28a745',
        boxShadowOffsetX: '0px',
        boxShadowOffsetY: '4px',
        boxShadowBlur: '6px',
        boxShadowSpread: '0px',
        boxShadowColor: '#1e7e34',
      },
      content: 'Success',
    },
  },
  {
    category: 'Buttons',
    type: 'btn-danger',
    label: 'Danger Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseButtonStyles,
        backgroundColor: '#dc3545',
        boxShadowOffsetX: '0px',
        boxShadowOffsetY: '4px',
        boxShadowBlur: '6px',
        boxShadowSpread: '0px',
        boxShadowColor: '#bd2130',
      },
      content: 'Danger',
    },
  },
  {
    category: 'Buttons',
    type: 'btn-warning',
    label: 'Warning Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseButtonStyles,
        backgroundColor: '#ffc107',
        color: '#212529',
        boxShadowOffsetX: '0px',
        boxShadowOffsetY: '4px',
        boxShadowBlur: '6px',
        boxShadowSpread: '0px',
        boxShadowColor: '#d39e00',
      },
      content: 'Warning',
    },
  },
  {
    category: 'Buttons',
    type: 'btn-outline-primary',
    label: 'Outline Primary Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseButtonStyles,
        backgroundColor: 'transparent',
        color: '#007bff',
        border: '2px solid #007bff',
        boxShadowOffsetX: '0px',
        boxShadowOffsetY: '0px',
        boxShadowBlur: '0px',
        boxShadowSpread: '0px',
        boxShadowColor: 'transparent',
      },
      content: 'Outline Primary',
    },
  },
  {
    category: 'Buttons',
    type: 'btn-link',
    label: 'Link Button',
    defaults: {
      tag: 'button',
      styles: {
        ...baseButtonStyles,
        backgroundColor: 'transparent',
        color: '#007bff',
        border: 'none',
        boxShadowOffsetX: '0px',
        boxShadowOffsetY: '0px',
        boxShadowBlur: '0px',
        boxShadowSpread: '0px',
        boxShadowColor: 'transparent',
        textDecoration: 'underline',
        paddingTop: '0px',
        paddingBottom: '0px',
      },
      content: 'Link',
    },
  },
];

const seedButtons = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await ComponentLibrary.deleteMany({ type: { $in: buttons.map((b) => b.type) } });
    await ComponentLibrary.insertMany(buttons);

    console.log('✅ Buttons seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed buttons:', error);
    process.exit(1);
  }
};

seedButtons();
