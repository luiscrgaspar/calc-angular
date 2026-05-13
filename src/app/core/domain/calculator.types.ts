export type LanguageCode = 'en-US' | 'es-ES' | 'pt-PT';

export type Operator = '+' | '-' | '×' | '÷';

export type CalculatorErrorKey =
  | 'divided_by_zero'
  | 'invalid_number_for_square_root'
  | 'invalid_number_for_cubic_root'
  | 'invalid_factorial_input';

export interface Language {
  key: LanguageCode;
  label: string;
  active: boolean;
}

export interface CalculatorButton {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export interface CalculatorState {
  languages: Language[];
  currentValue: string;
  currentTemporaryValue: string;
  currentMemoryValue: string;
  currentOperator: Operator | '';
  goingToDoOperation: boolean;
  isInfinity: boolean;
  alreadyDoneEqualOperation: boolean;
  error: CalculatorErrorKey | '';
}

export interface TranslationMessages {
  calculator: string;
  infinity: string;
  '-infinity': string;
  divided_by_zero: string;
  invalid_number_for_square_root: string;
  invalid_number_for_cubic_root: string;
  invalid_factorial_input: string;
}

