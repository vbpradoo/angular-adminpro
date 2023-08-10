import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartEvent, ChartType, Color } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [],
})
export class DonaComponent implements OnInit {
  @Input() titulo: string = 'Sin titulo';

  // Doughnut
  @Input('labels') doughnutChartLabels: string[] = [
    'Label 1',
    'Label 2',
    'Label 3',
  ];

  @Input('data') data: number[] = [350, 450, 100];

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: this.data, backgroundColor: ['#6857E6', '#009FEE', '#F02059'] },
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // console.log(this.data);
    // console.log(this.doughnutChartData);
    this.doughnutChartData.datasets[0].data = this.data;

  }
}
