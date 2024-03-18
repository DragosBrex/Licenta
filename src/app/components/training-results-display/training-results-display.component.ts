import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MlModel } from '../my-models/my-models.component';
import { AppComponent } from '../../app.component';

export class DataSet {
  label: string = '';
  data: any[] = [];
  backgroundColor: any;
}

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
  datasets: DataSet[] = [];

  public chart: any;

  ngOnInit() {
    this.app.animateBody("animation-right")
    this.modelName = this.route.snapshot.paramMap.get('modelName')!;

    this.http.get<any>('http://localhost:8080/models/name=' + this.modelName).subscribe(
    (response) => {
      console.log(response)
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

      let numberOfSignals = this.model.signalsToPredict.length;
      let actualArrays = this.splitArrayIntoNParts(this.trainingActualValues, numberOfSignals);
      let predictedArrays = this.splitArrayIntoNParts(this.trainingPredictedValues, numberOfSignals);

      for(let contor=1; contor<=this.trainingActualValues.length / numberOfSignals; contor++)
        this.labels.push(contor);

      for(let i=0; i < numberOfSignals; i++)
      {
          try {
              let dataset = new DataSet;
              dataset.label = "Actual: " + this.model.signalsToPredict[i];
              dataset.data = actualArrays[i];
              dataset.backgroundColor = this.generateRandomColorActual();
              console.log(dataset)

              this.datasets.push(dataset)
          } catch (error) {
            console.log(error);
          }
      }

      for(let i=0; i < numberOfSignals; i++)
      {
          try {
              let dataset = new DataSet;
              dataset.label = "Prediction: " + this.model.signalsToPredict[i];
              dataset.data = predictedArrays[i];
              dataset.backgroundColor = this.generateRandomColorPrediction();
              console.log(dataset)

              this.datasets.push(dataset)
          } catch (error) {
            console.log(error);
          }
      }

      
    });

    setTimeout(() => {
      this.createChart(this.labels, this.datasets)
    }, 100);
    
  }

  createChart(labels: number[], datasets: any[]){
    this.chart = new Chart("resultsChart", {
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

  generateRandomColorActual(): string {
    const red = Math.floor(Math.random() * 512); 
    const green = 0;
    const blue = 0;
  
    const color = `rgb(${red}, ${green}, ${blue})`;
  
    return color;
  }

  generateRandomColorPrediction(): string {
    const red = 100; 
    const green = 0;
    const blue = Math.floor(Math.random() * 256);
  
    const color = `rgb(${red}, ${green}, ${blue})`;
  
    return color;
  }

  splitArrayIntoNParts<T>(array: T[], n: number): T[][] {
    const result: T[][] = [];
    const len = array.length;
    const partSize = Math.ceil(len / n);
    
    for (let i = 0; i < len; i += partSize) {
        result.push(array.slice(i, i + partSize));
    }
    
    return result;
}

  returnToMyModels(): void {
    this.router.navigate(['/my-models']);
  }

}
