import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy{

  public totalHospitales: number = 0;
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public imagenSubs!: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private buquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) {}

  ngOnInit(): void {
    this.cargarHospitales();
    this.imagenSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img: any) => {
        this.cargarHospitales();
      });
    }

    
  ngOnDestroy(): void {
    this.imagenSubs.unsubscribe();
  }
    
    cargarHospitales(){
    // this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde).subscribe(({ total, hospitales }) =>{
      // console.log(resp);
      this.totalHospitales = total;
      if (hospitales.length !== 0) {
        this.hospitales = hospitales;
        this.hospitalesTemp = hospitales;
      }
      this.cargando = false;
    } )

  }

  guardarCambios(hospital: Hospital){
    console.log(hospital);
    this.hospitalService.actualizarHospital((hospital.uuid as string), hospital.nombre)
          .subscribe((resp)=> {
            Swal.fire( 'Actualizado', hospital.nombre, 'success');
          });
    
  }

  eliminarHospital(hospital: Hospital){
    console.log(hospital);
    this.hospitalService.borrarHospital((hospital.uuid as string))
          .subscribe((resp)=> {
            this.cargarHospitales();
            Swal.fire( 'Borrado', hospital.nombre, 'success');
          });
    
  }

  
  buscar(termino: string) {
    // console.log(termino);
    if (termino.length === 0) {
      this.cargarHospitales();
      return;
    }
    this.buquedasService
      .buscar('hospitales', termino)
      .subscribe((resp: any) => {
        this.totalHospitales = resp.total;
        this.hospitales = resp.hospitales;
      });
  }

  async abrirSweetAlert(){
    const { value } = await Swal.fire({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      // inputLabel: 'Crear Hospital',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    })
    console.log(value);

    if(value.trim().length > 0){
      this.hospitalService.crearHospital(value)
          .subscribe((resp: any) => {
            Swal.fire( 'Creado', resp.nombre, 'success');
            this.cargarHospitales();
          });
    }
    
  }

  abrirModal(hospital: Hospital) {
    console.log(hospital);
    this.modalImagenService.abrirModal(
      'hospitales',
      hospital.uuid || '',
      hospital.img
    );
  }

}
