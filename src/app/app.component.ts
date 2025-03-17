import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent,],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'SyntaxSweetheart';
  isDarkMode = signal(this.getInitialTheme());
  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'synthwave' : false;
  }

  toggleTheme(): void {
    this.isDarkMode.update(value => {
      const newValue = !value;
      localStorage.setItem('theme', newValue ? 'synthwave' : 'valentine');
      return newValue;
    });
  }
}
