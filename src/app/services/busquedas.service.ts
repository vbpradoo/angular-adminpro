import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string) {
    return this.http
      .get<any>(`${base_url}/find/collection/${tipo}/${termino}`, this.headers)
      .pipe(
        // delay(5000),
        map((resp: { ok: boolean; resultados: any[] }) => {
          let usuarios: Usuario[] = [];
          switch (tipo) {
            case 'usuarios':
              usuarios = this.transformarUsuarios(resp.resultados);
              break;

            default:
              break;
          }

          return {
            total: usuarios.length,
            usuarios,
          };
        })
      );
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
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
  }
}
