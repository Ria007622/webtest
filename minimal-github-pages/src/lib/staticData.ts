// Static data for GitHub Pages deployment
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Trip {
  id: number;
  userId: number;
  destination: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  budgetRange: string;
  travelStyle: string;
  createdAt: Date;
}

export interface Budget {
  id: number;
  tripId: number;
  accommodation: string | null;
  food: string | null;
  transport: string | null;
  others: string | null;
  total: string | null;
}

export interface Review {
  id: number;
  userId: number;
  tripId: number | null;
  destination: string;
  title: string;
  content: string;
  rating: number;
  author: string;
  createdAt: Date;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number | null;
}

export interface Inquiry {
  id: number;
  type: string;
  content: string;
  phone: string | null;
  status: string | null;
  createdAt: Date;
}

// Static storage using localStorage
export class StaticStorage {
  private getFromStorage<T>(key: string, defaultValue: T[]): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private getNextId(items: any[]): number {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }

  // User operations
  getUsers(): User[] {
    const defaultUsers: User[] = [
      { id: 1, username: "demo", password: "demo123" }
    ];
    return this.getFromStorage("yolo_users", defaultUsers);
  }

  getUserByUsername(username: string): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.username === username);
  }

  createUser(userData: Omit<User, 'id'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: this.getNextId(users)
    };
    users.push(newUser);
    this.saveToStorage("yolo_users", users);
    return newUser;
  }

  // Trip operations
  getTrips(): Trip[] {
    return this.getFromStorage("yolo_trips", []);
  }

  getTripsByUser(userId: number): Trip[] {
    const trips = this.getTrips();
    return trips.filter(trip => trip.userId === userId);
  }

  createTrip(tripData: Omit<Trip, 'id' | 'createdAt'>): Trip {
    const trips = this.getTrips();
    const newTrip: Trip = {
      ...tripData,
      id: this.getNextId(trips),
      createdAt: new Date()
    };
    trips.push(newTrip);
    this.saveToStorage("yolo_trips", trips);
    return newTrip;
  }

  // Budget operations
  getBudgets(): Budget[] {
    return this.getFromStorage("yolo_budgets", []);
  }

  getBudgetByTrip(tripId: number): Budget | undefined {
    const budgets = this.getBudgets();
    return budgets.find(budget => budget.tripId === tripId);
  }

  createBudget(budgetData: Omit<Budget, 'id'>): Budget {
    const budgets = this.getBudgets();
    const newBudget: Budget = {
      ...budgetData,
      id: this.getNextId(budgets)
    };
    budgets.push(newBudget);
    this.saveToStorage("yolo_budgets", budgets);
    return newBudget;
  }

  updateBudget(tripId: number, updateData: Partial<Omit<Budget, 'id' | 'tripId'>>): Budget | undefined {
    const budgets = this.getBudgets();
    const index = budgets.findIndex(budget => budget.tripId === tripId);
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...updateData };
      this.saveToStorage("yolo_budgets", budgets);
      return budgets[index];
    }
    return undefined;
  }

  // Review operations
  getReviews(): Review[] {
    const defaultReviews: Review[] = [
      {
        id: 1,
        userId: 1,
        tripId: null,
        destination: "제주도",
        title: "제주도 힐링 여행 후기",
        content: "제주도에서 정말 편안한 시간을 보냈습니다. 바다를 보면서 힐링하기 좋은 곳이에요!",
        rating: 5,
        author: "여행러버",
        createdAt: new Date("2024-01-15")
      },
      {
        id: 2,
        userId: 1,
        tripId: null,
        destination: "부산",
        title: "부산 맛집 투어",
        content: "부산 해운대에서 먹은 해산물이 정말 맛있었어요. 특히 회센터 거리는 꼭 가보세요!",
        rating: 4,
        author: "맛집헌터",
        createdAt: new Date("2024-02-20")
      },
      {
        id: 3,
        userId: 1,
        tripId: null,
        destination: "경주",
        title: "경주 역사 탐방",
        content: "불국사와 석굴암은 정말 인상깊었습니다. 한국의 아름다운 전통문화를 느낄 수 있어요.",
        rating: 5,
        author: "역사매니아",
        createdAt: new Date("2024-03-10")
      }
    ];
    return this.getFromStorage("yolo_reviews", defaultReviews);
  }

  createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...reviewData,
      id: this.getNextId(reviews),
      createdAt: new Date()
    };
    reviews.push(newReview);
    this.saveToStorage("yolo_reviews", reviews);
    return newReview;
  }

  // FAQ operations
  getFAQs(): FAQ[] {
    const defaultFAQs: FAQ[] = [
      {
        id: 1,
        question: "여행 계획은 언제까지 수정할 수 있나요?",
        answer: "여행 출발 3일 전까지 자유롭게 수정하실 수 있습니다. 그 이후에는 고객센터로 문의해주세요.",
        category: "예약/취소",
        order: 1
      },
      {
        id: 2,
        question: "예산 계산기는 어떻게 사용하나요?",
        answer: "예산 계산기에서 숙박, 식비, 교통비, 기타 비용을 입력하시면 총 예산과 카테고리별 비율을 확인할 수 있습니다.",
        category: "서비스 이용",
        order: 2
      },
      {
        id: 3,
        question: "여행 후기는 어떻게 작성하나요?",
        answer: "여행 후기 페이지에서 여행지, 제목, 내용, 평점을 입력하여 후기를 작성할 수 있습니다.",
        category: "서비스 이용",
        order: 3
      },
      {
        id: 4,
        question: "취소 수수료는 얼마인가요?",
        answer: "여행 출발 7일 전 취소 시 10%, 3일 전 취소 시 30%, 당일 취소 시 50%의 수수료가 발생합니다.",
        category: "예약/취소",
        order: 4
      },
      {
        id: 5,
        question: "여행 스타일은 어떻게 선택하나요?",
        answer: "힐링, 맛집, 모험, 문화, 자연, 쇼핑 중에서 원하는 스타일을 선택하시면 맞춤형 추천을 받을 수 있습니다.",
        category: "여행 계획",
        order: 5
      }
    ];
    return this.getFromStorage("yolo_faqs", defaultFAQs);
  }

  getFAQsByCategory(category: string): FAQ[] {
    const faqs = this.getFAQs();
    return faqs.filter(faq => faq.category === category);
  }

  // Inquiry operations
  getInquiries(): Inquiry[] {
    return this.getFromStorage("yolo_inquiries", []);
  }

  createInquiry(inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
    const inquiries = this.getInquiries();
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: this.getNextId(inquiries),
      status: "접수완료",
      createdAt: new Date()
    };
    inquiries.push(newInquiry);
    this.saveToStorage("yolo_inquiries", inquiries);
    return newInquiry;
  }
}

export const staticStorage = new StaticStorage();