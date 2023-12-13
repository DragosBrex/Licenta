import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  constructor(private router: Router) {}

  navigateToMyModels() {
   this.router.navigate(['/my-models']);
  }

  navigateToCreateNewModel() {
    this.router.navigate(['/file-upload']);
  }
}
