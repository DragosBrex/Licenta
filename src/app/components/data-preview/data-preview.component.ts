import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Chart } from 'chart.js/auto';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export class DataSet {
  label: string = '';
  data: any[] = [];
  backgroundColor: any;
}

@Component({
  selector: 'app-data-preview',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './data-preview.component.html',
  styleUrl: './data-preview.component.css'
})

export class DataPreviewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string[], private http: HttpClient, private dialog: MatDialog) {}

  chart: any;
  labels: number[] = [];
  datasets: DataSet[] = [];


  ngOnInit() {
    this.readData().then(() => {
      setTimeout(() => {
        this.createChart(this.labels, this.datasets);
      }, 200);
    })
  }

  async readData():Promise<any> {
    for(let i=0;i<this.data[1].length;i++)
      this.http.get<number[]>('http://localhost:8080/files/column/' + this.data[0] + "/" + this.data[1][i]).subscribe(
        (response) => {
          try {
              const labels:number[] = [];
              let contor: number = 1;
              response.forEach(() => labels.push(contor++));
          
              this.labels = labels;

              let dataset = new DataSet;
              dataset.label = this.data[1][i];
              dataset.data = response;
              dataset.backgroundColor = this.generateRandomColor();
              
              this.datasets.push(dataset)
          } catch (error) {
            console.log(error);
          }
        },
        (error) => {
          console.error('Error while returning model by name', error);
        }
      );
  }

  generateRandomColor(): string {
    const red = Math.floor(Math.random() * 256); 
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
  
    const color = `rgb(${red}, ${green}, ${blue})`;
  
    return color;
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  createChart(labels: number[], datasets: any[]){
    this.chart = new Chart("chart", {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        aspectRatio: 2,
        elements: {
          line: {
            tension: 0 
          }
      }}
    });
  }
}
