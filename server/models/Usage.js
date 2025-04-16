
import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  totalRequests: Number,
  successfulRequests: Number,
  failedRequests: Number,
  errorRate: Number, 
  dailyUsage: [
    {
      date: String,
      successfulRequests: Number,
      failedRequests: Number,
      totalRequests: Number, 
    }
  ]
  
});

const Usage = mongoose.model("Usage", usageSchema);
export default Usage;
