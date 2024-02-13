import { Component } from '@angular/core';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { HttpClientModule } from '@angular/common/http';
import { ModelFormComponent } from './components/model-form/model-form.component';
import { ModelPredictComponent } from './components/model-predict/model-predict.component';
import { Router, RouterOutlet } from '@angular/router';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FileUploadComponent,  HttpClientModule, ModelFormComponent, ModelPredictComponent, RouterOutlet]
})

@Injectable({
  providedIn: 'root',
})
export class AppComponent {
  title = 'Licenta';

  constructor(private router: Router) {}

  changeActiveNavPage(page: string) {
    const home = document.getElementById("nav-home");
    const models = document.getElementById("nav-models");
    const create = document.getElementById("nav-file");

    switch(page) {
      case "home":
        home!.className = "active";
        models!.className = "";
        create!.className = "";
        break;
      
      case "my-models":
        home!.className = "";
        models!.className = "active";
        create!.className = "";
        break;

      case "create-model":
        home!.className = "";
        models!.className = "";
        create!.className = "active";
        break;
    }
  }

  navigateTo(page: string) {
    switch(page) {
      case "home":
        this.router.navigate(['/home']);
        break;

      case "my-models":
        this.router.navigate(['/my-models']);
        break;

      case "create-model":
        this.router.navigate(['/file-upload']);
        break;
    }
  }
}
