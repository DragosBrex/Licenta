import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { AppComponent } from '../../app.component';
import { MlModel } from '../my-models/my-models.component';

@Component({
  selector: 'app-prediction-results-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prediction-results-display.component.html',
  styleUrl: './prediction-results-display.component.css'
})
export class PredictionResultsDisplayComponent {

  showChart: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private app: AppComponent) {}

  model: MlModel = new MlModel;
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
    this.app.animateBody("animation-down")
    this.modelName = this.route.snapshot.paramMap.get('modelName')!;

    this.http.get<any>('http://localhost:8080/models/name=' + this.modelName).subscribe(
    (response) => {
      
      this.model.name = this.modelName;
      this.model.signalsToPredict = response.signalsToPredict;
      this.model.signalsWithInfluence =  response.signalsWithInfluence;
      this.model.pastSteps = response.pastSteps;
      this.model.futureSteps = response.futureSteps;
      this.predictedValues = response.predictionResults.predictionValues;

      this.model.signalsToPredict[0] = this.model.signalsToPredict[0].substring(1);
      this.model.signalsToPredict[this.model.signalsToPredict.length - 1] = 
      this.model.signalsToPredict[this.model.signalsToPredict.length - 1].substring(0, this.model.signalsToPredict[this.model.signalsToPredict.length - 1].length - 1)

      this.model.signalsWithInfluence[0] = this.model.signalsWithInfluence[0].substring(1);
      this.model.signalsWithInfluence[this.model.signalsWithInfluence.length - 1] = 
      this.model.signalsWithInfluence[this.model.signalsWithInfluence.length - 1].substring(0, this.model.signalsWithInfluence[this.model.signalsWithInfluence.length - 1].length - 1)


      let contor = 1;
      this.predictedValues.forEach(() => this.labels.push(contor++));

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

  navigateToFileUpload(modelName: string) {
    this.router.navigate(['/file-upload', modelName]);
  };
}
