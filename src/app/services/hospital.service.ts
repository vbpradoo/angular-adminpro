import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Hospital } from '../models/hospital.model';
import { map } from 'rxjs';
import { CargarHospitales } from '../interfaces/cargar-hospitales.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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


  cargarHospitales(desde: number = 0) {
    return this.http
      .get<CargarHospitales>(`${base_url}/hospitales?from=${desde}`, this.headers)
      .pipe(
        // delay(5000),
        map((resp) => {
          const hospitales = resp.hospitales.map(
            (hospital: Hospital) =>
              new Hospital(
                hospital.nombre,
                hospital.uuid,
                hospital.img,
                hospital.usuario
              )
          );

          return {
            total: resp.total,
            hospitales,
          };
        })
      );
  }

  crearHospital(nombre: string) {
    const url = `${base_url}/hospitales`;
    return this.http.post(url, { nombre }, this.headers);
  }

  actualizarHospital( uuid: string, nombre: string) {
    const url = `${base_url}/hospitales/${uuid}`;
    return this.http.put(url, { nombre }, this.headers);
  }

  borrarHospital(uuid: string){
    console.log('Eliminando hospital');
    const url = `${base_url}/hospitales/${uuid}`;
    return this.http.delete(url, this.headers);
  }

}
