import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/v1/api/users';

  constructor(private http: HttpClient) {}

  // Actualiza la suscripción del usuario especificando el ID del nuevo plan
  updateSubscription(userId: number, subscriptionId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, {
      subscription: { id: subscriptionId }
    });
  }
}
