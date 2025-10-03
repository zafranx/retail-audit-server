import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  template_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  template_name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  assigned_to: {
    type: String,
    default: 'field_user'
  },
  location: {
    store_name: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  responses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  submitted_at: Date
}, {
  timestamps: true
});

auditSchema.index({ status: 1 });
auditSchema.index({ assigned_to: 1 });
auditSchema.index({ template_id: 1 });

const Audit = mongoose.model('Audit', auditSchema);

export default Audit;
