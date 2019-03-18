import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userLoged = false;
  private token;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private userId: string;
  USER_URL = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient, private router: Router) {}

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(`${this.USER_URL}/signup`, authData).subscribe(
      result => {
        this.router.navigate(['/']);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        `${this.USER_URL}/login`,
        authData
      )
      .subscribe(
        result => {
          const token = result.token;
          this.token = token;
          if (token) {
            const expiresInDuration = result.expiresIn;
            this.userId = result.userId;
            this.setAuthTimer(expiresInDuration);
            this.userLoged = true;
            this.authStatusListener.next(true);
            const expirationDate = new Date(
              new Date().getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(['/']);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.userLoged = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.userLoged = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  setAuthTimer(duration: number) {
    console.log(`Sething the timer: ${duration}`);

    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getToken() {
    return this.token;
  }

  isUserLoged() {
    return this.userLoged;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId
    };
  }
}
