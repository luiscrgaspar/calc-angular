import {
  countDecimals,
  countNumberBeforePoint,
  formatReciprocalResult,
  formatResult,
  formatRootResult,
  getMinDecimalPlaces
} from './result-formatter';
import { DIVISION_OPERATOR } from './calculator.constants';

describe('resultFormatter', () => {
  it('counts decimals and minimum decimal places correctly', () => {
    expect(countNumberBeforePoint(12.34)).toBe(2);
    expect(countNumberBeforePoint(12)).toBe(0);
    expect(countDecimals(12.34)).toBe(2);
    expect(countDecimals(12)).toBe(0);
    expect(countDecimals(1e-7)).toBe(7);
    expect(getMinDecimalPlaces(12.34)).toBeGreaterThan(0);
    expect(getMinDecimalPlaces(12)).toBe(0);
    expect(getMinDecimalPlaces(1e-7)).toBeGreaterThan(0);
  });

  it('formats standard and division results', () => {
    expect(formatResult(1234.5678, '')).toEqual({
      value: '1234.5678',
      isInfinity: false
    });

    expect(formatResult(12.3456789012345, DIVISION_OPERATOR).isInfinity).toBe(false);
    expect(formatResult(12.5, DIVISION_OPERATOR).value).toBe('12.5');
    expect(formatResult(12.5, DIVISION_OPERATOR).value.length).toBeLessThanOrEqual(12);
    expect(formatResult(1e-8, DIVISION_OPERATOR)).toEqual({
      value: '0.00000001',
      isInfinity: false
    });
    expect(formatResult(1234567890.12345, DIVISION_OPERATOR).value).toContain('.');
    expect(formatResult(1234567890.12345, DIVISION_OPERATOR).value.length).toBeLessThanOrEqual(12);
    expect(formatResult(1234567890.12345, '').value).toContain('e');
    expect(formatResult(Number.NaN, '')).toEqual({
      value: 'NaN',
      isInfinity: false
    });
    expect(formatResult(-12.3456789012345, DIVISION_OPERATOR).value).toContain('-');
  });

  it('formats special values and root helpers', () => {
    expect(formatResult(Number.POSITIVE_INFINITY, '')).toEqual({
      value: 'Infinity',
      isInfinity: true
    });
    expect(formatResult(Number.NEGATIVE_INFINITY, '')).toEqual({
      value: '-Infinity',
      isInfinity: true
    });
    expect(formatRootResult(3)).toBe('3');
    expect(formatRootResult(3.5)).toMatch(/^3\.5/);
    expect(formatReciprocalResult(0.5)).toBe('0.5');
    expect(formatReciprocalResult(0.1234567890123456)).toContain('e');
  });
});

