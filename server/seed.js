import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Brand from "./models/Brand.js";
import Usage from "./models/Usage.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    
    await Brand.deleteMany({});
    await Usage.deleteMany({});
    console.log("🧹 Cleared existing data");

    
    const brands = [
      {
        name: "Brand One",
        email: "brand1@example.com",
        password: "password1",
      },
      {
        name: "Brand Two",
        email: "brand2@example.com",
        password: "password2",
      },
    ];

    
    const savedBrands = await Promise.all(
      brands.map(async (brand) => {
        const hashedPassword = await bcrypt.hash(brand.password, 10);
        const newBrand = new Brand({
          name: brand.name,
          email: brand.email,
          password: hashedPassword,
        });
        return await newBrand.save();
      })
    );

    console.log("Brands seeded");

    
    const usageDataPerBrand = [
      {
        dailyUsage: [
          { date: "2024-04-01", successfulRequests: 100, failedRequests: 5, totalRequests: 105 },
          { date: "2024-04-02", successfulRequests: 95, failedRequests: 10, totalRequests: 105 },
          { date: "2024-04-03", successfulRequests: 110, failedRequests: 5, totalRequests: 115 },
          { date: "2024-04-04", successfulRequests: 120, failedRequests: 5, totalRequests: 125 },
          { date: "2024-04-05", successfulRequests: 130, failedRequests: 10, totalRequests: 140 },
        ],
      },
      {
        dailyUsage: [
          { date: "2024-04-01", successfulRequests: 80, failedRequests: 15, totalRequests: 95 },
          { date: "2024-04-02", successfulRequests: 85, failedRequests: 10, totalRequests: 95 },
          { date: "2024-04-03", successfulRequests: 90, failedRequests: 10, totalRequests: 100 },
          { date: "2024-04-04", successfulRequests: 100, failedRequests: 5, totalRequests: 105 },
          { date: "2024-04-05", successfulRequests: 105, failedRequests: 10, totalRequests: 115 },
        ],
      },
    ];

    for (let i = 0; i < savedBrands.length; i++) {
      const brand = savedBrands[i];
      const { dailyUsage } = usageDataPerBrand[i];

      const totalRequests = dailyUsage.reduce((sum, d) => sum + d.totalRequests, 0);
      const successfulRequests = dailyUsage.reduce((sum, d) => sum + d.successfulRequests, 0);
      const failedRequests = dailyUsage.reduce((sum, d) => sum + d.failedRequests, 0);
      const errorRate = ((failedRequests / totalRequests) * 100).toFixed(2);

      const usage = new Usage({
        brand: brand._id,
        totalRequests,
        successfulRequests,
        failedRequests,
        errorRate,
        dailyUsage,
      });

      await usage.save();
    }

    console.log("Usage data seeded for each brand");

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error(" Seeding error:", error);
    await mongoose.disconnect();
  }
};

seedData();

