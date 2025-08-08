import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ComponentLibrary from '../src/models/ComponentLibrary.js';
import systemFonts from '../src/data/systemFonts.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const baseDefaults = {
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
};

const inspectorFields = [
  {
    key: 'text',
    label: 'Text',
    type: 'text',
  },
  {
    key: 'styles.fontSize',
    label: 'Font Size',
    type: 'slider',
    config: {
      min: 10,
      max: 48,
      step: 1,
      units: ['px', '%'],
      defaultUnit: 'px',
      defaultValue: 16,
    },
  },
  {
    key: 'styles.fontWeight',
    label: 'Font Weight',
    type: 'select',
    options: ['normal', 'bold', 'lighter'],
  },
  {
    key: 'styles.color',
    label: 'Color',
    type: 'color',
  },
  {
    key: 'styles.fontFamily',
    label: 'Font Family',
    type: 'select',
    options: systemFonts,
  },
  {
    key: 'styles.lineHeight',
    label: 'Line Height',
    type: 'slider',
    config: {
      min: 1,
      max: 3,
      step: 1,
      defaultValue: 1.6,
    },
  },
  {
    key: 'styles.letterSpacing',
    label: 'Letter Spacing',
    type: 'slider',
    config: {
      min: -2,
      max: 10,
      step: 1,
      units: ['px'],
      defaultUnit: 'px',
      defaultValue: 0,
    },
  },
];

const seedTextComponents = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Remove any existing components for these types
    const typesToDelete = ['paragraph', 'span', 'blockquote', 'preformatted'];
    await ComponentLibrary.deleteMany({ type: { $in: typesToDelete } });

    const components = [
      {
        category: 'Text',
        type: 'paragraph',
        label: 'Paragraph',
        defaults: {
          text: 'This is a paragraph. You can edit this text.',
          tag: 'p',
          styles: { ...baseDefaults },
        },
        inspectorFields,
      },
      {
        category: 'Text',
        type: 'span',
        label: 'Span',
        defaults: {
          text: 'This is inline span text.',
          tag: 'span',
          styles: { ...baseDefaults },
        },
        inspectorFields,
      },
      {
        category: 'Text',
        type: 'blockquote',
        label: 'Blockquote',
        defaults: {
          text: '“This is a quote. Customize it as you like.”',
          tag: 'blockquote',
          styles: {
            ...baseDefaults,
            fontStyle: 'italic',
            borderLeft: '4px solid #ccc',
            paddingLeft: '16px',
          },
        },
        inspectorFields: [
          ...inspectorFields,
          {
            key: 'styles.fontStyle',
            label: 'Font Style',
            type: 'select',
            options: ['normal', 'italic'],
          },
          {
            key: 'styles.borderLeft',
            label: 'Left Border',
            type: 'text',
          },
        ],
      },
      {
        category: 'Text',
        type: 'preformatted',
        label: 'Preformatted',
        defaults: {
          text: 'Preformatted\n  Indented\n    Spacing preserved.',
          tag: 'pre',
          styles: {
            ...baseDefaults,
            fontFamily: '"Courier New", monospace',
            backgroundColor: '#f5f5f5',
            padding: '16px',
            overflowX: 'auto',
          },
        },
        inspectorFields: [
          ...inspectorFields,
          {
            key: 'styles.backgroundColor',
            label: 'Background',
            type: 'color',
          },
        ],
      },
    ];

    await ComponentLibrary.insertMany(components);
    console.log('✅ Text components seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding text components:', error);
    process.exit(1);
  }
};

seedTextComponents();
