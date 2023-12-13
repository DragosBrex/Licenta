import { Component } from '@angular/core';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { HttpClientModule } from '@angular/common/http';
import { ModelFormComponent } from './components/model-form/model-form.component';
import { ModelPredictComponent } from './components/model-predict/model-predict.component';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FileUploadComponent,  HttpClientModule, ModelFormComponent, ModelPredictComponent, RouterOutlet]
})

export class AppComponent {
  title = 'Licenta';
}
