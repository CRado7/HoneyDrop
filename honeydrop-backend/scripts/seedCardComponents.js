// seedCards.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ComponentLibrary from '../src/models/ComponentLibrary.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const cardBaseStyles = {
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  width: '100%',
  height: 'auto',
};

const inspectorFields = [
  {
    key: 'title',
    label: 'Title',
    type: 'text',
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
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
  {
    key: 'styles.backgroundColor',
    label: 'Background Color',
    type: 'color',
  },
  {
    key: 'styles.borderRadius',
    label: 'Border Radius',
    type: 'slider',
    config: {
      min: 0,
      max: 48,
      step: 1,
      units: ['px'],
      defaultUnit: 'px',
    },
  },
  {
    key: 'styles.boxShadow',
    label: 'Box Shadow',
    type: 'text',
  },
];

const cards = [
  {
    type: 'pricing-card',
    label: 'Pricing Card',
    category: 'Cards',
    defaults: {
      title: 'Pro Plan',
      description: '$29/month with all features.',
      styles: cardBaseStyles,
    },
    inspectorFields,
  },
  {
    type: 'feature-card',
    label: 'Feature Card',
    category: 'Cards',
    defaults: {
      title: 'Speed Optimization',
      description: 'Your website loads blazing fast with our CDN-powered delivery.',
      styles: cardBaseStyles,
    },
    inspectorFields,
  },
  {
    type: 'icon-card',
    label: 'Icon Card',
    category: 'Cards',
    defaults: {
      title: 'Secure',
      description: 'Top-notch encryption and data protection.',
      icon: 'lock', // Optional, you can add icon sets later
      styles: cardBaseStyles,
    },
    inspectorFields: [
      ...inspectorFields,
      {
        key: 'icon',
        label: 'Icon Name',
        type: 'text',
      },
    ],
  },
];

const seedCards = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    await ComponentLibrary.deleteMany({ type: { $in: ['pricing-card', 'feature-card', 'icon-card'] } });
    await ComponentLibrary.insertMany(cards);
    console.log('✅ Cards seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed cards:', error);
    process.exit(1);
  }
};

seedCards();