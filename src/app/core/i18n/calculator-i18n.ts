import type { LanguageCode, TranslationMessages } from '../domain/calculator.types';

export const MESSAGES: Record<LanguageCode, TranslationMessages> = {
  'en-US': {
    calculator: 'Calculator',
    infinity: 'Infinity',
    '-infinity': '-Infinity',
    divided_by_zero: 'Cannot divide by zero',
    invalid_number_for_square_root: 'Invalid number for square root',
    invalid_number_for_cubic_root: 'Invalid number for cubic root',
    invalid_factorial_input: 'Invalid number for factorial'
  },
  'es-ES': {
    calculator: 'Calculadora',
    infinity: 'Infinito',
    '-infinity': '-Infinito',
    divided_by_zero: 'No se puede dividir por cero',
    invalid_number_for_square_root: 'Número inválido para la raíz cuadrada',
    invalid_number_for_cubic_root: 'Número inválido para la raíz cúbica',
    invalid_factorial_input: 'Número inválido para factorial'
  },
  'pt-PT': {
    calculator: 'Calculadora',
    infinity: 'Infinito',
    '-infinity': '-Infinito',
    divided_by_zero: 'Não é possível dividir por zero',
    invalid_number_for_square_root: 'Número inválido para a raiz quadrada',
    invalid_number_for_cubic_root: 'Número inválido para a raiz cúbica',
    invalid_factorial_input: 'Número inválido para fatorial'
  }
};

export function translate(locale: LanguageCode, key: keyof TranslationMessages | ''): string {
  if (!key) {
    return '';
  }

  return MESSAGES[locale][key];
}

