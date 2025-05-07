import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/v1/api/users';

  // 🔒 Estado global de login basado en localStorage
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('user'));
  isLoggedIn$ = this.isLoggedInSubject.asObservable();  // ⬅️ Observable público

  constructor(private http: HttpClient) {}

  // 🟢 Login clásico
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // 🟢 Registro de usuario
  register(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { nombre, email, password });
  }

  // 🟢 Login con token de Google
  loginWithGoogleToken(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/google-token`, { token });
  }

  // ✅ Guardar usuario al hacer login
  loginUser(data: any): void {
    localStorage.setItem('user', JSON.stringify(data));
    this.isLoggedInSubject.next(true);
  }

  // 🔴 Borrar usuario al cerrar sesión
  logoutUser(): void {
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
  }
}
