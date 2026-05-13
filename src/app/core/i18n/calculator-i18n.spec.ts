import { translate } from './calculator-i18n';

describe('calculatorI18n', () => {
  it('returns localized labels and messages', () => {
    expect(translate('en-US', 'calculator')).toBe('Calculator');
    expect(translate('es-ES', 'divided_by_zero')).toBe('No se puede dividir por cero');
    expect(translate('pt-PT', 'invalid_factorial_input')).toContain('fatorial');
    expect(translate('en-US', '')).toBe('');
  });
});

