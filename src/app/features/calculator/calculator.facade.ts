import { Injectable, computed, signal } from '@angular/core';
import {
  ADDITION_OPERATOR,
  CALCULATOR_BUTTON_LINES,
  DIVISION_OPERATOR,
  EQUAL_BUTTON_CLASS,
  LANGUAGE_LABELS,
  MULTIPLICATION_OPERATOR,
  SUBTRACTION_OPERATOR
} from '../../core/domain/calculator.constants';
import type {
  CalculatorButton,
  CalculatorErrorKey,
  CalculatorState,
  Language,
  LanguageCode,
  Operator
} from '../../core/domain/calculator.types';
import { translate } from '../../core/i18n/calculator-i18n';
import {
  calculateBinaryOperation,
  calculateCube,
  calculateCubicRoot,
  calculateFactorial,
  calculatePercentage,
  calculateReciprocal,
  calculateSquare,
  calculateSquareRoot
} from '../../core/domain/calculator-engine';
import {
  formatReciprocalResult,
  formatResult,
  formatRootResult
} from '../../core/domain/result-formatter';

function createDefaultLanguages(): Language[] {
  return LANGUAGE_LABELS.map((language, index) => ({
    ...language,
    active: index === 0
  }));
}

export function getCurrentLanguage(languages: Language[]): LanguageCode {
  return languages.find((language) => language.active)?.key ?? 'en-US';
}

export function createInitialState(): CalculatorState {
  return {
    languages: createDefaultLanguages(),
    currentValue: '0',
    currentTemporaryValue: '',
    currentMemoryValue: '',
    currentOperator: '',
    goingToDoOperation: false,
    isInfinity: false,
    alreadyDoneEqualOperation: false,
    error: ''
  };
}

function isNumeric(value: string): boolean {
  return !Number.isNaN(+value);
}

function createButton(
  id: string,
  label: string,
  onClick: () => void,
  options: Omit<CalculatorButton, 'id' | 'label' | 'onClick'> = {}
): CalculatorButton {
  return {
    id,
    label,
    onClick,
    ...options
  };
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorFacade {
  private readonly state = signal<CalculatorState>(createInitialState());

  readonly currentLanguage = computed(() => getCurrentLanguage(this.state().languages));
  readonly displayValue = computed(() => {
    const state = this.state();
    const language = this.currentLanguage();

    if (state.error) {
      return translate(language, state.error);
    }

    if (state.isInfinity) {
      return state.currentValue === '-Infinity'
        ? translate(language, '-infinity')
        : translate(language, 'infinity');
    }

    return state.currentValue;
  });
  readonly error = computed(() => this.state().error);
  readonly languages = computed(() => this.state().languages);
  readonly buttonRows = computed(() => this.createButtonRows());

  private patchState(patch: Partial<CalculatorState>): void {
    this.state.update((current) => ({
      ...current,
      ...patch
    }));
  }

  private setCurrentValue(value: string): void {
    this.patchState({ currentValue: value });
  }

  private setCurrentTemporaryValue(value: string): void {
    this.patchState({ currentTemporaryValue: value });
  }

  private setCurrentMemoryValue(value: string): void {
    this.patchState({ currentMemoryValue: value });
  }

  private setCurrentOperator(value: Operator | ''): void {
    this.patchState({ currentOperator: value });
  }

  private setGoingToDoOperation(value: boolean): void {
    this.patchState({ goingToDoOperation: value });
  }

  private setIsInfinity(value: boolean): void {
    this.patchState({ isInfinity: value });
  }

  private setAlreadyDoneEqualOperation(value: boolean): void {
    this.patchState({ alreadyDoneEqualOperation: value });
  }

  private setError(value: CalculatorErrorKey | ''): void {
    this.patchState({ error: value });
  }

  reset = (): void => {
    const state = this.state();
    this.patchState({
      currentValue: '0',
      currentTemporaryValue: '',
      currentOperator: '',
      isInfinity: false,
      error: '',
      goingToDoOperation: false,
      alreadyDoneEqualOperation: false,
      languages: state.languages,
      currentMemoryValue: state.currentMemoryValue
    });
  };

  setLanguage = (language: LanguageCode): void => {
    this.patchState({
      languages: this.state().languages.map((item) => ({
        ...item,
        active: item.key === language
      }))
    });
  };

  pressPi = (): void => {
    this.setCurrentValue(Math.PI.toFixed(11));
    this.setError('');
    this.setIsInfinity(false);
  };

  pressCE = (): void => {
    const state = this.state();

    if (state.error !== '' || state.isInfinity) {
      this.reset();
      return;
    }

    this.setCurrentValue('0');
  };

  pressMemoryClear = (): void => {
    this.setCurrentMemoryValue('');
  };

  pressMemoryRecall = (): void => {
    const state = this.state();
    this.setCurrentValue(state.currentMemoryValue);
    this.setError('');
    this.setIsInfinity(false);
  };

  pressMemoryStore = (): void => {
    const state = this.state();

    if (state.currentValue !== '0') {
      this.setCurrentMemoryValue(state.currentValue);
    }
  };

  pressPercentage = (): void => {
    const state = this.state();
    this.setCurrentValue(calculatePercentage(+state.currentValue, state.currentOperator !== ''));
  };

  pressBackspace = (): void => {
    const state = this.state();
    const trimmedValue = state.currentValue.length === 1 ? '0' : state.currentValue.slice(0, -1);

    this.setCurrentValue(trimmedValue === '' || trimmedValue === '-' ? '0' : trimmedValue);
  };

  pressSquare = (): void => {
    this.applyFormattedResult(calculateSquare(+this.state().currentValue));
  };

  pressCube = (): void => {
    this.applyFormattedResult(calculateCube(+this.state().currentValue));
  };

  pressSquareRoot = (): void => {
    this.setResultOperationOrInvalidInput(
      calculateSquareRoot(+this.state().currentValue),
      'invalid_number_for_square_root'
    );
  };

  pressCubicRoot = (): void => {
    this.setResultOperationOrInvalidInput(
      calculateCubicRoot(+this.state().currentValue),
      'invalid_number_for_cubic_root'
    );
  };

  pressFactorial = (): void => {
    const result = calculateFactorial(+this.state().currentValue);

    if (typeof result === 'string') {
      this.setErrorCurrentValue(result);
      return;
    }

    this.applyFormattedResult(result);
  };

  pressReciprocal = (): void => {
    const result = calculateReciprocal(+this.state().currentValue);

    if (typeof result === 'string') {
      this.setErrorCurrentValue(result);
      return;
    }

    this.setError('');
    this.setIsInfinity(false);
    this.setCurrentValue(formatReciprocalResult(result));
  };

  pressConstantE = (): void => {
    this.setCurrentValue(Math.E.toFixed(11));
    this.setError('');
    this.setIsInfinity(false);
  };

  pressDigit = (digit: string | number): void => {
    const numberValue = digit.toString();
    const state = this.state();

    if (state.alreadyDoneEqualOperation) {
      this.setCurrentValue(numberValue);
      this.setCurrentTemporaryValue('0');
      this.setAlreadyDoneEqualOperation(false);
      this.setCurrentOperator('');
      return;
    }

    this.appendToCurrentValue(numberValue);
  };

  pressZero = (): void => {
    if (this.state().currentValue !== '0') {
      this.appendToCurrentValue('0');
    }
  };

  pressToggleSign = (): void => {
    this.setCurrentValue((+this.state().currentValue * -1).toString());
  };

  pressDecimal = (): void => {
    const state = this.state();

    if (state.goingToDoOperation || (isNumeric(state.currentValue) && state.currentValue.indexOf('.') === -1)) {
      this.appendToCurrentValue('.');
    }
  };

  pressEqual = (): void => {
    const state = this.state();
    const pendingResult = this.getPendingBinaryOperationResult(state.alreadyDoneEqualOperation);

    if (!pendingResult) {
      return;
    }

    const { currentValueNumber, result } = pendingResult;

    if (typeof result === 'string') {
      this.setErrorCurrentValue(result);
      return;
    }

    if (!state.alreadyDoneEqualOperation) {
      this.setCurrentTemporaryValue(currentValueNumber.toString());
      this.setAlreadyDoneEqualOperation(true);
    }

    this.setGoingToDoOperation(false);
    this.applyFormattedResult(result);
  };

  pressOperator = (operator: Operator): void => {
    const state = this.state();
    const hadAlreadyDoneEqualOperation = state.alreadyDoneEqualOperation;

    this.setAlreadyDoneEqualOperation(false);

    if (hadAlreadyDoneEqualOperation) {
      this.setCurrentTemporaryValue(state.currentValue);
      this.setCurrentOperator(operator);
      this.setGoingToDoOperation(true);
      return;
    }

    if (state.goingToDoOperation) {
      this.setCurrentOperator(operator);
      return;
    }

    if (state.currentOperator !== '') {
      const pendingResult = this.getPendingBinaryOperationResult(false);

      if (!pendingResult) {
        return;
      }

      const { result } = pendingResult;

      if (typeof result === 'string') {
        this.setErrorCurrentValue(result);
        return;
      }

      const displayResult = this.applyFormattedResult(result);
      this.setCurrentTemporaryValue(displayResult);
      this.setCurrentOperator(operator);
      this.setGoingToDoOperation(true);
      return;
    }

    this.setCurrentTemporaryValue(state.currentValue);
    this.setCurrentOperator(operator);
    this.setGoingToDoOperation(true);
  };

  private appendToCurrentValue(payload: string): void {
    const state = this.state();

    if (payload === '.' && state.goingToDoOperation) {
      this.patchState({
        goingToDoOperation: false,
        currentValue: '0.'
      });
      return;
    }

    if (payload === '.' && state.currentValue.includes('.')) {
      return;
    }

    const currentValue =
      (state.currentValue === '0' && payload !== '.') || state.goingToDoOperation
        ? payload
        : `${state.currentValue}${payload}`;

    this.patchState({
      currentValue,
      goingToDoOperation: false
    });
  }

  private applyFormattedResult(result: number): string {
    const state = this.state();
    const formattedResult = formatResult(result, state.currentOperator);
    const displayResult = formattedResult.isInfinity ? result.toString() : formattedResult.value;

    this.setError('');
    this.setIsInfinity(formattedResult.isInfinity);
    this.setCurrentValue(displayResult);

    return displayResult;
  }

  private setErrorCurrentValue(error: CalculatorErrorKey): void {
    this.setIsInfinity(false);
    this.setError(error);
  }

  private setResultOperationOrInvalidInput(value: number, error: CalculatorErrorKey): void {
    this.setIsInfinity(false);

    if (Number.isNaN(value)) {
      this.setError(error);
      return;
    }

    this.setError('');
    this.setCurrentValue(formatRootResult(value));
  }

  private getPendingBinaryOperationResult(alreadyRepeated: boolean): {
    currentValueNumber: number;
    result: number | CalculatorErrorKey;
  } | null {
    const state = this.state();

    if (!state.currentOperator || Number.isNaN(+state.currentValue)) {
      return null;
    }

    const currentValueNumber = +state.currentValue;
    const currentTemporaryValueNumber = +state.currentTemporaryValue;
    const result = calculateBinaryOperation(
      state.currentOperator,
      currentTemporaryValueNumber,
      currentValueNumber,
      alreadyRepeated
    );

    return {
      currentValueNumber,
      result
    };
  }

  private createButtonRows(): CalculatorButton[][] {
    return [
      [
        createButton('pi', CALCULATOR_BUTTON_LINES.line1[0], this.pressPi),
        createButton('ce', CALCULATOR_BUTTON_LINES.line1[1], this.pressCE),
        createButton('clear', CALCULATOR_BUTTON_LINES.line1[2], this.reset),
        createButton('backspace', CALCULATOR_BUTTON_LINES.line1[3], this.pressBackspace)
      ],
      [
        createButton('memory-clear', CALCULATOR_BUTTON_LINES.line2[0], this.pressMemoryClear, {
          disabled: !this.state().currentMemoryValue
        }),
        createButton('memory-recall', CALCULATOR_BUTTON_LINES.line2[1], this.pressMemoryRecall, {
          disabled: !this.state().currentMemoryValue
        }),
        createButton('memory-store', CALCULATOR_BUTTON_LINES.line2[2], this.pressMemoryStore),
        createButton('percentage', CALCULATOR_BUTTON_LINES.line2[3], this.pressPercentage)
      ],
      [
        createButton('square', CALCULATOR_BUTTON_LINES.line3[0], this.pressSquare),
        createButton('cube', CALCULATOR_BUTTON_LINES.line3[1], this.pressCube),
        createButton('square-root', CALCULATOR_BUTTON_LINES.line3[2], this.pressSquareRoot),
        createButton('cubic-root', CALCULATOR_BUTTON_LINES.line3[3], this.pressCubicRoot)
      ],
      [
        createButton('factorial', CALCULATOR_BUTTON_LINES.line4[0], this.pressFactorial),
        createButton('reciprocal', CALCULATOR_BUTTON_LINES.line4[1], this.pressReciprocal),
        createButton('constant-e', CALCULATOR_BUTTON_LINES.line4[2], this.pressConstantE),
        createButton('divide', CALCULATOR_BUTTON_LINES.line4[3], () =>
          this.pressOperator(DIVISION_OPERATOR)
        )
      ],
      [
        createButton('seven', CALCULATOR_BUTTON_LINES.line5[0], () => this.pressDigit('7')),
        createButton('eight', CALCULATOR_BUTTON_LINES.line5[1], () => this.pressDigit('8')),
        createButton('nine', CALCULATOR_BUTTON_LINES.line5[2], () => this.pressDigit('9')),
        createButton('multiply', CALCULATOR_BUTTON_LINES.line5[3], () =>
          this.pressOperator(MULTIPLICATION_OPERATOR)
        )
      ],
      [
        createButton('four', CALCULATOR_BUTTON_LINES.line6[0], () => this.pressDigit('4')),
        createButton('five', CALCULATOR_BUTTON_LINES.line6[1], () => this.pressDigit('5')),
        createButton('six', CALCULATOR_BUTTON_LINES.line6[2], () => this.pressDigit('6')),
        createButton('subtract', CALCULATOR_BUTTON_LINES.line6[3], () =>
          this.pressOperator(SUBTRACTION_OPERATOR)
        )
      ],
      [
        createButton('one', CALCULATOR_BUTTON_LINES.line7[0], () => this.pressDigit('1')),
        createButton('two', CALCULATOR_BUTTON_LINES.line7[1], () => this.pressDigit('2')),
        createButton('three', CALCULATOR_BUTTON_LINES.line7[2], () => this.pressDigit('3')),
        createButton('add', CALCULATOR_BUTTON_LINES.line7[3], () =>
          this.pressOperator(ADDITION_OPERATOR)
        )
      ],
      [
        createButton('toggle-sign', CALCULATOR_BUTTON_LINES.line8[0], this.pressToggleSign),
        createButton('zero', CALCULATOR_BUTTON_LINES.line8[1], this.pressZero),
        createButton('decimal', CALCULATOR_BUTTON_LINES.line8[2], this.pressDecimal),
        createButton('equals', CALCULATOR_BUTTON_LINES.line8[3], this.pressEqual, {
          disabled: Boolean(this.error() || this.state().isInfinity),
          className: EQUAL_BUTTON_CLASS
        })
      ]
    ];
  }
}
