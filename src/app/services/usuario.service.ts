import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';


import { environment } from 'src/environments/environment.development';


import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';


const base_url = environment.base_url;
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  public usuario!: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { }
            
  
  get token(): string{
    return  localStorage.getItem('token') || '';
  }
  
  get uuid(): string{
    return  this.usuario.uuid || '';
  }


  validarToken(): Observable<boolean>{

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        "x-token": this.token,
      }
    }).pipe(
      map( (resp: any) => {
        console.log(resp);
        const {
          nombre,
          email,
          password,
          uuid,
          role,
          img,
          google
        } = resp.usuario
        this.usuario = new Usuario(nombre, email, password, uuid,role, img, google);
        localStorage.setItem('token', resp.token);
        return true;
      }),
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

  actualizarPerfil(data: { email: string, nombre: string, role: string | undefined }){

    data = {
      ...data,
      role: this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uuid}`, data,{
                  headers: {
                    "x-token": this.token,
                  }
                })
                // .pipe(
                //   tap( (resp: any) =>{
                //     // console.log(resp);
                //     localStorage.setItem('token', resp.token);
                //   })
                // );
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
