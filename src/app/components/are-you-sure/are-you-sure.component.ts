import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MlModel } from '../my-models/my-models.component';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ModelInfoComponent } from '../model-info/model-info.component';

@Component({
  selector: 'app-are-you-sure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './are-you-sure.component.html',
  styleUrl: './are-you-sure.component.css'
})
export class AreYouSureComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public model: MlModel, private dialog: MatDialog, private http: HttpClient, private modelInfo: ModelInfoComponent) {}

  closeDialog() {
    this.modelInfo.closeAreYouSure();
  }

  deleteModel(): void {
    this.http.delete<any>('http://localhost:8080/models/deleteName/' + this.model.name).subscribe(
      (response) => {
        this.closeDialog();
        window.location.reload();
      },
      (error) => {
        console.error('Error while deleting the model', error);
      }
    );
  }

}
