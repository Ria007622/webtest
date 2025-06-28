import { 
  users, trips, budgets, reviews, faqs, inquiries,
  type User, type InsertUser,
  type Trip, type InsertTrip,
  type Budget, type InsertBudget,
  type Review, type InsertReview,
  type FAQ, type InsertFAQ,
  type Inquiry, type InsertInquiry
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Trip operations
  createTrip(trip: InsertTrip): Promise<Trip>;
  getTrip(id: number): Promise<Trip | undefined>;
  getTripsByUser(userId: number): Promise<Trip[]>;
  updateTrip(id: number, trip: Partial<InsertTrip>): Promise<Trip | undefined>;
  
  // Budget operations
  createBudget(budget: InsertBudget): Promise<Budget>;
  getBudgetByTrip(tripId: number): Promise<Budget | undefined>;
  updateBudget(tripId: number, budget: Partial<InsertBudget>): Promise<Budget | undefined>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReviews(): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  
  // FAQ operations
  getFAQs(): Promise<FAQ[]>;
  getFAQsByCategory(category: string): Promise<FAQ[]>;
  
  // Inquiry operations
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trips: Map<number, Trip>;
  private budgets: Map<number, Budget>;
  private reviews: Map<number, Review>;
  private faqs: Map<number, FAQ>;
  private inquiries: Map<number, Inquiry>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.trips = new Map();
    this.budgets = new Map();
    this.reviews = new Map();
    this.faqs = new Map();
    this.inquiries = new Map();
    this.currentId = 1;
    
    this.initializeFAQs();
    this.initializeReviews();
  }

  private initializeFAQs() {
    const defaultFAQs: FAQ[] = [
      {
        id: this.currentId++,
        question: "여행 계획은 언제까지 수정할 수 있나요?",
        answer: "여행 출발 3일 전까지는 언제든지 무료로 수정하실 수 있습니다. 그 이후에는 일부 변경 수수료가 발생할 수 있습니다.",
        category: "여행정보",
        order: 1
      },
      {
        id: this.currentId++,
        question: "예산 초과 시 어떻게 하나요?",
        answer: "예산을 재조정하거나 일정 중 일부를 변경하여 예산에 맞춰 계획을 수정할 수 있습니다. AI가 자동으로 대안을 제안해드립니다.",
        category: "예산관리",
        order: 2
      },
      {
        id: this.currentId++,
        question: "여행 중 긴급상황 시 연락처는?",
        answer: "24시간 긴급 연락처: 1588-0000 (한국어 지원) 또는 앱 내 긴급 채팅을 이용해주세요.",
        category: "고객지원",
        order: 3
      },
      {
        id: this.currentId++,
        question: "여행 보험은 어떻게 가입하나요?",
        answer: "여행 계획 완료 후 보험 가입 옵션을 제공합니다. 여러 보험사와 제휴하여 최적의 상품을 추천해드립니다.",
        category: "예약관련",
        order: 4
      },
      {
        id: this.currentId++,
        question: "단체 여행도 계획할 수 있나요?",
        answer: "네, 10명 이상의 단체 여행도 가능합니다. 단체 할인 혜택과 전담 상담원 서비스를 제공합니다.",
        category: "예약관련",
        order: 5
      }
    ];

    defaultFAQs.forEach(faq => this.faqs.set(faq.id, faq));
  }

  private initializeReviews() {
    const defaultReviews: Review[] = [
      {
        id: this.currentId++,
        userId: 1,
        tripId: null,
        title: "제주도 3박 4일 힐링 여행",
        content: "정말 완벽한 여행이었어요! YOLO에서 추천해준 일정대로 따라했는데 모든 것이 완벽했습니다. 특히 숨겨진 맛집들이 정말 대박이었어요.",
        rating: 5,
        destination: "제주도",
        author: "김**님",
        createdAt: new Date("2024-03-10")
      },
      {
        id: this.currentId++,
        userId: 2,
        tripId: null,
        title: "서울 맛집 투어 2박 3일",
        content: "맛집 스타일로 계획한 서울 여행! 숨겨진 로컬 맛집들을 발견할 수 있어서 너무 좋았습니다. 예산도 정확하게 맞춰졌어요.",
        rating: 4,
        destination: "서울",
        author: "이**님",
        createdAt: new Date("2024-03-08")
      },
      {
        id: this.currentId++,
        userId: 3,
        tripId: null,
        title: "경주 문화유산 탐방",
        content: "역사와 문화를 좋아해서 선택한 경주 여행. 체계적인 일정으로 모든 주요 유적지를 효율적으로 볼 수 있었습니다.",
        rating: 5,
        destination: "경주",
        author: "박**님",
        createdAt: new Date("2024-03-05")
      }
    ];

    defaultReviews.forEach(review => this.reviews.set(review.id, review));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Trip operations
  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = this.currentId++;
    const trip: Trip = { 
      ...insertTrip, 
      id, 
      createdAt: new Date(),
      itinerary: insertTrip.itinerary || null,
      totalBudget: insertTrip.totalBudget || null
    };
    this.trips.set(id, trip);
    return trip;
  }

  async getTrip(id: number): Promise<Trip | undefined> {
    return this.trips.get(id);
  }

  async getTripsByUser(userId: number): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter(trip => trip.userId === userId);
  }

  async updateTrip(id: number, updateData: Partial<InsertTrip>): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    
    const updatedTrip = { ...trip, ...updateData };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }

  // Budget operations
  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = this.currentId++;
    const budget: Budget = { ...insertBudget, id };
    this.budgets.set(id, budget);
    return budget;
  }

  async getBudgetByTrip(tripId: number): Promise<Budget | undefined> {
    return Array.from(this.budgets.values()).find(budget => budget.tripId === tripId);
  }

  async updateBudget(tripId: number, updateData: Partial<InsertBudget>): Promise<Budget | undefined> {
    const budget = Array.from(this.budgets.values()).find(b => b.tripId === tripId);
    if (!budget) return undefined;
    
    const updatedBudget = { ...budget, ...updateData };
    this.budgets.set(budget.id, updatedBudget);
    return updatedBudget;
  }

  // Review operations
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentId++;
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  // FAQ operations
  async getFAQs(): Promise<FAQ[]> {
    return Array.from(this.faqs.values()).sort((a, b) => a.order - b.order);
  }

  async getFAQsByCategory(category: string): Promise<FAQ[]> {
    return Array.from(this.faqs.values())
      .filter(faq => faq.category === category)
      .sort((a, b) => a.order - b.order);
  }

  // Inquiry operations
  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentId++;
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id, 
      status: "pending",
      createdAt: new Date()
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }
}

export const storage = new MemStorage();
