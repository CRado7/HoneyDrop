import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ComponentLibrary from '../src/models/ComponentLibrary.js';
import systemFonts from '../src/data/systemFonts.js'

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedHeadings = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing heading components
    await ComponentLibrary.deleteMany({ category: 'Headings' });

    const headingComponents = Array.from({ length: 6 }, (_, i) => {
      const level = i + 1;
      return {
        category: 'Headings',
        type: `heading-${level}`,
        label: `Heading ${level}`,
        defaults: {
          text: `Heading ${level}`,
          tag: `h${level}`,
          styles: {
            fontSize: `${36 - level * 4}px`,
            fontWeight: 'bold',
            color: '#000000',
            fontFamily: 'Arial, sans-serif',
            marginTop: '0px',
            marginRight: '0px',
            marginBottom: '16px',
            marginLeft: '0px',
            paddingTop: '0px',
            paddingRight: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
          },
        },
        inspectorFields: [
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
              max: 72,
              step: 1,
              units: ['px', '%'],
              defaultUnit: 'px',
              defaultValue: 24,
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
        ],
      };
    });

    await ComponentLibrary.insertMany(headingComponents);
    console.log('✅ Heading components seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding heading components:', error);
    process.exit(1);
  }
};

seedHeadings();
