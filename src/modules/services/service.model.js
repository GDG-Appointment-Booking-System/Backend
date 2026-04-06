import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Service duration is required"],
      min: [5, "Duration must be at least 5 minutes"],
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: [0, "Price must be a positive value"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Service", serviceSchema);
