import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['editor', 'admin'], default: 'admin' },
    planPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'PlanPackage' },
    websites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Website' }],
    company: { type: String },
    phone: { type: String },
    profileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
