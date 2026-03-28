import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

/**
 * ModalComponent — generic wrapper for dialog/modal overlays.
 */
export class ModalComponent extends BasePage {
  readonly overlay: Locator;
  readonly title: Locator;
  readonly body: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page, testId = 'modal') {
    super(page);
    this.overlay = page.getByTestId(testId);
    this.title = this.overlay.getByRole('heading');
    this.body = this.overlay.getByTestId('modal-body');
    this.confirmButton = this.overlay.getByRole('button', { name: /confirm|ok|yes/i });
    this.cancelButton = this.overlay.getByRole('button', { name: /cancel|no/i });
    this.closeButton = this.overlay.getByRole('button', { name: 'Close' });
  }

  async confirm(): Promise<void> {
    await this.click(this.confirmButton, 'Modal confirm');
    await this.waitForHidden(this.overlay);
  }

  async cancel(): Promise<void> {
    await this.click(this.cancelButton, 'Modal cancel');
    await this.waitForHidden(this.overlay);
  }

  async close(): Promise<void> {
    await this.click(this.closeButton, 'Modal close');
    await this.waitForHidden(this.overlay);
  }

  async assertTitle(expected: string): Promise<void> {
    await this.assertVisible(this.overlay, 'Modal');
    await this.assertText(this.title, expected);
  }

  async assertOpen(): Promise<void> {
    await this.assertVisible(this.overlay, 'Modal');
  }

  async assertClosed(): Promise<void> {
    await this.assertHidden(this.overlay, 'Modal');
  }
}
