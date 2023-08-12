import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';


import { environment } from 'src/environments/environment.development';


import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';


const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { }

  validarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        "x-token": token,
      }
    }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map( (resp: any) => true),
      catchError( (error: any) => of(false))
    );
  }

  crearUsuario(formData: RegisterForm): Observable<any>{
    console.log('Creando usuario');
    return this.http.post(`${base_url}/usuarios`, formData)
                .pipe(
                  tap( (resp: any) =>{
                    // console.log(resp);
                    localStorage.setItem('token', resp.token);
                  })
                );
  }

  login( formData: LoginForm ): Observable<any>{
    return this.http.post(`${base_url}/login`, formData)
                .pipe(
                  tap( (resp: any) =>{
                    // console.log(resp);
                    localStorage.setItem('token', resp.token);
                  })
                );
  }
  
  loginGoogle( token: string) {
    return this.http.post(`${base_url}/login/google`, {token})
                .pipe(
                  tap( (resp: any) =>{
                    // console.log(resp);
                    localStorage.setItem('token', resp.token);
                  })
                );
  }

  logout() {
    localStorage.removeItem("token");
    google.accounts.id.revoke ( 'vbpradoo@gmail.com', () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl("/login")
      })
    })
  }
}
