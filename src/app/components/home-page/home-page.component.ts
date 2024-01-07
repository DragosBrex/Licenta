import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Main } from '../../../main';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  constructor(private router: Router) {}

  ngOnInit() {
  }

  navigateToMyModels() {
   this.router.navigate(['/my-models']);
  }

  navigateToCreateNewModel() {
    this.router.navigate(['/file-upload']);
  }
}
