import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, trim: true, lowercase: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    serviceName: { type: String, required: true }, // snapshot, in case the service is renamed later
    date: { type: String, required: true },        // YYYY-MM-DD
    time: { type: String, required: true },        // e.g. "11:30 AM"
    notes: { type: String, default: "", maxlength: 200 },
    status: { type: String, enum: ["requested", "confirmed", "cancelled"], default: "requested" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
