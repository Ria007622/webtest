import { staticStorage } from './staticData';

export interface AuthUser {
  id: number;
  username: string;
}

class AuthManager {
  private currentUser: AuthUser | null = null;

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    try {
      const userData = localStorage.getItem('yolo_current_user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    } catch {
      this.currentUser = null;
    }
  }

  private saveUserToStorage(user: AuthUser | null): void {
    if (user) {
      localStorage.setItem('yolo_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('yolo_current_user');
    }
    this.currentUser = user;
  }

  async login(username: string, password: string): Promise<{ success: boolean; message: string; user?: AuthUser }> {
    if (!username || !password) {
      return { success: false, message: "아이디와 비밀번호를 입력해주세요" };
    }

    const user = staticStorage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return { success: false, message: "아이디나 비밀번호가 일치하지 않습니다" };
    }

    const authUser: AuthUser = { id: user.id, username: user.username };
    this.saveUserToStorage(authUser);
    
    return { success: true, message: "로그인 성공", user: authUser };
  }

  async signup(userData: { username: string; password: string }): Promise<{ success: boolean; message: string; user?: AuthUser }> {
    // Check if user already exists
    const existingUser = staticStorage.getUserByUsername(userData.username);
    if (existingUser) {
      return { success: false, message: "이미 존재하는 아이디입니다" };
    }

    try {
      const newUser = staticStorage.createUser(userData);
      const authUser: AuthUser = { id: newUser.id, username: newUser.username };
      this.saveUserToStorage(authUser);
      
      return { success: true, message: "회원가입 성공", user: authUser };
    } catch {
      return { success: false, message: "회원가입 중 오류가 발생했습니다" };
    }
  }

  logout(): void {
    this.saveUserToStorage(null);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}

export const authManager = new AuthManager();