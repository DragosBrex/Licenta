import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-prediction-results-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prediction-results-display.component.html',
  styleUrl: './prediction-results-display.component.css'
})
export class PredictionResultsDisplayComponent {
  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  modelName: string = '';
  predictedValues: number[] = [];

  labels: number[] = [];

  public chart: any;

  createChart(){
  
    this.chart = new Chart("resultsChart", {
      type: 'line',

      data: {
        labels: this.labels,
	       datasets: [
          {
            label: "Predicted Values",
            data: this.predictedValues,
            backgroundColor: 'red'
          }  
        ]
      },
      options: {
        aspectRatio:2.5
      }
      
    });
  }

  ngOnInit() {
    this.modelName = this.route.snapshot.paramMap.get('modelName')!;
    console.log(this.modelName);

    localStorage.getItem('predictedValues')!.split(",").forEach(number => this.predictedValues.push(Number(number)));

    this.predictedValues.forEach(number => this.labels.push(this.predictedValues.indexOf(number)));

    this.createChart();
  }

  returnToMyModels(): void {
    this.router.navigate(['/my-models']);
  }
}
