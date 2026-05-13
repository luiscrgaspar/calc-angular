import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import type { Language } from '../../core/domain/calculator.types';

@Component({
  selector: 'app-language-switch',
  standalone: true,
  imports: [NgFor, NgClass],
  template: `
    <div class="calculator-languages">
      <button
        *ngFor="let language of languages; trackBy: trackByLanguageKey"
        type="button"
        [attr.aria-pressed]="language.active"
        [ngClass]="language.active ? 'calculator-language calculator-language-active' : 'calculator-language'"
        (click)="languageChange.emit(language.key)"
      >
        {{ language.label }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitchComponent {
  @Input({ required: true }) languages: Language[] = [];
  @Output() readonly languageChange = new EventEmitter<Language['key']>();

  trackByLanguageKey(_: number, language: Language): Language['key'] {
    return language.key;
  }
}

