import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-wissenwertes',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './wissenwertes.component.html',
  styleUrl: './wissenwertes.component.css'
})
export class WissenwertesComponent {

}
