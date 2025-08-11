import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
  {
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Website',
      required: true,
    },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    path: { type: String, default: '/' },
    isHomepage: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    seo: {
      title: String,
      description: String,
    },
    body: {
      styles: {
        type: Object,
        default: {
          paddingTop: '0px',
          paddingRight: '0px',
          paddingBottom: '0px',
          paddingLeft: '0px',
          backgroundColor: '#ffffff',
          display: 'block', // or 'flex'
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        },
      },
    },
    sections: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Page = mongoose.model('Page', pageSchema);
export default Page;
