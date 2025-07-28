import mongoose from 'mongoose';

const planPackageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  pricePerMonth: { type: Number, required: true },
  maxWebsites: { type: Number, required: true },
  siteTypesAllowed: [{ type: String, enum: ['static', 'webapp'] }],
  features: [String],
});

const PlanPackage = mongoose.model('PlanPackage', planPackageSchema);
export default PlanPackage;
