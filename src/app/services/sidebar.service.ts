import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Dashboard',
      icono:  'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main', url: '/'},
        { titulo: 'Graficas', url: 'grafica1'},
        { titulo: 'Promesas', url: 'promesas'},
        { titulo: 'ProgressBar', url: 'progress'},
        { titulo: 'RxJs', url: 'rxjs'},
      ]

    }
  ];

  constructor() { }
}
