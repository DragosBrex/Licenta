import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule} from '@angular/material/dialog'
import { ModelInfoComponent } from '../model-info/model-info.component';
import { AppComponent } from '../../app.component';

export class MlModel {
  name: string = '';
  signalsToPredict: string[] = [];
  signalsWithInfluence: string[] = [];
  pastSteps: number = 0;
  futureSteps: number = 0;
  algorithm: string = '';
  predictionResults: string[] = [];
}

@Component({
  selector: 'app-my-models',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './my-models.component.html',
  styleUrl: './my-models.component.css'
})

@Injectable({
  providedIn: 'root',
})
export class MyModelsComponent {

  models: MlModel[] = [];
  //mlModel: MlModel = new MlModel;

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private app: AppComponent) {};

  openDialog(model: MlModel) {
    this.dialog.open(ModelInfoComponent, {data: model});
  }

  ngOnInit() {
    this.app.changeActiveNavPage("my-models");
    this.app.animateBody("animation-right");
    this.loadModels();
  }

  loadModels() {
    this.http.get<any[]>('http://localhost:8080/models/all').subscribe(
      (response) => {
        response.forEach((model) => {if(model.name != '') 
        {
          const mlModel: MlModel = new MlModel;
          mlModel.name = model.name,
          mlModel.signalsToPredict = model.signalsToPredict,
          mlModel.signalsWithInfluence = model.signalsWithInfluence,
          mlModel.pastSteps = model.pastSteps,
          mlModel.futureSteps = model.futureSteps,
          mlModel.algorithm = model.algorithm,

          mlModel.signalsToPredict[0] = mlModel.signalsToPredict[0].substring(1);
          mlModel.signalsToPredict[mlModel.signalsToPredict.length - 1] = 
          mlModel.signalsToPredict[mlModel.signalsToPredict.length - 1].substring(0, mlModel.signalsToPredict[mlModel.signalsToPredict.length - 1].length - 1)

          mlModel.signalsWithInfluence[0] = mlModel.signalsWithInfluence[0].substring(1);
          mlModel.signalsWithInfluence[mlModel.signalsWithInfluence.length - 1] = 
          mlModel.signalsWithInfluence[mlModel.signalsWithInfluence.length - 1].substring(0, mlModel.signalsWithInfluence[mlModel.signalsWithInfluence.length - 1].length - 1)

          mlModel.predictionResults = model.predictionResults;

          this.models.push(mlModel)
        }})

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
