import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MlModel } from '../my-models/my-models.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-training-results-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './training-results-display.component.html',
  styleUrl: './training-results-display.component.css'
})
export class TrainingResultsDisplayComponent {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private app: AppComponent) {}

  model: MlModel = new MlModel;
  modelName: string = '';
  trainingActualValues: number[] = [];
  trainingPredictedValues: number[] = [];
  accuracyScore: number = 0;

  labels: number[] = [];

  public chart: any;

  ngOnInit() {
    this.app.animateBody("animation-right")
    this.modelName = this.route.snapshot.paramMap.get('modelName')!;

    this.http.get<any>('http://localhost:8080/models/name=' + this.modelName).subscribe(
    (response) => {
      
      this.model.name = this.modelName;
      this.model.signalsToPredict = response.signalsToPredict;
      this.model.signalsWithInfluence =  response.signalsWithInfluence;
      this.model.pastSteps = response.pastSteps;
      this.model.futureSteps = response.futureSteps;
      this.trainingActualValues = response.trainingTestingResults.actualValues;
      this.trainingPredictedValues = response.trainingTestingResults.predictedValues;

      this.model.signalsToPredict[0] = this.model.signalsToPredict[0].substring(1);
      this.model.signalsToPredict[this.model.signalsToPredict.length - 1] = 
      this.model.signalsToPredict[this.model.signalsToPredict.length - 1].substring(0, this.model.signalsToPredict[this.model.signalsToPredict.length - 1].length - 1)

      this.model.signalsWithInfluence[0] = this.model.signalsWithInfluence[0].substring(1);
      this.model.signalsWithInfluence[this.model.signalsWithInfluence.length - 1] = 
      this.model.signalsWithInfluence[this.model.signalsWithInfluence.length - 1].substring(0, this.model.signalsWithInfluence[this.model.signalsWithInfluence.length - 1].length - 1)

      this.accuracyScore = response.trainingTestingResults.accuracy;

      let contor = 1;
      this.trainingActualValues.forEach(() => this.labels.push(contor++));

      this.createChart();
    },
    (error) => {
      console.error('Error while returning model by name', error);
    }
    );
  }

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

  returnToMyModels(): void {
    this.router.navigate(['/my-models']);
  }

}
