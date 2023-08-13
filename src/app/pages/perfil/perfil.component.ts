import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent implements OnInit {
  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    // console.log(this.perfilForm.value);
    this.usuarioService
      .actualizarPerfil(this.perfilForm.value)
      .subscribe((resp: any) => {
        // console.log(resp);
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire(
          'Perfil Actualizado',
          'El perfil de usuario ha sido actualizado',
          'success'
        );
      }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error')
          
      });
  }

  cambiarImagen($event: any) {
    const file = $event.target.files[0];
    if (!file) {
      this.imgTemp = null;
      return;
    }
    
    if (file instanceof File) {
      // console.log(file);
      this.imagenSubir = file;
    
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        console.log(reader.result);
        this.imgTemp = reader.result;
      } 
    }
  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuarioService.uuid)
      .then((img: any) => {
        this.usuario.img = img;
        Swal.fire(
          'Foto de Perfil Actualizada',
          'La foto de perfil de usuario ha sido actualizada',
          'success'
        );
      }).catch((err) => {
        console.log(err);
        Swal.fire('Error', err.error.msg, 'error')    
    });
  }
}
