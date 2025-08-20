// seedImages.js
import { v4 as uuidv4 } from 'uuid';
import ComponentLibrary from '../src/models/ComponentLibrary.js';

const baseStyles = {
  width: '400px',
  height: 'auto',
  borderRadius: '0px',
  objectFit: 'cover',
  aspectRatio: '16/9',
  marginTop: '16px',
  marginRight: 'auto',
  marginBottom: '16px',
  boxShadow: '0px 2px 8px 0px #0000000d',
  marginLeft: 'auto',
};

const inspectorFields = [
  { key: 'src', label: 'Image URL', type: 'text' },
  { key: 'alt', label: 'Alt Text', type: 'text' },
  { key: 'styles.aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['1/1', '4/3', '16/9', '21/9', 'auto'] },
  { key: 'styles.borderRadius', label: 'Border Radius', type: 'slider', config: { min: 0, max: 50, step: 1, units: ['px', '%'], defaultUnit: 'px', defaultValue: 0 } },
  { key: 'styles.objectFit', label: 'Object Fit', type: 'select', options: ['cover', 'contain', 'fill', 'none'] },
  { key: 'styles.width', label: 'Width', type: 'slider', config: { min: 10, max: 100, step: 1, units: ['%', 'px'], defaultUnit: '%', defaultValue: 100 } },
];

const imageComponent = {
  category: 'Media',
  type: 'image',
  label: 'Image',
  defaults: {
    tag: 'div', // wrapper for editable contentBlocks
    styles: {}, // optional container styles
    contentBlocks: [
      {
        id: uuidv4(),
        type: 'image',
        tag: 'img',
        src: 'https://via.placeholder.com/600x400',
        alt: 'Placeholder image',
        styles: baseStyles,
      },
    ],
  },
  inspectorFields,
};

export const seedImages = async () => {
  // Clear existing image components
  await ComponentLibrary.deleteMany({ type: 'image' });
  await ComponentLibrary.create(imageComponent);
  console.log('✅ Image component seeded successfully');
};
