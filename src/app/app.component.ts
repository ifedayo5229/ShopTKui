import { Component } from '@angular/core';
import { ThemeService } from './services/shared/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'InventoryAppUI';
  showSidebar = true;

  constructor(private themeService: ThemeService) {
    // ThemeService initializes theme on construction
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
}
