import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    planPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'PlanPackage' },
    websites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Website' }],
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);
export default User;
