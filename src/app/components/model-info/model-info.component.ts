import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MlModel } from '../my-models/my-models.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AreYouSureComponent } from '../are-you-sure/are-you-sure.component';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-model-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model-info.component.html',
  styleUrl: './model-info.component.css'
})

@Injectable({
  providedIn: 'root',
})
export class ModelInfoComponent {

  //areYouSureDialog: MatDialogRef<AreYouSureComponent>;

  constructor(@Inject(MAT_DIALOG_DATA) public model: MlModel, 
                private dialog: MatDialog, private router: Router, 
                private areYouSureDialog: MatDialogRef<AreYouSureComponent>
                ) {}

  closeDialog() {
    this.dialog.closeAll();
  }

  openAreYouSure(model: MlModel) {
    this.areYouSureDialog = this.dialog.open(AreYouSureComponent, {data: model});
  }

  closeAreYouSure() {
    this.areYouSureDialog.close();
    
  }

  navigateToFileUpload(model: MlModel) {
    this.router.navigate(['/file-upload', model.name]);
    this.closeDialog();
  };

  navigateToTrainingResults(model: MlModel) {
    this.router.navigate(['/training-results/' + model.name]);
    this.closeDialog();
  }

  navigateToPredictionResults(model: MlModel) {
    this.router.navigate(['/prediction-results/' + model.name]);
    this.closeDialog();
  }

}
