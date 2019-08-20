import mongoose from 'mongoose';

const AccessSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    expire_in: {
      type: Date,
      required: true,
    },
    phone_register_code_notification: {
      type: String,
      default: null,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('Access', AccessSchema);
