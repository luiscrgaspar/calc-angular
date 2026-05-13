import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import type { CalculatorButton } from '../../core/domain/calculator.types';

@Component({
  selector: 'app-calculator-row',
  standalone: true,
  imports: [NgFor, NgClass],
  template: `
    <div class="calculator-row">
      <button
        *ngFor="let button of buttons; trackBy: trackByButtonId"
        type="button"
        [ngClass]="button.className ?? 'calculator-button'"
        [disabled]="button.disabled ?? false"
        (click)="button.onClick()"
      >
        {{ button.label }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalculatorRowComponent {
  @Input({ required: true }) buttons: CalculatorButton[] = [];

  trackByButtonId(_: number, button: CalculatorButton): string {
    return button.id;
  }
}

