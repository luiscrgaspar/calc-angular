import type { LanguageCode } from './calculator.types';

export const CALCULATOR_BUTTON_LINES = {
  line1: ['π', 'CE', 'C', '⌫'],
  line2: ['MC', 'MR', 'MS', '%'],
  line3: ['x²', 'x³', '²√x', '³√x'],
  line4: ['n!', '1/x', 'e', '÷'],
  line5: ['7', '8', '9', '×'],
  line6: ['4', '5', '6', '-'],
  line7: ['1', '2', '3', '+'],
  line8: ['±', '0', '.', '=']
} as const;

export const EQUAL_BUTTON_CLASS = 'calculator-button calculator-button--equal';

export const ADDITION_OPERATOR = '+' as const;
export const SUBTRACTION_OPERATOR = '-' as const;
export const MULTIPLICATION_OPERATOR = '×' as const;
export const DIVISION_OPERATOR = '÷' as const;

export const LANGUAGE_LABELS: Array<{ key: LanguageCode; label: string }> = [
  { key: 'en-US', label: 'EN' },
  { key: 'es-ES', label: 'ES' },
  { key: 'pt-PT', label: 'PT' }
];

