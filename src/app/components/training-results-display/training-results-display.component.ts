import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
    console.log(this.modelName);

    localStorage.getItem('trainingActualValues')!.split(",").forEach(number => this.trainingActualValues.push(Number(number)));
    localStorage.getItem('trainingPredictedValues')!.split(",").forEach(number => this.trainingPredictedValues.push(Number(number)));

    this.trainingActualValues.forEach(number => this.labels.push(this.trainingActualValues.indexOf(number)));

    this.createChart();
  }

  returnToHomePage(): void {
    this.router.navigate(['home']);
  }

  deleteModel(): void {
    this.http.delete<any>('http://localhost:8080/models/deleteName/' + this.modelName).subscribe(
      (response) => {
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error while deleting the model', error);
      }
    );
  }
}
