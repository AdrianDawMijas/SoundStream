import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

// Interfaz de respuesta para operaciones de autenticación
export interface LoginResponseDTO {
  id: number;
  email: string;
  nombre: string;
  subscriptionType: string;
  token: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/v1/api/users';
  private currentUser: LoginResponseDTO | null = null;

  // Estado observable de sesión iniciada
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ──────────────── MÉTODOS DE AUTENTICACIÓN ────────────────

  login(email: string, password: string): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        console.log('🔐 TOKEN RECIBIDO:', response.token);
        this.handleLogin(response);
      })
    );
  }

  register(nombre: string, email: string, password: string): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.apiUrl}`, { nombre, email, password }).pipe(
      tap(response => this.handleLogin(response))
    );
  }

  loginWithGoogleToken(token: string): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.apiUrl}/login/google-token`, { token }).pipe(
      tap(response => this.handleLogin(response))
    );
  }

  logout(): void {
    try {
      localStorage.removeItem('token');
    } catch {
      sessionStorage.removeItem('token');
    }
    this.currentUser = null;
    this.isLoggedInSubject.next(false);
  }

  // ──────────────── GESTIÓN DEL ESTADO DEL USUARIO ────────────────

  handleLogin(response: LoginResponseDTO): void {
    try {
      localStorage.setItem('token', response.token);
    } catch (e) {
      sessionStorage.setItem('token', response.token);
    }
    this.currentUser = response;
    this.isLoggedInSubject.next(true);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    try {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    } catch (e) {
      console.warn('⚠️ localStorage bloqueado, usando sessionStorage:', e);
      return sessionStorage.getItem('token');
    }
  }

  // ──────────────── OBTENCIÓN DE DATOS DEL USUARIO ────────────────

  getCurrentUser(): LoginResponseDTO | null {
    if (!this.currentUser) {
      const token = this.getToken();
      if (token) {
        try {
          const parts = token.split('.');
          if (parts.length !== 3) throw new Error('Token mal formado');

          const payload = JSON.parse(atob(parts[1]));
          this.currentUser = {
            id: payload.id,
            email: payload.sub,
            nombre: payload.nombre || '',
            subscriptionType: payload.subscriptionType || '',
            token,
            role: payload.role || 'USER'
          };
        } catch (error) {
          console.error('❌ Error al decodificar el token:', error);
          this.logout();
          return null;
        }
      }
    }
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (e) {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
}
