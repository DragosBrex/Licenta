import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export class MlModel {
  name: string = '';
  signalsToPredict: string[] = [];
  signalsWithInfluence: string[] = [];
  pastSteps: number = 0;
  futureSteps: number = 0;
  algorithm: string = '';
}

@Component({
  selector: 'app-my-models',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-models.component.html',
  styleUrl: './my-models.component.css'
})
export class MyModelsComponent {

  models: MlModel[] = [];
  //mlModel: MlModel = new MlModel;

  constructor(private http: HttpClient, private router: Router ) {};

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/models/all').subscribe(
      (response) => {
        console.log("Received models: ", response);

        response.forEach((model) => {if(model.name != '') 
        {
          const mlModel: MlModel = new MlModel;
          mlModel.name = model.name,
          mlModel.signalsToPredict = model.signalsToPredict,
          mlModel.signalsWithInfluence = model.signalsWithInfluence,
          mlModel.pastSteps = model.pastSteps,
          mlModel.futureSteps = model.futureSteps,
          mlModel.algorithm = model.algorithm,
          this.models.push(mlModel)}})
        console.log(this.models)
      },
      (error) => {
        console.error('Error while receiving models', error);
      }
    );
  }

  navigateToFileUpload(model: MlModel) {
    localStorage.setItem('modelForPredicting', JSON.stringify(model));
    this.router.navigate(['/file-upload', model.name]);
  };

}