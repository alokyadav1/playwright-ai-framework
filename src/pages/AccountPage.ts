import type { Locator, Page } from "@playwright/test";
import type { ApiInterceptor } from "../core/ApiInterceptor.js";
import type { Labels } from "../core/runtime.js";
import accountLocators from "../locators/account.json" with { type: "json" };
import { BasePage } from "./BasePage.js";

type Credentials = { email: string; password: string };

export class AccountPage extends BasePage {
  private readonly signInLink: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitBtn: Locator;

  constructor(page: Page, api: ApiInterceptor, labels: Labels) {
    super(page, api);
    this.signInLink = page.getByRole("link", { name: labels.accountLoginLink, exact: true });
    this.usernameInput = page.locator(accountLocators.usernameInput);
    this.passwordInput = page.locator(accountLocators.passwordInput);
    this.submitBtn = page.locator(accountLocators.submitBtn);
  }

  async openHomepage(): Promise<void> {
    await this.page.goto("/");
  }

  async signIn(credentials: Credentials): Promise<void> {
    await this.signInLink.click();
    await this.usernameInput.fill(credentials.email);
    await this.submitBtn.click();
    await this.passwordInput.fill(credentials.password);
    await this.submitBtn.click();
    await this.page.waitForURL((url) => !url.pathname.includes("/signin"));
  }
}