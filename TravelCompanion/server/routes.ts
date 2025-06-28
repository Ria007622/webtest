import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTripSchema, insertBudgetSchema, insertReviewSchema, insertInquirySchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "이미 존재하는 아이디입니다" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(400).json({ message: "회원가입 중 오류가 발생했습니다", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "아이디와 비밀번호를 입력해주세요" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "아이디나 비밀번호가 일치하지 않습니다" });
      }
      
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "로그인 중 오류가 발생했습니다", error });
    }
  });

  // Initialize demo user
  (async () => {
    try {
      const demoUser = await storage.getUserByUsername("demo");
      if (!demoUser) {
        await storage.createUser({
          username: "demo",
          password: "demo123"
        });
      }
    } catch (error) {
      console.log("Demo user initialization failed:", error);
    }
  })();
  // Trip routes
  app.post("/api/trips", async (req, res) => {
    try {
      const tripData = insertTripSchema.parse(req.body);
      const trip = await storage.createTrip(tripData);
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: "Invalid trip data", error });
    }
  });

  app.get("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trip = await storage.getTrip(id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trip", error });
    }
  });

  app.get("/api/users/:userId/trips", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const trips = await storage.getTripsByUser(userId);
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trips", error });
    }
  });

  app.put("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertTripSchema.partial().parse(req.body);
      const trip = await storage.updateTrip(id, updateData);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data", error });
    }
  });

  // Budget routes
  app.post("/api/budgets", async (req, res) => {
    try {
      const budgetData = insertBudgetSchema.parse(req.body);
      const budget = await storage.createBudget(budgetData);
      res.json(budget);
    } catch (error) {
      res.status(400).json({ message: "Invalid budget data", error });
    }
  });

  app.get("/api/trips/:tripId/budget", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const budget = await storage.getBudgetByTrip(tripId);
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budget", error });
    }
  });

  app.put("/api/trips/:tripId/budget", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const updateData = insertBudgetSchema.partial().parse(req.body);
      const budget = await storage.updateBudget(tripId, updateData);
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      res.json(budget);
    } catch (error) {
      res.status(400).json({ message: "Invalid budget data", error });
    }
  });

  // Review routes
  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data", error });
    }
  });

  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews", error });
    }
  });

  app.get("/api/users/:userId/reviews", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reviews = await storage.getReviewsByUser(userId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user reviews", error });
    }
  });

  // FAQ routes
  app.get("/api/faqs", async (req, res) => {
    try {
      const { category } = req.query;
      let faqs;
      if (category && typeof category === "string") {
        faqs = await storage.getFAQsByCategory(category);
      } else {
        faqs = await storage.getFAQs();
      }
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQs", error });
    }
  });

  // Inquiry routes
  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiryData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(inquiryData);
      res.json(inquiry);
    } catch (error) {
      res.status(400).json({ message: "Invalid inquiry data", error });
    }
  });

  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
