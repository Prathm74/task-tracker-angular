import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'isLoggedIn';

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem(this.AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    // Clear everything on logout
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }
}
