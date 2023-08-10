import { Component } from '@angular/core';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public labels1: string[] = [
    'Pan',
    'Refrescos',
    'Tacos',
  ];
  public data1: number[]= [200, 350, 300];
}
