const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new mongoose.Schema(
  {
    timeSlotId: [
      {
        type: Schema.Types.ObjectId,
        ref: "time_slots",
        required: [true, "A booking must have a time slot"],
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: [true, "A booking must belong to a user"],
    },
    date: {
      type: Date,
      required: [true, "A booking must have a date"],
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000)
    },
    refundedAt: Date, // thời điểm hoàn tiền
    completedAt: Date,
    paidAt: Date,
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "cancelled", "refunded", "completed"],
        message: "Status must be pending, confirmed, cancelled, refunded, or completed",
      },
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Booking = mongoose.model("booking", bookingSchema);

module.exports = Booking;
