import { TestBed } from '@angular/core/testing';
import { CalculatorFacade } from './calculator.facade';

describe('CalculatorFacade', () => {
  let facade: CalculatorFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalculatorFacade]
    });

    facade = TestBed.inject(CalculatorFacade);
  });

  it('starts with the default state', () => {
    expect(facade.displayValue()).toBe('0');
    expect(facade.currentLanguage()).toBe('en-US');
    expect(facade.languages()[0].active).toBeTrue();
    expect(facade.buttonRows().length).toBe(8);
  });

  it('supports chained operations and repeated equals for subtraction and division', () => {
    facade.pressDigit('8');
    facade.pressOperator('-');
    facade.pressDigit('2');
    facade.pressEqual();

    expect(facade.displayValue()).toBe('6');

    facade.pressEqual();
    expect(facade.displayValue()).toBe('4');

    facade.reset();
    facade.pressDigit('8');
    facade.pressOperator('÷');
    facade.pressDigit('2');
    facade.pressEqual();

    expect(facade.displayValue()).toBe('4');

    facade.pressEqual();
    expect(facade.displayValue()).toBe('2');
  });

  it('handles memory and scientific helpers', () => {
    facade.pressMemoryStore();
    expect(facade.buttonRows()[1][0].disabled).toBeFalse();
    expect(facade.buttonRows()[1][1].disabled).toBeFalse();

    facade.pressMemoryRecall();
    expect(facade.displayValue()).toBe('0');

    facade.pressDigit('7');
    facade.pressMemoryStore();
    facade.reset();

    expect(facade.buttonRows()[1][0].disabled).toBeFalse();
    expect(facade.buttonRows()[1][1].disabled).toBeFalse();

    facade.pressMemoryRecall();
    expect(facade.displayValue()).toBe('7');

    facade.pressSquare();
    expect(facade.displayValue()).toBe('49');

    facade.reset();
    facade.pressDigit('2');
    facade.pressReciprocal();
    expect(facade.displayValue()).toBe('0.5');
  });

  it('translates errors and language changes', () => {
    facade.pressOperator('÷');
    facade.pressDigit('0');
    facade.pressEqual();

    expect(facade.displayValue()).toBe('Cannot divide by zero');

    facade.setLanguage('es-ES');
    expect(facade.displayValue()).toBe('No se puede dividir por cero');
  });

  it('blocks calculator actions while an error is displayed until CE clears it', () => {
    facade.pressOperator('÷');
    facade.pressDigit('0');
    facade.pressEqual();

    expect(facade.displayValue()).toBe('Cannot divide by zero');

    facade.pressDigit('7');
    facade.pressSquare();
    facade.pressOperator('+');
    facade.pressMemoryStore();
    expect(facade.displayValue()).toBe('Cannot divide by zero');

    facade.pressCE();
    expect(facade.displayValue()).toBe('0');

    facade.pressDigit('7');
    expect(facade.displayValue()).toBe('7');
  });
});
