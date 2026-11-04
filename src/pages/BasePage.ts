import type { Page } from '@playwright/test';
import type { ApiInterceptor } from '../core/ApiInterceptor.js';

export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly api: ApiInterceptor,
  ) {}
}
