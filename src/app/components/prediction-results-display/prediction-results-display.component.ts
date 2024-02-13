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

  showChart: boolean = true;

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

    this.http.get<any>('http://localhost:8080/models/name=' + this.modelName).subscribe(
    (response) => {
      try {
          this.predictedValues = response.predictionResults.predictionValues;
      
          console.log("Predicted Values: ", this.predictedValues);
      
          this.predictedValues.forEach(number => this.labels.push(this.predictedValues.indexOf(number)));
      
          this.createChart();
      } catch (error) {
        this.showChart = false;
      }
      
    },
    (error) => {
      console.error('Error while returning model by name', error);
    }
    );
  }

  returnToMyModels(): void {
    this.router.navigate(['/my-models']);
  }

  navigateToFileUpload(modelName: string) {
    this.router.navigate(['/file-upload', modelName]);
  };
}
