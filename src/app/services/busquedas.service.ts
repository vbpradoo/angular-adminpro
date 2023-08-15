import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

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
      .get<any[]>(`${base_url}/find/collection/${tipo}/${termino}`, this.headers)
      .pipe(
        // delay(5000),
        map((resp: any) => {
          switch (tipo) {
            case 'usuarios':
              let usuarios = this.transformarUsuarios(resp.resultados);
              return {
                total: usuarios.length,
                usuarios,
              };
              break;
              case 'hospitales':
                let hospitales = this.transformarHospitales(resp.resultados);
                return {
                  total: hospitales.length,
                  hospitales,
                };
              break;
              case 'medicos':
                let medicos = this.transformarMedicos(resp.resultados);
                return {
                  total: medicos.length,
                  medicos,
                };
              break;
            default:
              console.log('Error con el tipo. Escoja entre medicos/usuarios/hospitales.');
              return;
              break;
          }

        })
      );
  }

  transformarMedicos(resultados: any[]): Medico[] {
    return resultados.map(
      (med) =>
        new Medico(
          med.nombre,
          med.uuid,
          med.img,
          med.usuario,
          med.hospital,
        )
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

  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados.map(
      (hosp) =>
        new Hospital(
          hosp.nombre,
          hosp.uuid,
          hosp.img,
          hosp.usuario
        )
    );
  }
}
