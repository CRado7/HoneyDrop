import mongoose from 'mongoose';

const inspectorFieldSchema = new mongoose.Schema({
  key: { type: String, required: true },             // e.g., 'styles.fontSize'
  label: { type: String, required: true },           // e.g., 'Font Size'
  type: { type: String, required: true },            // e.g., 'text', 'select', 'slider', 'color'

  options: [String],                                 // for 'select' types

  config: {                                          // for slider or advanced UI config
    min: Number,
    max: Number,
    step: Number,
    units: [String],                                 // e.g., ['px', '%']
    defaultUnit: String,
    defaultValue: mongoose.Schema.Types.Mixed,       // can be number or string
  }
}, { _id: false });

const componentSchema = new mongoose.Schema({
  category: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  tag: { type: String },

  defaults: {
    type: mongoose.Schema.Types.Mixed,               // stores text, tag, styles, etc.
  },

  inspectorFields: [inspectorFieldSchema],           // array of editable fields
}, {
  timestamps: true,
});

const ComponentLibrary = mongoose.model('ComponentLibrary', componentSchema);

export default ComponentLibrary;
