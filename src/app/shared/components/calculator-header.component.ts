import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-calculator-header',
  standalone: true,
  template: `
    <div class="calculator-header">
      <span class="calculator-header-title">{{ title }}</span>
      <div class="calculator-header-result">
        <span
          data-testid="result"
          role="status"
          [attr.aria-live]="error ? 'assertive' : 'polite'"
          aria-atomic="true"
          [class]="resultClass"
        >
          {{ displayValue }}
        </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalculatorHeaderComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) displayValue = '';
  @Input() error = '';

  get resultClass(): string {
    return [
      'calculator-header-result-text',
      this.error ? 'calculator-header-result-text--error' : ''
    ]
      .filter(Boolean)
      .join(' ');
  }
}

