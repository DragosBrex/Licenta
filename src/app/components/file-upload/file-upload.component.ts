import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MlModel } from '../my-models/my-models.component';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  modelName: string = '';
  model: MlModel = new MlModel;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit() {
    this.modelName = this.route.snapshot.paramMap.get('modelName')!;
  };


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
