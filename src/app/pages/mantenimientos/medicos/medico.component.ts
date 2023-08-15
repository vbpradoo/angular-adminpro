import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado!: Hospital | undefined;
  public medicoSeleccionado!: Medico;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges.subscribe((hospitalId) => {
      console.log(hospitalId);
      this.hospitalSeleccionado = this.hospitales.find(
        (hosp) => hosp.uuid === hospitalId
      );
      console.log(this.hospitalSeleccionado);
    });
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales().subscribe((resp: any) => {
      console.log(resp);
      this.hospitales = resp.hospitales;
    });
  }

  // actualizarMedico(medico: Medico) {
  //   console.log(medico);
  //   this.medicoService
  //     .actualizarMedico(medico.uuid as string, medico.nombre)
  //     .subscribe((resp) => {
  //       Swal.fire('Actualizado', medico.nombre, 'success');
  //     });
  // }

  cargarMedico(id: string) {
    if (id === 'nuevo') {
      return;
    }
    this.medicoService.obtenerMedicoPorId(id)
        .pipe(
          delay(100)
          )
        .subscribe((medico) => {
          if (!medico) {
            this.router.navigateByUrl(`/dashboard/medicos`);
          }
          console.log(medico);
          const { nombre, hospital: { _id } } = medico;
          this.medicoSeleccionado = medico;
          this.medicoForm.setValue({ nombre: nombre, hospital: _id });
        });
  }

  guardarMedico() {
    if (this.medicoSeleccionado) {
      //Actualizar
      const data = {
        ...this.medicoForm.value,
        // _id: this.medicoSeleccionado.uuid
      };
      this.medicoService
        .actualizarMedico(this.medicoSeleccionado.uuid as string, data)
        .subscribe((resp: any) => {
          Swal.fire(
            'Actualizado',
            `${resp.medico.nombre} actualizado correctamente`,
            'success'
          );
        });
    } else {
      //Crear
      this.medicoService
        .crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          Swal.fire(
            'Creado',
            `${resp.medico.nombre} creado correctamente`,
            'success'
          );
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico.uuid}`);
        });
    }
    // console.log(this.medicoForm.value);
  }
}
