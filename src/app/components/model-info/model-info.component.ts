import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MlModel } from '../my-models/my-models.component';
import { DialogModule } from '@angular/cdk/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-model-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model-info.component.html',
  styleUrl: './model-info.component.css'
})
export class ModelInfoComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public model: MlModel, private dialog: MatDialog, private router: Router) {}

  closeDialog() {
    this.dialog.closeAll();
  }

  navigateToFileUpload(model: MlModel) {
    localStorage.setItem('modelForPredicting', JSON.stringify(model));
    this.router.navigate(['/file-upload', model.name]);
    this.closeDialog();
  };

  navigateToTrainingResults(model: MlModel) {
    this.router.navigate(['/training-results/' + model.name]);
    this.closeDialog();
  }

}
