import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment.development';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuario!: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uuid(): string {
    return this.usuario.uuid || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' | undefined{
    return this.usuario.role
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, this.headers).pipe(
      map((resp: any) => {
        console.log(resp);
        const { nombre, email, password, uuid, role, img, google } =
          resp.usuario;
        this.usuario = new Usuario(
          nombre,
          email,
          password,
          uuid,
          role,
          img,
          google
        );
        this.guardarLocalStorage(resp.token, resp.menu);

        return true;
      }),
      catchError((error: any) => of(false))
    );
  }

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  crearUsuario(formData: RegisterForm): Observable<any> {
    console.log('Creando usuario');
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        // console.log(resp);
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  actualizarPerfil(data: {
    email: string;
    nombre: string;
    role: string | undefined;
  }) {
    data = {
      ...data,
      role: this.usuario.role,
    };
    return this.http.put(
      `${base_url}/usuarios/${this.uuid}`,
      data,
      this.headers
    );
    // .pipe(
    //   tap( (resp: any) =>{
    //     // console.log(resp);
    //     localStorage.setItem('token', resp.token);
    //   })
    // );
  }

  login(formData: LoginForm): Observable<any> {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        // console.log(resp);
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        // console.log(resp);
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');

    // Borrar menu
    localStorage.removeItem('menu');

    if (this.usuario.google) {
      google.accounts.id.revoke(this.usuario.email, () => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/login');
        });
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  cargarUsuarios(desde: number = 0) {
    return this.http
      .get<CargarUsuarios>(`${base_url}/usuarios?from=${desde}`, this.headers)
      .pipe(
        // delay(5000),
        map((resp) => {
          const usuarios = resp.usuarios.map(
            (user) =>
              new Usuario(
                user.nombre,
                user.email,
                '',
                user.uuid,
                user.role,
                user.img,
                user.google
              )
          );

          return {
            total: resp.total,
            usuarios,
          };
        })
      );
  }

  eliminarUsuario(usuario: Usuario) {
    console.log('Eliminando usuario');
    return this.http.delete(
      `${base_url}/usuarios/${usuario.uuid}`,
      this.headers
    );
  }

  guardarUsuario(usuario: Usuario) {
    return this.http.put(
      `${base_url}/usuarios/${usuario.uuid}`,
      usuario,
      this.headers
    );
  }
}
