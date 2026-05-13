import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  it('renders the calculator shell and reacts to button clicks', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [CalculatorComponent]
    }).createComponent(CalculatorComponent);

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.calculator')).not.toBeNull();
    expect(root.querySelector('[data-testid="result"]')?.textContent?.trim()).toBe('0');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const oneButton = buttons.find((button) => button.nativeElement.textContent.trim() === '1');
    expect(oneButton).toBeDefined();
    oneButton!.nativeElement.click();
    fixture.detectChanges();

    expect(root.querySelector('[data-testid="result"]')?.textContent?.trim()).toBe('1');
  });
});
