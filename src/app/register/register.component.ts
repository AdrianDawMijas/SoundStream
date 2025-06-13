import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Inicializa el formulario reactivo con validadores
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });
  }

  // Alternar visibilidad de contraseña
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Validador personalizado para comprobar coincidencia de contraseñas
  passwordsMatch(form: AbstractControl) {
    const pass = form.get('password')?.value;
    const repeat = form.get('repeatPassword')?.value;
    return pass === repeat ? null : { mismatch: true };
  }

  // Acción al enviar el formulario
  onSubmit(): void {
    if (this.registerForm.valid) {
      const { nombre, email, password } = this.registerForm.value;

      this.authService.register(nombre, email, password).subscribe({
        next: () => {
          console.log('Registro exitoso');
          this.router.navigate(['/']);
        },
        error: () => {
          alert('Error al registrar. ¿Correo ya usado?');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  // Acceso rápido a los controles del formulario desde la vista
  get f() {
    return this.registerForm.controls;
  }
}
