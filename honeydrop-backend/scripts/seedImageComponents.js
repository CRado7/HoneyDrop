// seedImages.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ComponentLibrary from '../src/models/ComponentLibrary.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const baseImageStyles = {
  width: '100%',
  height: 'auto',
  borderRadius: '0px',
  objectFit: 'cover',
  aspectRatio: '16/9', // default
};

const inspectorFields = [
  {
    key: 'src',
    label: 'Image URL',
    type: 'text',
  },
  {
    key: 'alt',
    label: 'Alt Text',
    type: 'text',
  },
  {
    key: 'styles.aspectRatio',
    label: 'Aspect Ratio',
    type: 'select',
    options: ['1/1', '4/3', '16/9', '21/9', 'auto'],
  },
  {
    key: 'styles.borderRadius',
    label: 'Border Radius',
    type: 'slider',
    config: {
      min: 0,
      max: 50,
      step: 1,
      units: ['px', '%'],
      defaultUnit: 'px',
      defaultValue: 0,
    },
  },
  {
    key: 'styles.objectFit',
    label: 'Object Fit',
    type: 'select',
    options: ['cover', 'contain', 'fill', 'none'],
  },
  {
    key: 'styles.width',
    label: 'Width',
    type: 'slider',
    config: {
      min: 10,
      max: 100,
      step: 1,
      units: ['%', 'px'],
      defaultUnit: '%',
      defaultValue: 100,
    },
  },
    
];

const imageComponent = {
  category: 'Media',
  type: 'image',
  label: 'Image',
  defaults: {
    src: 'https://via.placeholder.com/600x400',
    alt: 'Placeholder image',
    styles: baseImageStyles,
  },
  inspectorFields,
};

const seedImages = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    await ComponentLibrary.deleteMany({ type: 'image' });
    await ComponentLibrary.create(imageComponent);
    console.log('✅ Image component seeded');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed image component:', error);
    process.exit(1);
  }
};

seedImages();
