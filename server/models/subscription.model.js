const mongoose = require("mongoose");
const { Schema } = mongoose;

const subscriptionSchema = new Schema({
  // INI BAGIAN PALING PENTING. Pastikan ada 'ref' dan tipenya benar.
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
    enum: ["Diet Plan", "Protein Plan", "Royal Plan"],
  },
  mealTypes: [
    {
      type: String,
      required: true,
    },
  ],
  deliveryDays: [
    {
      type: String,
      required: true,
    },
  ],
  allergies: {
    type: String,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "paused", "cancelled"],
    default: "active",
  },
  pauseStartDate: {
    type: Date,
  },
  pauseEndDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
