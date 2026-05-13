import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CalculatorComponent } from './features/calculator/calculator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalculatorComponent],
  template: `
    <main class="app">
      <app-calculator></app-calculator>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
