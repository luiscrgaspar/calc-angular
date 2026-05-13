import {
  calculateBinaryOperation,
  calculateCube,
  calculateCubicRoot,
  calculateFactorial,
  calculatePercentage,
  calculateReciprocal,
  calculateSquare,
  calculateSquareRoot
} from './calculator-engine';
import {
  ADDITION_OPERATOR,
  DIVISION_OPERATOR,
  MULTIPLICATION_OPERATOR,
  SUBTRACTION_OPERATOR
} from './calculator.constants';

describe('calculatorEngine', () => {
  it('calculates precise arithmetic operations', () => {
    expect(calculateBinaryOperation(ADDITION_OPERATOR, 0.1, 0.2, false)).toBe(0.3);
    expect(calculateBinaryOperation(SUBTRACTION_OPERATOR, 5, 2, false)).toBe(3);
    expect(calculateBinaryOperation(MULTIPLICATION_OPERATOR, 2, 3, false)).toBe(6);
    expect(calculateBinaryOperation(DIVISION_OPERATOR, 10, 4, false)).toBe(2.5);
  });

  it('supports repeated equals for subtraction and division', () => {
    expect(calculateBinaryOperation(SUBTRACTION_OPERATOR, 2, 3, true)).toBe(1);
    expect(calculateBinaryOperation(DIVISION_OPERATOR, 4, 2, true)).toBe(0.5);
  });

  it('handles unary operations and validation rules', () => {
    expect(calculatePercentage(50, true)).toBe('0.5');
    expect(calculatePercentage(50, false)).toBe('0');
    expect(calculateSquare(4)).toBe(16);
    expect(calculateCube(3)).toBe(27);
    expect(calculateSquareRoot(9)).toBe(3);
    expect(calculateCubicRoot(27)).toBe(3);
    expect(calculateFactorial(5)).toBe(120);
    expect(calculateFactorial(0)).toBe(1);
    expect(calculateFactorial(170)).toBe(7.257415615308004e306);
    expect(calculateFactorial(171)).toBe('invalid_factorial_input');
    expect(calculateFactorial(-1)).toBe('invalid_factorial_input');
    expect(calculateFactorial(1.2)).toBe('invalid_factorial_input');
    expect(calculateReciprocal(4)).toBe(0.25);
    expect(calculateReciprocal(0)).toBe('divided_by_zero');
    expect(calculateBinaryOperation('' as never, 1, 2, false)).toBe(0);
  });
});

