import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MlModel } from '../my-models/my-models.component';
import { AppComponent } from '../../app.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  modelName: string = '';
  model: MlModel = new MlModel;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private app: AppComponent) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit() {
    this.app.changeActiveNavPage("create-model");
    this.app.animateBody("animation-left")
    this.modelName = this.route.snapshot.paramMap.get('modelName')!;
  };

  onDragOver(event: any): void {
    event.preventDefault();
  }

  onDragStart(event: any): void {
    event.dataTransfer.setData("text", event.target.src);
  }

  onDrop(event: any): void {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const droppedFile = files[0];
      this.selectedFile = droppedFile;
      console.log(this.selectedFile?.name)
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post<any>('http://localhost:8080/files/upload?file', formData).subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
          
          if(this.modelName == null) {
            sessionStorage.setItem("trainingFileID", response.id);
            this.router.navigate(['/model-form']);
          }
          else {
            sessionStorage.setItem("predictingFileID", response.id);
            this.router.navigate(['/predict', this.modelName]);}
        },
        (error) => {
          console.error('Error uploading file', error);
        }
      );
    } else {
      console.warn('No file selected');
    }
  }
}
