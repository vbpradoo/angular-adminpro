import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [];
  //   {
  //     titulo: 'Dashboard',
  //     icono:  'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Main', url: '/'},
  //       { titulo: 'Graficas', url: 'grafica1'},
  //       { titulo: 'Promesas', url: 'promesas'},
  //       { titulo: 'ProgressBar', url: 'progress'},
  //       { titulo: 'RxJs', url: 'rxjs'},
  //     ]

  //   },
  //   {
  //     titulo: 'Mantenimientos',
  //     icono:  'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuarios', url: 'usuarios'},
  //       { titulo: 'Hospitales', url: 'hospitales'},
  //       { titulo: 'Medicos', url: 'medicos'},
  //     ]

  //   }
  // ];

  cargarMenu(){
    this.menu = JSON.parse((localStorage.getItem('menu') as any)) || [];

    // if(this.menu.length)
  }

  constructor() { }
}
