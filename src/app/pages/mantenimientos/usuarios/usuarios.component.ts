import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public imagenSubs!: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private buquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imagenSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img: any) => {
        this.cargarUsuarios();
      });
  }

  ngOnDestroy(): void {
    this.imagenSubs.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService
      .cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        if (usuarios.length !== 0) {
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
        }
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string) {
    // console.log(termino);
    if (termino.length === 0) {
      this.usuarios = this.usuariosTemp;
      return;
    }
    this.buquedasService
      .buscar('usuarios', termino)
      .subscribe((resp: any) => {
        this.totalUsuarios = resp.total;
        this.usuarios = resp.usuarios;
      });
  }

  eliminarUsuario(usuario: any) {
    // console.log(usuario);
    if (usuario.uuid === this.usuarioService.uuid) {
      Swal.fire('Error', 'No se puede borrarse a si mismo!', 'error');
      return;
    }
    // console.log('Esto no e tiene que ver');
    // return

    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!',
    }).then((result) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario(usuario).subscribe((resp) => {
          this.cargarUsuarios();
          Swal.fire(
            'Usuario borrado!',
            `${usuario.nombre} fue eliminado correctamente!`,
            'success'
          );
        });
      }
    });
  }

  cambiarRole(usuario: Usuario) {
    console.log(usuario);
    this.usuarioService.guardarUsuario(usuario).subscribe((resp: any) => {
      console.log(resp);
    });
  }

  abrirModal(usuario: Usuario) {
    console.log(usuario);
    this.modalImagenService.abrirModal(
      'usuarios',
      usuario.uuid || '',
      usuario.img
    );
  }
}
