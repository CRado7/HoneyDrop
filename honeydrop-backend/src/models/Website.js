import mongoose from 'mongoose';

const websiteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    domain: { type: String },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Website = mongoose.model('Website', websiteSchema);
export default Website;
