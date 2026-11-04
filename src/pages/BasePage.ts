import type { Page } from '@playwright/test';
import type { ApiInterceptor } from '../core/ApiInterceptor';

export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly api: ApiInterceptor,
  ) {}
}
