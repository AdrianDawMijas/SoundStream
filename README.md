# 🎧 SoundStream Frontend

Este repositorio contiene el **frontend en Angular** de **SoundStream**, una plataforma para la generación de música usando inteligencia artificial. El frontend ofrece una interfaz visual moderna, registro de usuarios, login clásico y con Google, gestión de playlists y funcionalidades administrativas para usuarios con rol de administrador.

---

## 🚀 Tecnologías principales

- Angular 17
- RxJS
- Bootstrap 5 (tema oscuro)
- FontAwesome + Bootstrap Icons
- Google Identity Services
- Angular Forms & Router

---


## Development server


Para iniciar el servidor de desarrollo local, ejecuta:
```bash
ng serve
```

Una vez que el servidor esté en funcionamiento, abre tu navegador y navega a http://localhost:4200/. La aplicación se recargará automáticamente cada vez que modifiques alguno de los archivos fuente.
## 🔐 Seguridad y autenticación

- **Token JWT** almacenado en `localStorage` o `sessionStorage`
- **Interceptor HTTP** (`auth.interceptor.ts`) que añade automáticamente `Authorization: Bearer <token>` a cada petición
- **Roles definidos**: `USER` y `ADMIN`
- Protección de rutas por rol
- Opción de login con **Google Token** integrada

---

## 👤 Gestión de usuario

### Vista de perfil (`/profile`)
- Muestra nombre, email, rol y tipo de suscripción
- Botón para cerrar sesión
- Si el usuario es `ADMIN`, se habilita una sección para gestión de usuarios

### Vista de registro (`/register`)
- Validación de nombre, email, contraseña y confirmación
- Opción para mostrar u ocultar contraseña

---

## 🎼 Generación musical

### Vista principal (`/music-generator`)
- Paneles interactivos separados: Structure, Tempo, Energy, Duration, Instruments
- Cada panel tiene su propio componente con diseño modular
- Botón para **generar** música con IA
- Permite guardar la canción generada en la biblioteca personal

---

## 📚 Biblioteca (`/library`)

- Lista de canciones generadas por el usuario
- Filtros dinámicos por:
  - Título
  - Duración
  - Género
  - Instrumentos
  - Tempo
- Los administradores pueden ver todas las canciones generadas por todos los usuarios

---

## 🛠 Servicios

### `AuthService`
- Login / Registro / Google Login
- Gestión de token y usuario actual
- Métodos para verificar si el usuario está logueado o si es admin

### `PlaylistService`
- Obtener, añadir y eliminar canciones de la playlist
- Obtener canciones filtradas por duración, género, instrumentos, etc.

### `UserService`
- Actualizar suscripción
- Cambiar rol de usuario
- Eliminar usuarios (sólo admins)

---

## 🎨 Diseño visual

- Estética moderna en tema oscuro
- Tarjetas con bordes redondeados, tipografía clara y sombreado
- Estilos responsive con media queries CSS
- Botones visuales e iconografía clara (FontAwesome + Bootstrap Icons)

---

## ✅ Mejoras futuras

- Gestión global de estado con NgRx
- Soporte offline con PWA
- Alertas globales reutilizables
- Traducción multilingüe (i18n)
- Accesibilidad (teclado, ARIA, screen readers)


---

## 🎓 Proyecto académico

> Desarrollado como parte del Proyecto Integrado del ciclo **Desarrollo de Aplicaciones Web (DAW)**.

---

## 🔗 Enlaces relacionados

- [Backend Java + Spring Boot](https://github.com/usuario/soundstream-backend)
- [App en producción (Vercel)](https://soundstream.vercel.app)

---

© 2025 SoundStream. Todos los derechos reservados
