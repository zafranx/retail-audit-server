import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Supervisor', 'Auditor'],
    default: 'Auditor'
  },
  assigned_regions: [String],
  last_login: Date
}, {
  timestamps: true
});

userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
