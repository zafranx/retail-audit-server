import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question_id: { type: String, required: true },
  text: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['text_input', 'numeric_input', 'single_choice', 'multiple_choice', 'dropdown', 'date_time', 'file_upload', 'barcode_scanner']
  },
  options: [String],
  mandatory: { type: Boolean, default: false },
  validation: {
    min: Number,
    max: Number
  }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  section_id: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  order: { type: Number, required: true },
  questions: [questionSchema]
}, { _id: false });

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Merchandising', 'Stock', 'Quality', 'Compliance', 'Safety']
  },
  sections: [sectionSchema],
  scoring_rules: {
    enabled: { type: Boolean, default: false },
    weights: { type: Map, of: Number },
    threshold: Number,
    critical_questions: [String]
  },
  conditional_logic: [{
    question_id: String,
    condition: String,
    operator: { type: String, enum: ['AND', 'OR', 'NOT'] },
    action: String,
    target: String
  }],
  is_published: {
    type: Boolean,
    default: false
  },
  created_by: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

templateSchema.index({ is_published: 1 });
templateSchema.index({ category: 1 });

const Template = mongoose.model('Template', templateSchema);

export default Template;
