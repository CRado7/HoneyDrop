import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ComponentLibrary from '../src/models/ComponentLibrary.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const baseStyles = {
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    width: '400px',   // default fixed width in px
    height: 'auto',
    color: '#000000', // default black text
    fontFamily: 'Arial, sans-serif',
  };
  
  const cardInspectorFields = [
    {
      key: 'styles.width',
      label: 'Width',
      type: 'slider',
      config: {
        min: 100,
        max: 800,
        step: 1,
        units: ['px', '%'],
        defaultUnit: 'px',
        defaultValue: 400,
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
      key: 'styles.boxShadowOffsetX',
      label: 'Box Shadow Offset X',
      type: 'slider',
      config: { min: -20, max: 20, step: 1, units: ['px'], defaultUnit: 'px', defaultValue: 0 },
    },
    {
      key: 'styles.boxShadowOffsetY',
      label: 'Box Shadow Offset Y',
      type: 'slider',
      config: { min: -20, max: 20, step: 1, units: ['px'], defaultUnit: 'px', defaultValue: 2 },
    },
    {
      key: 'styles.boxShadowBlur',
      label: 'Box Shadow Blur',
      type: 'slider',
      config: { min: 0, max: 40, step: 1, units: ['px'], defaultUnit: 'px', defaultValue: 8 },
    },
    {
      key: 'styles.boxShadowSpread',
      label: 'Box Shadow Spread',
      type: 'slider',
      config: { min: 0, max: 20, step: 1, units: ['px'], defaultUnit: 'px', defaultValue: 0 },
    },
    {
      key: 'styles.boxShadowColor',
      label: 'Box Shadow Color',
      type: 'color',
      config: { defaultValue: 'rgba(0,0,0,0.05)' },
    },
  ];
  
  const cards = [
    {
      category: 'Cards',
      type: 'card-basic',
      label: 'Basic Card',
      defaults: {
        tag: 'div',
        styles: { ...baseStyles },
        content: '<h3>Card Title</h3><p>This is a basic card with content inside.</p>',
      },
      inspectorFields: cardInspectorFields,
    },
    {
      category: 'Cards',
      type: 'card-image',
      label: 'Card with Image',
      defaults: {
        tag: 'div',
        styles: { ...baseStyles },
        content: `
          <img src="https://placehold.co/600x200" alt="Card image" style="width: 100%; height: auto; border-radius: 4px 4px 0 0;" />
          <div style="padding: 12px;">
            <h4>Card Title</h4>
            <p>This card includes an image at the top.</p>
          </div>`,
      },
      inspectorFields: cardInspectorFields,
    },
    {
      category: 'Cards',
      type: 'card-structured',
      label: 'Card with Header, Body & Footer',
      defaults: {
        tag: 'div',
        styles: { ...baseStyles },
        content: `
          <div style="border-bottom: 1px solid #ddd; padding-bottom: 8px;"><strong>Header</strong></div>
          <div style="padding: 12px 0;">This is the body content of the card.</div>
          <div style="border-top: 1px solid #ddd; padding-top: 8px; text-align: right;"><em>Footer</em></div>`,
      },
      inspectorFields: cardInspectorFields,
    },
    {
      category: 'Cards',
      type: 'card-profile',
      label: 'Profile Card',
      defaults: {
        tag: 'div',
        styles: { ...baseStyles, textAlign: 'center' },
        content: `
          <img src="https://placehold.co/100x100" alt="Avatar" style="border-radius: 50%; width: 100px; height: 100px; margin-bottom: 12px;" />
          <h4>Jane Doe</h4>
          <p>Frontend Developer</p>`,
      },
      inspectorFields: cardInspectorFields,
    },
  ];  

const seedCards = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await ComponentLibrary.deleteMany({ type: { $in: cards.map((c) => c.type) } });
    await ComponentLibrary.insertMany(cards);

    console.log('✅ Cards seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed cards:', error);
    process.exit(1);
  }
};

seedCards();
