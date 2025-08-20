import ComponentLibrary from '../src/models/ComponentLibrary.js';
import { v4 as uuidv4 } from 'uuid';

const baseStyles = {
  paddingTop: '16px',
  paddingRight: '16px',
  paddingBottom: '16px',
  paddingLeft: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '6px',
  boxShadowOffsetX: '0px',
  boxShadowOffsetY: '2px',
  boxShadowBlur: '8px',
  boxShadowSpread: '0px',
  boxShadowColor: '#0000000d',
  boxShadow: '0px 2px 8px 0px #0000000d',
  width: '400px',
  color: '#000000',
  marginTop: '16px',
  marginRight: 'auto',
  marginBottom: '16px',
  marginLeft: 'auto',
  fontFamily: 'Arial, sans-serif',
  display: 'flex',
  flexDirection: 'column',
};

const forms = [
  {
    category: 'Forms',
    type: 'form-contact',
    label: 'Contact Form',
    defaults: {
      tag: 'form',
      styles: { ...baseStyles },
      contentBlocks: [
        {
          id: uuidv4(),
          type: 'label',
          tag: 'label',
          innerHtml: 'Name:',
          styles: {},
          contentBlocks: [
            {
              id: uuidv4(),
              type: 'input',
              tag: 'input',
              inputType: 'text',
              name: 'name',
              styles: { width: '100%', padding: '8px', marginTop: '4px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc' },
            },
          ],
        },
        {
          id: uuidv4(),
          type: 'label',
          tag: 'label',
          innerHtml: 'Email:',
          styles: {},
          contentBlocks: [
            {
              id: uuidv4(),
              type: 'input',
              tag: 'input',
              inputType: 'email',
              name: 'email',
              styles: { width: '100%', padding: '8px', marginTop: '4px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc' },
            },
          ],
        },
        {
          id: uuidv4(),
          type: 'label',
          tag: 'label',
          innerHtml: 'Message:',
          styles: {},
          contentBlocks: [
            {
              id: uuidv4(),
              type: 'textarea',
              tag: 'textarea',
              name: 'message',
              rows: 4,
              styles: { width: '100%', padding: '8px', marginTop: '4px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc' },
            },
          ],
        },
        {
          id: uuidv4(),
          type: 'button',
          tag: 'button',
          innerHtml: 'Send',
          buttonType: 'submit',
          styles: { padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        },
      ],
    },
  },
  {
    category: 'Forms',
    type: 'form-login',
    label: 'Login Form',
    defaults: {
      tag: 'form',
      styles: { ...baseStyles },
      contentBlocks: [
        {
          id: uuidv4(),
          type: 'label',
          tag: 'label',
          innerHtml: 'Username:',
          styles: {},
          contentBlocks: [
            {
              id: uuidv4(),
              type: 'input',
              tag: 'input',
              inputType: 'text',
              name: 'username',
              styles: { width: '100%', padding: '8px', marginTop: '4px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc' },
            },
          ],
        },
        {
          id: uuidv4(),
          type: 'label',
          tag: 'label',
          innerHtml: 'Password:',
          styles: {},
          contentBlocks: [
            {
              id: uuidv4(),
              type: 'input',
              tag: 'input',
              inputType: 'password',
              name: 'password',
              styles: { width: '100%', padding: '8px', marginTop: '4px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc' },
            },
          ],
        },
        {
          id: uuidv4(),
          type: 'button',
          tag: 'button',
          innerHtml: 'Log In',
          buttonType: 'submit',
          styles: { padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        },
      ],
    },
  },
  {
    category: 'Forms',
    type: 'form-newsletter',
    label: 'Newsletter Signup',
    defaults: {
      tag: 'form',
      styles: { ...baseStyles },
      contentBlocks: [
        {
          id: uuidv4(),
          type: 'label',
          tag: 'label',
          innerHtml: 'Email:',
          styles: {},
          contentBlocks: [
            {
              id: uuidv4(),
              type: 'input',
              tag: 'input',
              inputType: 'email',
              name: 'email',
              styles: { width: '70%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flexDirection: 'row' },
            },
            {
              id: uuidv4(),
              type: 'button',
              tag: 'button',
              innerHtml: 'Subscribe',
              buttonType: 'submit',
              styles: { padding: '10px 16px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '8px' },
            },
          ],
        },
      ],
    },
  },
  {
    category: 'Forms',
    type: 'form-search',
    label: 'Search Form',
    defaults: {
      tag: 'form',
      styles: { ...baseStyles },
      contentBlocks: [
        {
          id: uuidv4(),
          type: 'input',
          tag: 'input',
          inputType: 'search',
          name: 'q',
          placeholder: 'Search...',
          styles: { width: '80%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '8px', flexDirection: 'row' },
        },
        {
          id: uuidv4(),
          type: 'button',
          tag: 'button',
          innerHtml: 'Go',
          buttonType: 'submit',
          styles: { padding: '10px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        },
      ],
    },
  },
  {
    category: 'Forms',
    type: 'form-feedback',
    label: 'Feedback Form',
    defaults: {
      tag: 'form',
      styles: { ...baseStyles },
      contentBlocks: [
        {
          id: uuidv4(),
          type: 'label',
          tag: 'label',
          innerHtml: 'Feedback:',
          styles: {},
          contentBlocks: [
            {
              id: uuidv4(),
              type: 'textarea',
              tag: 'textarea',
              name: 'feedback',
              rows: 5,
              styles: { width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' },
            },
          ],
        },
        {
          id: uuidv4(),
          type: 'button',
          tag: 'button',
          innerHtml: 'Submit',
          buttonType: 'submit',
          styles: { padding: '12px 24px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' },
        },
      ],
    },
  },
];

export const seedForms = async () => {
  await ComponentLibrary.deleteMany({ type: { $in: forms.map((f) => f.type) } });
  await ComponentLibrary.insertMany(forms);
  console.log('✅ Forms seeded successfully');
};
