import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ComponentLibrary from '../src/models/ComponentLibrary.js';
import systemFonts from '../src/data/systemFonts.js';

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
      const tag = `h${level}`;
      const content = `<${tag}>Heading ${level}</${tag}>`;

      return {
        category: 'Headings',
        type: `heading-${level}`,
        label: `Heading ${level}`,
        defaults: {
          content,  // universal content field with HTML string
          tag,
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
