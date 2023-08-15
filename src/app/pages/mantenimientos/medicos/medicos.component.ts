import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public totalMedicos: number = 0;
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public imagenSubs!: Subscription;

  constructor(
    private medicoService: MedicoService,
    private buquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();
    this.imagenSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img: any) => {
        this.cargarMedicos();
      });
  }

  ngOnDestroy(): void {
    this.imagenSubs.unsubscribe();
  }

  cargarMedicos() {
    // this.cargando = true;
    this.medicoService
      .cargarMedicos(this.desde)
      .subscribe(({ total, medicos }) => {
        // console.log(resp);
        this.totalMedicos = total;
        if (medicos.length !== 0) {
          this.medicos = medicos;
          this.medicosTemp = medicos;
        }
        this.cargando = false;
      });
  }


  eliminarMedico(medico: Medico) {
    console.log(medico);

    Swal.fire({
      title: 'Borrar medico?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!',
    }).then((result) => {
      if (result.value) {
        this.medicoService
          .borrarMedico(medico.uuid as string)
          .subscribe((resp) => {
            this.cargarMedicos();
            Swal.fire(
              'Medico borrado!',
              `${medico.nombre} fue eliminado correctamente!`,
              'success'
            );
          });
      }
    });
  }

  buscar(termino: string) {
    // console.log(termino);
    if (termino.length === 0) {
      this.cargarMedicos();
      return;
    }
    this.buquedasService.buscar('medicos', termino).subscribe((resp: any) => {
      this.totalMedicos = resp.total;
      this.medicos = resp.medicos;
    });
  }

  // async abrirSweetAlert(){
  //   const { value } = await Swal.fire({
  //     title: 'Crear Medico',
  //     text: 'Ingrese el nombre del nuevo medico',
  //     input: 'text',
  //     // inputLabel: 'Crear Hospital',
  //     inputPlaceholder: 'Nombre del medico',
  //     showCancelButton: true
  //   })
  //   console.log(value);

  //   if(value.trim().length > 0){
  //     this.medicoService.crearMedico(value)
  //         .subscribe((resp: any) => {
  //           Swal.fire( 'Creado', resp.nombre, 'success');
  //           this.cargarMedicos();
  //         });
  //   }

  // }

  abrirModal(medico: Medico) {
    console.log(medico);
    this.modalImagenService.abrirModal(
      'medicos',
      medico.uuid || '',
      medico.img
    );
  }
}
