import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ComponentLibrary from '../src/models/ComponentLibrary.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const baseDefaults = {
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
          tag: 'p',
          content: `<p>This is a paragraph. You can edit this text.</p>`,
          styles: { ...baseDefaults },
        },
      },
      {
        category: 'Text',
        type: 'span',
        label: 'Span',
        defaults: {
          tag: 'span',
          content: `<span>This is inline span text.</span>`,
          styles: { ...baseDefaults },
        },
      },
      {
        category: 'Text',
        type: 'blockquote',
        label: 'Blockquote',
        defaults: {
          tag: 'blockquote',
          content: `<blockquote>“This is a quote. Customize it as you like.”</blockquote>`,
          styles: {
            ...baseDefaults,
            fontStyle: 'italic',
            borderLeft: '4px solid #ccc',
            paddingLeft: '16px',
          },
        },
      },
      {
        category: 'Text',
        type: 'preformatted',
        label: 'Preformatted',
        defaults: {
          tag: 'pre',
          content: `<pre>Preformatted
  Indented
    Spacing preserved.</pre>`,
          styles: {
            ...baseDefaults,
            fontFamily: '"Courier New", monospace',
            backgroundColor: '#f5f5f5',
            padding: '16px',
            overflowX: 'auto',
          },
        },
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
