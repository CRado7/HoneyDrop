import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ComponentLibrary from '../src/models/ComponentLibrary.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const baseFormStyles = {
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
  width: '400px',
  color: '#000000',
  marginTop: '16px',
  marginRight: 'auto',
  marginBottom: '16px',
  marginLeft: 'auto',
  fontFamily: 'Arial, sans-serif',
};

const forms = [
  {
    category: 'Forms',
    type: 'form-contact',
    label: 'Contact Form',
    defaults: {
      tag: 'form',
      styles: { ...baseFormStyles },
      content: `
        <label>Name:<br /><input type="text" name="name" style="width: 100%; padding: 8px; margin-top: 4px; margin-bottom: 12px; border-radius: 4px; border: 1px solid #ccc;" /></label>
        <label>Email:<br /><input type="email" name="email" style="width: 100%; padding: 8px; margin-top: 4px; margin-bottom: 12px; border-radius: 4px; border: 1px solid #ccc;" /></label>
        <label>Message:<br /><textarea name="message" rows="4" style="width: 100%; padding: 8px; margin-top: 4px; margin-bottom: 12px; border-radius: 4px; border: 1px solid #ccc;"></textarea></label>
        <button type="submit" style="padding: 12px 24px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Send</button>
      `,
    },
  },
  {
    category: 'Forms',
    type: 'form-login',
    label: 'Login Form',
    defaults: {
      tag: 'form',
      styles: { ...baseFormStyles },
      content: `
        <label>Username:<br /><input type="text" name="username" style="width: 100%; padding: 8px; margin-top: 4px; margin-bottom: 12px; border-radius: 4px; border: 1px solid #ccc;" /></label>
        <label>Password:<br /><input type="password" name="password" style="width: 100%; padding: 8px; margin-top: 4px; margin-bottom: 12px; border-radius: 4px; border: 1px solid #ccc;" /></label>
        <button type="submit" style="padding: 12px 24px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Log In</button>
      `,
    },
  },
  {
    category: 'Forms',
    type: 'form-newsletter',
    label: 'Newsletter Signup',
    defaults: {
      tag: 'form',
      styles: { ...baseFormStyles },
      content: `
        <label>Email:<br /><input type="email" name="email" style="width: 70%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;" />
        <button type="submit" style="padding: 10px 16px; background-color: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer;">Subscribe</button></label>
      `,
    },
  },
  {
    category: 'Forms',
    type: 'form-search',
    label: 'Search Form',
    defaults: {
      tag: 'form',
      styles: { ...baseFormStyles },
      content: `
        <input type="search" name="q" placeholder="Search..." style="width: 80%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;" />
        <button type="submit" style="padding: 10px 16px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Go</button>
      `,
    },
  },
  {
    category: 'Forms',
    type: 'form-feedback',
    label: 'Feedback Form',
    defaults: {
      tag: 'form',
      styles: { ...baseFormStyles },
      content: `
        <label>Feedback:<br /><textarea name="feedback" rows="5" style="width: 100%; padding: 8px; margin-top: 4px; border-radius: 4px; border: 1px solid #ccc;"></textarea></label>
        <button type="submit" style="padding: 12px 24px; background-color: #ffc107; color: black; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
      `,
    },
  },
];

const seedForms = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await ComponentLibrary.deleteMany({ type: { $in: forms.map((f) => f.type) } });
    await ComponentLibrary.insertMany(forms);

    console.log('✅ Forms seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed forms:', error);
    process.exit(1);
  }
};

seedForms();
