import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';
import { ToastPackage } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { MlModel } from '../my-models/my-models.component';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {

  model: MlModel = new MlModel;
  message: string = '';

  constructor(private toastPackage: ToastPackage, private notificationService: NotificationService) {}

  ngOnInit() {
    this.model = this.toastPackage.config.payload;
    this.message = this.toastPackage.message!;
  }

  closeNotification(model: any) {
    this.notificationService.closeNotification(model);
  }
}
