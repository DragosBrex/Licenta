import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MlModel } from '../my-models/my-models.component';

@Component({
  selector: 'app-training-results-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './training-results-display.component.html',
  styleUrl: './training-results-display.component.css'
})
export class TrainingResultsDisplayComponent {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  modelName: string = '';
  trainingActualValues: number[] = [];
  trainingPredictedValues: number[] = [];
  accuracyScore: number = 0;

  labels: number[] = [];

  public chart: any;

  createChart(){
  
    this.chart = new Chart("resultsChart", {
      type: 'line',

      data: {
        labels: this.labels,
	       datasets: [
          {
            label: "Actual Values",
            data: this.trainingActualValues,
            backgroundColor: 'blue'
          },
          {
            label: "Predicted Values",
            data: this.trainingPredictedValues,
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

    this.http.get<any>('http://localhost:8080/models/name=' + this.modelName).subscribe(
    (response) => {
      
      this.trainingActualValues = response.trainingTestingResults.actualValues;
      this.trainingPredictedValues = response.trainingTestingResults.predictedValues;
      this.accuracyScore = response.trainingTestingResults.accuracy;
      console.log(response.trainingTestingResults.accuracy)

      let contor = 1;
      this.trainingActualValues.forEach(() => this.labels.push(contor++));

      this.createChart();
    },
    (error) => {
      console.error('Error while returning model by name', error);
    }
    );
  }

  returnToMyModels(): void {
    this.router.navigate(['/my-models']);
  }

}
