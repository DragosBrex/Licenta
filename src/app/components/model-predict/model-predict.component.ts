import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MlModel, MyModelsComponent } from '../my-models/my-models.component';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../notification/notification.service';
import { AppComponent } from '../../app.component';

export class ModelPredictData {
  name: string = '';
  predictingDataFile: {
    name: string,
    path: string,
    size: number
  } = { name: '', path: '', size: 0 };
  selectedTimeInterval: string[] = [];
  timeSpan: number = 1;
  signalsToPredict: string[] = [];
  signalsWithInfluence: string[] = [];
  pastSteps: number = 1;
  futureSteps: number = 1;
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
  inputMinVal: number = 0;
  inputMaxVal: number = 10000;
  timeGap: number = 1;
  stiStart: string = '1';
  stiEnd: string = '10000';
  scrollStart: string = '1';
  scrollEnd: string = '10000';
  fileIndexes: string[] = [];
  modelName: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, 
    private router: Router, private notificationService: NotificationService, 
    private app: AppComponent, private myModels: MyModelsComponent) {}

  ngOnInit(){
    this.app.animateBody("animation-left")
    this.modelName = this.route.snapshot.paramMap.get('modelName')!;
    this.http.get<any>('http://localhost:8080/models/name=' + this.modelName).subscribe(
    (response) => {
      this.loadFileInfoFromEndpoint(); 
      this.modelData.name = response.name;
      this.modelData.signalsToPredict = response.signalsToPredict;
      this.modelData.signalsWithInfluence = response.signalsWithInfluence;
      this.modelData.pastSteps = response.pastSteps;
      this.modelData.futureSteps = response.futureSteps;
      this.getAllIndexesFromFile();
    },
    (error) => {
      console.error('Error while returning model by name', error);
    }
    );
  }

  rangeValueChangedLeft(): void {
    if(Number(this.scrollEnd) - Number(this.scrollStart) < this.timeGap) {
      this.scrollStart = (Number(this.scrollEnd) - this.timeGap).toString();
      const rangeMin = document.getElementById("range-min") as HTMLInputElement;
      rangeMin!.value = this.scrollStart;
    }
    else {
      const progress = document.getElementById("progress");
      progress!.style.left = (Number(this.scrollStart) / Number(this.inputMaxVal)) * 100 + "%";
    }

    this.stiStart = this.fileIndexes[Number(this.scrollStart) - 1];
  }

  rangeValueChangedRight(): void {
    if(Number(this.scrollEnd) - Number(this.scrollStart) < this.timeGap) {
      this.scrollEnd = (Number(this.scrollStart) + this.timeGap).toString();
      const rangeMax = document.getElementById("range-max") as HTMLInputElement;
      rangeMax!.value = this.scrollEnd;
    }
    else {
      const progress = document.getElementById("progress");
      progress!.style.right = 100 - (Number(this.scrollEnd) / this.inputMaxVal) * 100 + "%";
    }

    this.stiEnd = this.fileIndexes[Number(this.scrollEnd) - 1];
  }

  getAllIndexesFromFile(): void {
    this.predictingFileID = sessionStorage.getItem("predictingFileID")!;
    this.http.get<any>('http://localhost:8080/files/indexes/' + this.predictingFileID).subscribe(
      (response) => {
          this.fileIndexes = response;
          this.inputMinVal = 1;
          this.inputMaxVal = response.length;
          this.scrollStart = '1';
          this.scrollEnd = (response.length).toString();

          this.stiStart = this.fileIndexes[Number(this.scrollStart) - 1];
          this.stiEnd = this.fileIndexes[Number(this.scrollEnd) - 1];
      },
      (error) => {
        console.error('Error while reading file information', error);
      }
    );
  }

  loadFileInfoFromEndpoint(): void {
    this.predictingFileID = sessionStorage.getItem("predictingFileID")!;
    
    this.http.get<any>('http://localhost:8080/files/' + this.predictingFileID).subscribe(
    (response) => {
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
    this.modelData.selectedTimeInterval.push(this.stiStart);
    this.modelData.selectedTimeInterval.push(this.stiEnd);

    let sigToPredict = this.transformArrayIntoString(this.modelData.signalsToPredict)
    let sigWithInfluence = this.transformArrayIntoString(this.modelData.signalsWithInfluence)

    const model = {
      name: this.modelData.name,
      predictingDataFile: {
        name: this.modelData.predictingDataFile.name,
        path: this.modelData.predictingDataFile.path,
        size: this.modelData.predictingDataFile.size
      },
      selectedTimeInterval: this.modelData.selectedTimeInterval,
      timeSpan: this.modelData.timeSpan,
      signalsToPredict: sigToPredict.split(',').map((s) => s.trim()),
      signalsWithInfluence: sigWithInfluence.split(',').map((s) => s.trim()),
      pastSteps: this.modelData.pastSteps,
    };

    this.router.navigate(['/my-models']);

    this.notificationService.createInfoNotification(model,'<i>Data is being processed..</i>');

    this.predictAsync(model)
      .then((response) => {
        this.notificationService.closeNotification(model);
        this.notificationService.createSuccesNotification(model, '<i>Predictions have been made successfully!</i>');
        this.myModels.loadModels();
      })
      .catch((error) => {
        console.error('Error while predicting using the model', error);
      })
      .finally(() => {

      });
  }

  async predictAsync(model: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.post<any>('http://localhost:8080/models/predict', model)
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
}
