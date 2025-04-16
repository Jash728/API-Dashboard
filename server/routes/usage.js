import express from "express";
import Usage from "../models/Usage.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const brandId = req.brandId;

    const usageStats = await Usage.find({ brand: brandId }).sort({ date: 1 });
    console.log(usageStats);

    const totalRequests = usageStats.reduce(
      (sum, stat) => sum + stat.totalRequests,
      0
    );
    const successRequests = usageStats.reduce(
      (sum, stat) => sum + stat.successfulRequests,
      0
    );
    const failedRequests = usageStats.reduce(
      (sum, stat) => sum + stat.failedRequests,
      0
    );
    const errorRate = ((failedRequests / totalRequests) * 100).toFixed(2);

    const usageTimeline = usageStats
      .flatMap((stat) =>
        stat.dailyUsage.map((day) => ({
          date: day.date,
          total: day.totalRequests,
          success: day.successfulRequests,
          failed: day.failedRequests,
        }))
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date)); 

   

    res.json({
      totalRequests,
      successRequests,
      failedRequests,
      errorRate,
      usageTimeline,
    });
  } catch (error) {
    console.error("Error fetching usage stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
