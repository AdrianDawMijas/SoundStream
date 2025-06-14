import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Modelo de usuario simplificado para gestión
interface User {
  id: number;
  email: string;
  nombre: string;
  role: string;
  subscription: {
    id: number;
    type: 'FREE' | 'PERSONAL' | 'PRO';
  } | null;
}

@Component({
  selector: 'app-userlistcomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userlistcomponent.component.html'
})
export class UserlistcomponentComponent implements OnInit {
  // Lista de usuarios cargada desde el backend
  users: User[] = [];

  // URL base de la API de usuarios
  private readonly apiUrl = 'http://localhost:8080/v1/api/users';

  constructor(private http: HttpClient) {}

  // Carga inicial de usuarios al iniciar el componente
  ngOnInit(): void {
    this.loadUsers();
  }

  // Método para obtener todos los usuarios desde la API
  loadUsers(): void {
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (data) => this.users = data,
      error: () => alert('Error al cargar usuarios')
    });
  }

  // Actualiza el rol de un usuario en el backend
  updateRole(user: User): void {
    const updatedUser = { role: user.role };
    this.http.put(`${this.apiUrl}/${user.id}`, updatedUser).subscribe({
      next: () => alert(`Rol actualizado a ${user.role}`),
      error: () => alert('Error al actualizar el rol')
    });
  }

  // Elimina un usuario tras confirmación
  deleteUser(id: number): void {
    const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este usuario?');
    if (!confirmDelete) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        alert('Usuario eliminado');
        this.users = this.users.filter(user => user.id !== id);
      },
      error: () => alert('Error al eliminar usuario')
    });
  }
}
