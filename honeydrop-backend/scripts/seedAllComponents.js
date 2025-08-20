// seedAll.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { seedHeadings } from './seedHeadings.js';
import { seedTextComponents } from './seedTextComponents.js';
import { seedImages } from './seedImageComponents.js';
import { seedCards } from './seedCardComponents.js';
import { seedForms } from './seedForms.js';
import { seedButtons } from './seedButtons.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const seedAll = async () => {
  try {
    // Connect once
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Run all seeds sequentially
    await seedHeadings();
    await seedTextComponents();
    await seedImages();
    await seedCards();
    await seedForms();
    await seedButtons();

    console.log('🎉 All components seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding all components:', err);
    process.exit(1);
  }
};

seedAll();
