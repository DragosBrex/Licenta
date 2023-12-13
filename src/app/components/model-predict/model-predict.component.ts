import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MlModel } from '../my-models/my-models.component';
import { CommonModule } from '@angular/common';

export class ModelPredictData {
  name: string = '';
  predictingDataFile: {
    name: string,
    path: string,
    size: number
  } = { name: '', path: '', size: 0 };
  selectedTimeInterval: string[] = [];
  timeSpan: number = 0;
  signalsToPredict: string = '';
  signalsWithInfluence: string = '';
  pastSteps: number = 0;
}

@Component({
  selector: 'app-model-predict',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './model-predict.component.html',
  styleUrl: './model-predict.component.css'
})
export class ModelPredictComponent {
  modelData: ModelPredictData = new ModelPredictData();
  model: MlModel = new MlModel;
  predictingFileID: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(){
    this.loadFileInfoFromEndpoint();
    this.model = JSON.parse(localStorage.getItem("modelForPredicting")!);
    this.modelData.name = this.model.name;
    this.modelData.signalsToPredict = this.transformArrayIntoString(this.model.signalsToPredict);
    this.modelData.signalsWithInfluence = this.transformArrayIntoString(this.model.signalsWithInfluence);
    this.modelData.pastSteps = this.model.pastSteps
  };

  loadFileInfoFromEndpoint(): void {
    this.predictingFileID = sessionStorage.getItem("predictingFileID")!;
    
    this.http.get<any>('http://localhost:8080/files/' + this.predictingFileID).subscribe(
    (response) => {
      console.log('File information read successfully', response);
      this.modelData.predictingDataFile.name = response.name;
      this.modelData.predictingDataFile.path = response.path;
      this.modelData.predictingDataFile.size = response.size;
    },
    (error) => {
      console.error('Error while reading file information', error);
    }
  );
  }

  transformArrayIntoString(array: string[]): string {
    var finalString = '"';
    array.forEach(signal => finalString = finalString + signal.split('"').join('') + ", ");
    finalString = finalString.substring(0,finalString.length - 2);
    finalString = finalString + '"';

    return finalString;
  }

  predictUsingModel(): void {
    const model = {
      name: this.modelData.name,
      predictingDataFile: {
        name: this.modelData.predictingDataFile.name,
        path: this.modelData.predictingDataFile.path,
        size: this.modelData.predictingDataFile.size
      },
      selectedTimeInterval: this.modelData.selectedTimeInterval,
      timeSpan: this.modelData.timeSpan,
      signalsToPredict: this.modelData.signalsToPredict.split(',').map((s) => s.trim()),
      signalsWithInfluence: this.modelData.signalsWithInfluence.split(',').map((s) => s.trim()),
      pastSteps: this.modelData.pastSteps,
    };

    console.log(model);

    this.http.post<any>('http://localhost:8080/models/predict', model).subscribe(
      (response) => {
        console.log('Model predicted successfully', response);
        localStorage.setItem('predictedValues', response.predictedValues);

        this.router.navigate(['prediction-results/', model.name]);
      },
      (error) => {
        console.error('Error while predicting the model', error);
      }
    );
  }
}
