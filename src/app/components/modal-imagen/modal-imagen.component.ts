import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent {

  public imagenSubir!: File;
  public imgTemp: any = '';

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService){}


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
        // console.log(reader.result);
        this.imgTemp = reader.result;
      } 
    }
  }

  cerrarModal(){
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  subirImagen() {
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then((img: any) => {
        // this.usuario.img = img;
        Swal.fire(
          'Foto de Perfil Actualizada',
          'La foto de perfil de usuario ha sido actualizada',
          'success'
        );
        this.modalImagenService.nuevaImagen.next(img);
        this.cerrarModal();
      }).catch((err) => {
        console.log(err);
        Swal.fire('Error', err.error.msg, 'error')    
    });
  }

}
