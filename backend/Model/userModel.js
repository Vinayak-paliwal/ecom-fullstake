import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    conformPassword: {
      type: String,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: "buyer"
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.model("User", userSchema);
