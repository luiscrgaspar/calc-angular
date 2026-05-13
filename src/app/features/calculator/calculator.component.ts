import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { CalculatorFacade } from './calculator.facade';
import { CalculatorHeaderComponent } from '../../shared/components/calculator-header.component';
import { CalculatorRowComponent } from '../../shared/components/calculator-row.component';
import { LanguageSwitchComponent } from '../../shared/components/language-switch.component';
import { translate } from '../../core/i18n/calculator-i18n';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [NgFor, CalculatorHeaderComponent, CalculatorRowComponent, LanguageSwitchComponent],
  template: `
    <section class="calculator">
      <app-language-switch
        [languages]="languages()"
        (languageChange)="setLanguage($event)"
      ></app-language-switch>
      <div class="calculator-shell">
        <app-calculator-header
          [title]="title()"
          [displayValue]="displayValue()"
          [error]="error()"
        ></app-calculator-header>
        <app-calculator-row
          *ngFor="let buttons of buttonRows(); trackBy: trackByRowId"
          [buttons]="buttons"
        ></app-calculator-row>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalculatorComponent {
  private readonly facade = inject(CalculatorFacade);

  readonly currentLanguage = this.facade.currentLanguage;
  readonly displayValue = this.facade.displayValue;
  readonly error = this.facade.error;
  readonly languages = this.facade.languages;
  readonly buttonRows = this.facade.buttonRows;
  readonly title = computed(() => translate(this.currentLanguage(), 'calculator'));

  setLanguage = this.facade.setLanguage;

  trackByRowId(_: number, buttons: { id: string }[]): string {
    return buttons[0]?.id ?? '';
  }
}
