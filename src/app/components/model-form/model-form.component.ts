import { Component, Renderer2, ViewChild, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, convertToParamMap } from '@angular/router';
import { MlModel, MyModelsComponent } from '../my-models/my-models.component';
import { NotificationService } from '../notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { DataPreviewComponent } from '../data-preview/data-preview.component';
import { _isNumberValue } from '@angular/cdk/coercion';
import { AppComponent } from '../../app.component';

export class ModelFormData {
  name: string = '';
  trainingAndTestingDataFile: {
    name: string,
    path: string,
    size: number
  } = { name: '', path: '', size: 0 };
  selectedTimeInterval: string[] = [];
  timeSpan: number = 1;
  timeDependency: boolean = false;
  signalsToPredict: string = '';
  signalsWithInfluence: string = '';
  pastSteps: number = 1;
  futureSteps: number = 1;
  trainTestSplit: number = 0.1;
  algorithm: string = 'ALGORITHM1';
  epochs: number = 1;
}

@Component({
  selector: 'app-model-form',
  standalone: true,
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.css'],
  imports: [FormsModule, CommonModule]
})
export class ModelFormComponent {
  modelData: ModelFormData = new ModelFormData();
  trainingFileID: string = "";
  columns: string[] = [];
  columnsPredict: string[] = [];
  columnsInfluence: string[] = [];
  selectedSignalsToPredict: string[] = [];
  selectedSignalsWithInfluence: string[] = [];
  selectedPredict: string = '';
  selectedInfluence: string = '';
  inputMinVal: number = 0;
  inputMaxVal: number = 10000;
  timeGap: number = 3;
  stiStart: string = '1';
  stiEnd: string = '10000';
  scrollStart: string = '1';
  scrollEnd: string = '10000';
  fileIndexes: string[] = [];
  nameInvalid: boolean = false;
  signalsToPredictInvalid: boolean = false;
  signalsWithInfluenceInvalid: boolean = false;
  canBeTrained: boolean = true;
  correlationAnimation: boolean = false;
  allModelNames: string[] = [];
  nameError: boolean = false;
  

  constructor(private http: HttpClient, 
    private router: Router, 
    private notificationService: NotificationService, 
    private dialog: MatDialog, 
    private app: AppComponent,
    private myModels: MyModelsComponent
    ) {}

  ngOnInit() {
    this.app.changeActiveNavPage("create-model");
    this.app.animateBody("animation-left")
    this.loadColumnsFromEndpoint();
    this.loadFileInfoFromEndpoint();
    this.getAllIndexesFromFile();
    this.readAllModels();
  }

  openDialog(toPredict: string) {
    switch(toPredict) {
      case "predict":
        this.dialog.open(DataPreviewComponent, {data: [this.trainingFileID, this.selectedSignalsToPredict]});
        break;
      case "influence":
        this.dialog.open(DataPreviewComponent, {data: [this.trainingFileID, this.selectedSignalsWithInfluence]});
        break;
    }
  }

  readAllModels() {
    this.http.get<any[]>('http://localhost:8080/models/all').subscribe(
      (response) => {
        response.forEach((item) => {
          this.allModelNames.push(item.name)
        })
      },
      (error) => {
        console.error('Error while reading all models', error);
      }
    );
  }

  checkModelName() {
    if(this.allModelNames.includes((this.modelData.name))) {
      this.nameError = true;
    }
    else {
      this.nameError = false;
    }
  }

  getCorrelationData() {
    this.correlationAnimation = true;

    const correlationData = {
      filePath: this.modelData.trainingAndTestingDataFile.path,
      signalsToPredict: this.transformArrayIntoString(this.selectedSignalsToPredict).replace(/,/g, '')
    };
  
    this.getCorrelationDataAsync(correlationData)
      .then(response => {
        console.log(response) //ASta trebuie sa il stergi mai tarziu
        this.correlationAnimation = false;
  
        this.selectedSignalsWithInfluence = [];
  
        this.columns.forEach((value) => {
          if (response!.toString().includes(value.toString())) {
            this.selectedSignalsWithInfluence.push(value);
            this.columnsInfluence.splice(this.columnsInfluence.indexOf(value), 1);
          }
        });
      })
      .catch(error => {
        console.error('Error returning correlation vector', error);
      });
  }
  
  getCorrelationDataAsync(correlationData: any) {
    return new Promise((resolve, reject) => {
      this.http.post<any>('http://localhost:8080/models/correlation', correlationData).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
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

  
  inputValueChangedLeft() {
    if(this.stiStart == '')
      this.scrollStart = this.inputMinVal.toString();
    else {
      this.scrollStart = this.stiStart;
      const progress = document.getElementById("progress");
      progress!.style.left = (Number(this.scrollStart) / Number(this.inputMaxVal)) * 100 + "%";
    }
  }

  inputValueChangedRight() {
    if(this.stiEnd == '') {
      this.scrollEnd = this.inputMaxVal.toString();
      const progress = document.getElementById("progress");
      progress!.style.right = 100 - (Number(this.scrollEnd) / this.inputMaxVal) * 100 + "%";
    }
    else {
      this.scrollEnd = this.stiEnd;
      const progress = document.getElementById("progress");
      progress!.style.right = 100 - (Number(this.scrollEnd) / this.inputMaxVal) * 100 + "%";
    }
  }
  
  fixInputLeftWithTimeGap() {
    if(Number(this.stiEnd) - Number(this.stiStart) < this.timeGap) 
      this.stiStart = (Number(this.stiEnd) - this.timeGap).toString()
  }

  fixInputRightWithTimeGap() {
    if(Number(this.stiEnd) - Number(this.stiStart) < this.timeGap) {
      this.stiEnd = (Number(this.stiStart) + this.timeGap).toString()
     } 
  }
  
  loadColumnsFromEndpoint(): void {
    this.trainingFileID = sessionStorage.getItem("trainingFileID")!;
    
    this.http.get<string[]>('http://localhost:8080/files/columns/' + this.trainingFileID).subscribe(
    (response) => {
      this.columnsPredict = [...response];
      this.columnsInfluence = [...response];
      this.columns = [...response];
    },
    (error) => {
      console.error('Error while reading column names', error);
    }
  );
  }

  updateSelectedSignalsToPredictList(): void {
    if(!this.selectedSignalsToPredict.includes(this.selectedPredict) && this.selectedPredict != '' && this.selectedPredict !='default') {
      this.selectedSignalsToPredict.push(this.selectedPredict)
      this.selectedSignalsWithInfluence.push(this.selectedPredict)
      this.columnsPredict.splice(this.columnsPredict.indexOf(this.selectedPredict, 0), 1);
      this.columnsInfluence.splice(this.columnsInfluence.indexOf(this.selectedPredict, 0), 1);
    }

    this.changeClass('sToPredict');
  }

  updateSelectedSignalsWithInfluenceList(): void {
    if(!this.selectedSignalsWithInfluence.includes(this.selectedInfluence) && this.selectedInfluence != '' && this.selectedInfluence !='default') {
      this.selectedSignalsWithInfluence.push(this.selectedInfluence)
      this.columnsInfluence.splice(this.columnsInfluence.indexOf(this.selectedInfluence, 0), 1);
    }

    this.changeClass('sWithInfluence');

    console.log("Data with influence: ", this.selectedSignalsWithInfluence);
  }

  transformArrayIntoString(array: string[]): string {
    var finalString = '"';
    array.forEach(signal => finalString = finalString + signal + ", ");
    finalString = finalString.substring(0,finalString.length - 2);
    finalString = finalString + '"';

    return finalString;
  }

  deleteSignalFromList(listName: string, signalName: string): void {
    if(listName === 'selectedSignalsToPredict') {
      this.selectedSignalsToPredict.splice(this.selectedSignalsToPredict.indexOf(signalName, 0), 1);
      //this.selectedSignalsWithInfluence.splice(this.selectedSignalsWithInfluence.indexOf(signalName), 1);

      if(!this.columnsPredict.includes(signalName))
        this.columnsPredict.unshift(signalName);

      this.selectedPredict = 'default';

      console.log("Data to predict: ", this.selectedSignalsToPredict);
      //console.log("Data with influence: ", this.selectedSignalsWithInfluence);
    }
    else if(listName === 'selectedSignalsWithInfluence') {
      this.selectedSignalsWithInfluence.splice(this.selectedSignalsWithInfluence.indexOf(signalName, 0), 1);

      if(!this.columnsInfluence.includes(signalName))
        this.columnsInfluence.unshift(signalName);

      this.selectedInfluence = 'default';

      console.log("Data with influence: ", this.selectedSignalsWithInfluence);
    }
  }

  loadFileInfoFromEndpoint(): void {
    this.trainingFileID = sessionStorage.getItem("trainingFileID")!;
    
    this.http.get<any>('http://localhost:8080/files/' + this.trainingFileID).subscribe(
    (response) => {
      this.modelData.trainingAndTestingDataFile.name = response.name;
      this.modelData.trainingAndTestingDataFile.path = response.path;
      this.modelData.trainingAndTestingDataFile.size = response.size;
    },
    (error) => {
      console.error('Error while reading file information', error);
    }
  );
  }

  getAllIndexesFromFile(): void {
    this.http.get<any>('http://localhost:8080/files/indexes/' + this.trainingFileID).subscribe(
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

  submitForm() {
    if (this.modelData.name == '') {
      this.nameInvalid = true;
    }
    if (this.selectedSignalsToPredict.length == 0) {
      this.signalsToPredictInvalid = true;
    }
    if (this.selectedSignalsWithInfluence.length == 0) {
      this.signalsWithInfluenceInvalid = true;
    }

    if(!this.nameInvalid && !this.signalsToPredictInvalid && !this.signalsWithInfluenceInvalid && !this.nameError)
     this.trainAndTestModel();
  }

  changeClass(name: string) {
    switch(name) {
      case "name":
        this.nameInvalid = false;
        break;
      case "sToPredict":
        this.signalsToPredictInvalid = false;
        this.signalsWithInfluenceInvalid = false;
        break;
      case "sWithInfluence":
        this.signalsWithInfluenceInvalid = false;
        break;
    }
  }

  trainAndTestModel(): void {
    this.modelData.selectedTimeInterval.push(this.stiStart);
    this.modelData.selectedTimeInterval.push(this.stiEnd);
  
    this.modelData.signalsToPredict = this.transformArrayIntoString(this.selectedSignalsToPredict);
    this.modelData.signalsWithInfluence = this.transformArrayIntoString(this.selectedSignalsWithInfluence);

    const model = {
      name: this.modelData.name,
      trainingAndTestingDataFile: {
        name: this.modelData.trainingAndTestingDataFile.name,
        path: this.modelData.trainingAndTestingDataFile.path,
        size: this.modelData.trainingAndTestingDataFile.size
      },
      selectedTimeInterval: this.modelData.selectedTimeInterval,
      timeSpan: this.modelData.timeSpan,
      timeDependency: this.modelData.timeDependency,
      signalsToPredict: this.modelData.signalsToPredict.split(',').map((s) => s.trim()),
      signalsWithInfluence: this.modelData.signalsWithInfluence.split(',').map((s) => s.trim()),
      pastSteps: this.modelData.pastSteps,
      futureSteps: this.modelData.futureSteps,
      trainTestSplit: this.modelData.trainTestSplit,
      algorithm: this.modelData.algorithm,
      epochs: this.modelData.epochs,
    };
  
    console.log(model);
  
    this.router.navigate(['/home']);

    this.notificationService.createInfoNotification(model,'<i>Your model is being trained..<i>');
    this.myModels.createIncommingModel(model);

    this.trainAndTestAsync(model)
      .then((response) => {
        console.log(response);
        this.notificationService.closeNotification(model);
        this.notificationService.createSuccesNotification(model, "<i>Your model was trained successfully! \nCheck <a href='my-models'>My Models</a> for more information.</i>");
        this.myModels.deleteIncomingModel(model);
      })
      .catch((error) => {
        console.error('Error while training and testing the model', error);
      })
      .finally(() => {

      });
  }
  
  async trainAndTestAsync(model: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.post<any>('http://localhost:8080/models/train', model)
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
