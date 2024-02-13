import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MlModel } from '../my-models/my-models.component';
import { NotificationComponent } from './notification.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notificationList: any[] = [];

  constructor(private toastr: ToastrService) {}

  createInfoNotification(model: any, message: string): void {
    const notification = this.toastr.info(message, '' + model.name, {
      //toastComponent: NotificationComponent,
      payload: model,
      closeButton: true,
      disableTimeOut: true,
      tapToDismiss: false,
      positionClass: 'toast-top-right',
      toastClass: 'notification',
      newestOnTop: true,
    });

    this.notificationList.push([notification, model]);
  }

  createSuccesNotification(model: any, message: string): void {
    this.toastr.info(message, '' + model.name, {
      closeButton: true,
      timeOut: 20000,
      extendedTimeOut: 10000,
      tapToDismiss: false,
      positionClass: 'toast-top-right',
      toastClass: 'notification',
      newestOnTop: true
    });
  }

  closeNotification(model: any): void {
    this.notificationList.forEach((item) => {
      if(item[1] == model) {
        const index = this.notificationList.indexOf(item);
        this.notificationList[index][0].toastRef.manualClose();
        this.notificationList.splice(index, 1);
      }
    })
  }
}
