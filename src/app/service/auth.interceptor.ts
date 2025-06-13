import { HttpInterceptorFn } from '@angular/common/http';

// Interceptor que agrega el token de autenticación al header Authorization
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  // Si existe token, se clona la petición con el encabezado Authorization
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // Si no hay token, se envía la petición original sin modificaciones
  return next(req);
};
