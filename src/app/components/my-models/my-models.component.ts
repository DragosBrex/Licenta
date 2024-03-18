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
  incomingModels: any[] = [];
  //mlModel: MlModel = new MlModel;

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private app: AppComponent) {};

  openDialog(model: MlModel) {
    this.dialog.open(ModelInfoComponent, {data: model});
  }

  ngOnInit() {
    this.app.changeActiveNavPage("my-models");
    this.app.animateBody("animation-right");
    this.loadModels();

    const item = localStorage.getItem('incomingModels');
    if(item == null) {
      this.incomingModels = [];
    }
    else {
      this.incomingModels = JSON.parse(item);
    }

    // let model = new MlModel;
    // model.name = "testing";
    // this.createIncommingModel(model)
  }

  transformStringIntoArray(str: string): any[] {
    if(str == null)
      return [];

    str = str.trim().replace(/^"(.*)"$/, '$1');
    const array = str.split(',').map(item => item.trim());

    return array;
  }


  createIncommingModel(model: any) {
    const item = localStorage.getItem('incomingModels');
    if(item == null) {
      this.incomingModels = [];
      this.incomingModels.push(model)
      localStorage.setItem('incomingModels',JSON.stringify(this.incomingModels))
    }
    else {
      this.incomingModels = JSON.parse(item);
      this.incomingModels.push(model)
      localStorage.setItem('incomingModels',JSON.stringify(this.incomingModels))
    }    
  }

  deleteIncomingModel(model: any) {
    let modelToDelete;
    const item = localStorage.getItem('incomingModels');
    if(item != null) {
      this.incomingModels = JSON.parse(item);

      this.incomingModels.forEach((item) => {
        if(item.name == model.name)
          modelToDelete = item;
      })
      
      const index = this.incomingModels.indexOf(modelToDelete);
      if (index > -1) {
          console.log("Am intrat unde trebuie")
          this.incomingModels.splice(index, 1);
      }

      localStorage.setItem('incomingModels',JSON.stringify(this.incomingModels))
      window.location.reload();
    } 
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
      },
      (error) => {
        console.error('Error while receiving models', error);
      }
    );
  }

  refresh () {
    window.location.reload();
  }

  navigateToFileUpload(model: MlModel) {
    localStorage.setItem('modelForPredicting', JSON.stringify(model));
    this.router.navigate(['/file-upload', model.name]);
  };

}
