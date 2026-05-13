import { DIVISION_OPERATOR } from './calculator.constants';
import type { Operator } from './calculator.types';

const MAX_RESULT_LENGTH = 12;

export interface FormattedResult {
  value: string;
  isInfinity: boolean;
}

function expandNumberToDecimalString(value: number): string {
  const normalizedValue = value.toString().toLowerCase();

  if (!normalizedValue.includes('e')) {
    return normalizedValue;
  }

  const [mantissa, exponentPart] = normalizedValue.split('e');
  const exponent = Number(exponentPart);
  const sign = mantissa.startsWith('-') ? '-' : '';
  const unsignedMantissa = sign ? mantissa.slice(1) : mantissa;
  const [integerPart, fractionalPart = ''] = unsignedMantissa.split('.');
  const digits = `${integerPart}${fractionalPart}`;
  const decimalIndex = integerPart.length + exponent;

  if (decimalIndex <= 0) {
    return `${sign}0.${'0'.repeat(Math.abs(decimalIndex))}${digits}`;
  }

  if (decimalIndex >= digits.length) {
    return `${sign}${digits}${'0'.repeat(decimalIndex - digits.length)}`;
  }

  return `${sign}${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;
}

export function countNumberBeforePoint(value: number): number {
  const absoluteValue = Math.abs(value);

  if (Math.floor(absoluteValue) === absoluteValue) {
    return 0;
  }

  return expandNumberToDecimalString(absoluteValue).split('.')[0].length;
}

export function countDecimals(value: number): number {
  if (Math.floor(value) === value) {
    return 0;
  }

  return expandNumberToDecimalString(value).split('.')[1]?.length ?? 0;
}

export function getMinDecimalPlaces(value: number): number {
  const decimals = countDecimals(value);

  if (decimals === 0) {
    return 0;
  }

  const maxAllowedDecimals = Math.max(
    0,
    Math.min(
      MAX_RESULT_LENGTH - countNumberBeforePoint(value) - 1 - (value < 0 ? 1 : 0),
      expandNumberToDecimalString(value).length
    )
  );

  return Math.min(decimals, maxAllowedDecimals);
}

export function formatResult(result: number, operator: Operator | ''): FormattedResult {
  if (Number.isNaN(result)) {
    return {
      value: 'NaN',
      isInfinity: false
    };
  }

  if (!Number.isFinite(result)) {
    return {
      value: result === Infinity ? 'Infinity' : '-Infinity',
      isInfinity: true
    };
  }

  const totalNumberResult = result.toString().length;

  if (operator === DIVISION_OPERATOR) {
    const expandedResult = expandNumberToDecimalString(result);
    const shouldUseFixedDecimal =
      result.toString().includes('e') ||
      Math.max(totalNumberResult, expandedResult.length) > MAX_RESULT_LENGTH;

    return {
      value: shouldUseFixedDecimal ? result.toFixed(getMinDecimalPlaces(result)) : result.toString(),
      isInfinity: false
    };
  }

  return {
    value: totalNumberResult > MAX_RESULT_LENGTH ? result.toExponential(6) : result.toString(),
    isInfinity: false
  };
}

export function formatRootResult(result: number): string {
  return result.toFixed(getMinDecimalPlaces(result));
}

export function formatReciprocalResult(result: number): string {
  return countDecimals(result) > MAX_RESULT_LENGTH ? result.toExponential(7) : result.toString();
}

