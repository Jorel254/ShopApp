import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/User';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '@/environments/environment';
import { AuthResponse } from '../interfaces/AuthResponse';
import { rxResource } from '@angular/core/rxjs-interop';
type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly _authStatus = signal<AuthStatus>('checking');
  private readonly _user = signal<User | null>(null);
  private readonly _token = signal<string | null>(sessionStorage.getItem('token'));

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this.user()) return 'authenticated';
    return 'not-authenticated';
  });

  checkStatusResourece = rxResource({
    loader: () => {
      return this.checkAuthStatus();
    },
  } as any);

  user = computed(() => this._user());

  token = computed(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, { email, password }).pipe(
      tap((resp: AuthResponse) => {
        this.setAuthData(resp);
        console.log(resp);
      }),
      map(() => true),
      catchError(() => {
        this.cleanAuthData();
        return of(false);
      })
    );
  }
  checkAuthStatus(): Observable<boolean> {
    const token = sessionStorage.getItem('token');
    if (!token || token === '') {
      this.cleanAuthData();
      return of(false);
    }
    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`).pipe(
      tap((resp: AuthResponse) => {
        this.setAuthData(resp);
        console.log(resp);
      }),
      map(() => true),
      catchError(() => {
        this.cleanAuthData();
        return of(false);
      })
    );
  }

  logout() {
    this.cleanAuthData();
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/register`, {
        fullName: name,
        email,
        password,
      })
      .pipe(
        tap((resp: AuthResponse) => {
          this.setAuthData(resp);
          console.log(resp);
        }),
        map(() => true),
        catchError(() => {
          this.cleanAuthData();
          return of(false);
        })
      );
  }

  validateRoleUser(role: string): boolean {
    return this.user()?.roles.includes(role) ?? false;
  }

  private cleanAuthData() {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
    sessionStorage.removeItem('token');
  }
  private setAuthData(authData: AuthResponse) {
    this._authStatus.set('authenticated');
    this._user.set(authData.user);
    this._token.set(authData.token);
    sessionStorage.setItem('token', authData.token);
  }
}
