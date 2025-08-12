import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ComponentLibrary from '../src/models/ComponentLibrary.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

  const baseStyles = {
    paddingTop: '16px',
    paddingRight: '16px',
    paddingBottom: '16px',
    paddingLeft: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadowOffsetX: '0px',
    boxShadowOffsetY: '2px',
    boxShadowBlur: '8px',
    boxShadowSpread: '0px',
    boxShadowColor: '#0000000d', // rgba(0,0,0,0.05) hex approx
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
        content: '<h3>Card Title</h3><p>This is a basic card with content inside.</p>',
      },
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
