import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Route } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { AppComponent } from '../../app.component';
import { MlModel } from '../my-models/my-models.component';

export class DataSet {
  label: string = '';
  data: any[] = [];
  backgroundColor: any;
}

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
  datasets: DataSet[] = [];

  public chart: any;

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


      let numberOfSignals = this.model.signalsToPredict.length;
      let predictedArrays = this.splitArrayIntoNParts(this.predictedValues, numberOfSignals);

      for(let contor=1; contor<=this.predictedValues.length / numberOfSignals; contor++)
        this.labels.push(contor);

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
    },
    (error) => {
      console.error('Error while returning model by name', error);
    });

    setTimeout(() => {
      this.createChart(this.labels, this.datasets)
    }, 100);
  }

  returnToMyModels(): void {
    this.router.navigate(['/my-models']);
  }

  navigateToFileUpload(modelName: string) {
    this.router.navigate(['/file-upload', modelName]);
  };
}
