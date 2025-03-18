import { Component } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { FeaturesComponent } from "../../components/features/features.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FooterComponent, FeaturesComponent, RouterLink],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

}
