// scripts/seedPlanPackages.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PlanPackage from '../src/models/PlanPackage.js'; // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/honeydrop';

const planPackages = [
  {
    name: 'Free',
    description: 'For simple personal sites.',
    pricePerMonth: 0,
    maxWebsites: 1,
    siteTypesAllowed: ['static'],
    features: ['Drag & drop editor', 'Basic hosting'],
  },
  {
    name: 'Pro',
    description: 'For freelancers and creators.',
    pricePerMonth: 12,
    maxWebsites: 5,
    siteTypesAllowed: ['static', 'webapp'],
    features: ['Custom domains', 'Analytics', 'Collaboration'],
  },
  {
    name: 'Studio',
    description: 'For agencies and power users.',
    pricePerMonth: 29,
    maxWebsites: 20,
    siteTypesAllowed: ['static', 'webapp'],
    features: ['Client handoff', 'Priority support', 'White-labeling'],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    await PlanPackage.deleteMany(); // optional: clears old plans
    console.log('Old plan packages cleared');

    const created = await PlanPackage.insertMany(planPackages);
    console.log('Inserted:', created.map(p => p.name));

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
