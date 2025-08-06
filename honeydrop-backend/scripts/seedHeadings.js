import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ComponentLibrary from '../src/models/ComponentLibrary.js';

dotenv.config();

// Replace with your actual MongoDB URI
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
              marginBottom: '1rem',
              color: '#000000', // default black color
              fontFamily: 'Arial, sans-serif', // default font
            },
          },
          inspectorFields: [
            { 
              key: 'text', 
              label: 'Text', 
              type: 'text' 
            },
            {
              key: 'styles.fontSize',
              label: 'Font Size',
              type: 'slider', // your frontend should handle this custom type
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
              options: [
                'Arial, sans-serif',
                'Helvetica, sans-serif',
                '"Times New Roman", serif',
                'Georgia, serif',
                'Courier New, monospace',
                'Verdana, sans-serif',
                'Tahoma, sans-serif',
                '"Lucida Console", monospace',
              ],
            },
            {
              key: 'styles.marginBottom',
              label: 'Bottom Margin',
              type: 'slider',
              config: {
                min: 0,
                max: 100,
                step: 1,
                units: ['px', '%'],
                defaultUnit: 'px',
                defaultValue: 16,
              },
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
