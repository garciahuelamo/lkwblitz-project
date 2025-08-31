import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserHeaderComponent } from "./components/user/user-header/user-header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserHeaderComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
