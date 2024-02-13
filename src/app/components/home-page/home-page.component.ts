import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../notification/notification.service';
import { MlModel } from '../my-models/my-models.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  constructor(private router: Router, private notificationService: NotificationService, private app: AppComponent) {}

  ngOnInit() {
    // const model = new MlModel;
    // model.name = "Model: Test";
    // this.notificationService.createInfoNotification(model, "Merge bine frate bmw-ul asta, dar mi-e frica tare rau de injectoarele astea");
    // this.notificationService.createInfoNotification(model, "Merge bine frate bmw-ul asta");

    this.app.changeActiveNavPage("home");
  }

  navigateToMyModels() {
   this.router.navigate(['/my-models']);
  }

  navigateToCreateNewModel() {
    this.router.navigate(['/file-upload']);
  }
}
