// seedHeadings.js
import { v4 as uuidv4 } from 'uuid';
import ComponentLibrary from '../src/models/ComponentLibrary.js';

const baseStyles = {
  fontWeight: 'bold',
  color: '#000000',
  fontFamily: 'Arial, sans-serif',
  marginTop: '16px',
  marginRight: '0px',
  marginBottom: '16px',
  marginLeft: '0px',
  paddingTop: '0px',
  paddingRight: '0px',
  paddingBottom: '0px',
  paddingLeft: '0px',
};

export const seedHeadings = async () => {
  // Clear existing heading components
  await ComponentLibrary.deleteMany({ category: 'Headings' });

  const headingComponents = Array.from({ length: 6 }, (_, i) => {
    const level = i + 1;
    const tag = `h${level}`;

    return {
      category: 'Headings',
      type: `heading-${level}`,
      label: `Heading ${level}`,
      defaults: {
        tag: 'div', // wrapper container for editable contentBlocks
        styles: {}, // optional container styles
        contentBlocks: [
          {
            id: uuidv4(),
            type: 'heading',
            tag,
            innerHtml: `Heading ${level}`,
            styles: {
              ...baseStyles,
              fontSize: `${36 - level * 4}px`, // decrease size with heading level
            },
          },
        ],
      },
    };
  });

  await ComponentLibrary.insertMany(headingComponents);
  console.log('✅ Heading components seeded successfully');
};
