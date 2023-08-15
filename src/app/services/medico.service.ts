import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Medico } from '../models/medico.model';
import { CargarMedicos } from '../interfaces/cargar-medicos.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(
    private http: HttpClient,
  ) { }

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


  cargarMedicos(desde: number = 0) {
    return this.http
      .get<CargarMedicos>(`${base_url}/medicos?from=${desde}`, this.headers)
      .pipe(
        // delay(5000),
        map((resp) => {
          const medicos = resp.medicos.map(
            (medico: Medico) =>
              new Medico(
                medico.nombre,
                medico.uuid,
                medico.img,
                medico.usuario,
                medico.hospital
              )
          );

          return {
            total: resp.total,
            medicos,
          };
        })
      );
  }

  obtenerMedicoPorId(id: string) {
    return this.http
      .get(`${base_url}/medicos/${id}`, this.headers)
      .pipe(
        // delay(5000),
        map((resp: any) => {
          return resp.medico
        })
      );
  }

  crearMedico(medico: any) {
    const url = `${base_url}/medicos`;
    return this.http.post(url, medico, this.headers);
  }

  actualizarMedico( uuid: string, data: { 
    nombre: string;
    hospital: string;
    img: string | undefined} 
    ) {
    const url = `${base_url}/medicos/${uuid}`;
    return this.http.put(url, data, this.headers);
  }

  borrarMedico(uuid: string){
    console.log('Eliminando medico');
    const url = `${base_url}/medicos/${uuid}`;
    return this.http.delete(url, this.headers);
  }

}
