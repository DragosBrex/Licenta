import { Component, Renderer2, ViewChild, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MlModel } from '../my-models/my-models.component';

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
  columnsPredict: string[] = [];
  columnsInfluence: string[] = [];
  selectedSignalsToPredict: string[] = [];
  selectedSignalsWithInfluence: string[] = [];
  selectedPredict: string = '';
  selectedInfluence: string = '';
  inputMinVal: number = 0;
  inputMaxVal: number = 10000;
  timeGap: number = 1;
  stiStart: string = '1';
  stiEnd: string = '10000';
  scrollStart: string = '1';
  scrollEnd: string = '10000';
  fileIndexes: string[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  //@ViewChild(AppComponent) appComponent!: AppComponent; 

  ngOnInit() {
    this.loadColumnsFromEndpoint();
    this.loadFileInfoFromEndpoint();
    this.getAllIndexesFromFile();
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
  
  loadColumnsFromEndpoint(): void {
    this.trainingFileID = sessionStorage.getItem("trainingFileID")!;
    
    this.http.get<string[]>('http://localhost:8080/files/columns/' + this.trainingFileID).subscribe(
    (response) => {
      console.log('Columns gathered successfully', response);
      this.columnsPredict = [...response];
      this.columnsInfluence = [...response];

    },
    (error) => {
      console.error('Error while reading column names', error);
    }
  );
  }

  updateSelectedSignalsToPredictList(): void {
    if(!this.selectedSignalsToPredict.includes(this.selectedPredict) && this.selectedPredict != '') {
      this.selectedSignalsToPredict.push(this.selectedPredict)
      this.selectedSignalsWithInfluence.push(this.selectedPredict)
      this.columnsPredict.splice(this.columnsPredict.indexOf(this.selectedPredict, 0), 1);
      this.columnsInfluence.splice(this.columnsInfluence.indexOf(this.selectedPredict, 0), 1);
    }

    console.log("Data to predict: ", this.selectedSignalsToPredict); 
  }

  updateSelectedSignalsWithInfluenceList(): void {
    if(!this.selectedSignalsWithInfluence.includes(this.selectedInfluence) && this.selectedInfluence != '') {
      this.selectedSignalsWithInfluence.push(this.selectedInfluence)
      this.columnsInfluence.splice(this.columnsInfluence.indexOf(this.selectedInfluence, 0), 1);
    }

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
      console.log('File information read successfully', response);
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
          console.log('File indexes read successfully', this.fileIndexes);
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

    this.trainAndTestAsync(model)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error('Error while training and testing the model', error);
      })
      .finally(() => {

      });
  }
  
  async trainAndTestAsync(model: MlModel): Promise<any> {
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
