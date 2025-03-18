import { Component, input } from '@angular/core';

@Component({
  selector: 'app-feature-card',
  imports: [],
  templateUrl: './feature-card.component.html',
  styles: ``
})
export class FeatureCardComponent {
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly emoji = input<string>('');
}
