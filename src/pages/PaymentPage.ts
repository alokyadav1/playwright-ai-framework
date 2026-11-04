import type { Locator, Page } from "@playwright/test";
import type { ApiInterceptor } from "../core/ApiInterceptor.js";
import type { Labels } from "../core/runtime.js";
import { BasePage } from "./BasePage.js";

type VStripeDetails = {
  cardHolderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

export class PaymentPage extends BasePage {
  readonly placeOrderBtn: Locator;
  private readonly cardHolderNameInput: Locator;
  private readonly cardNumberInput: Locator;
  private readonly expiryMonthInput: Locator;
  private readonly expiryYearInput: Locator;
  private readonly cvvInput: Locator;
  private readonly payNowBtn: Locator;

  constructor(page: Page, api: ApiInterceptor, labels: Labels) {
    super(page, api);
    this.placeOrderBtn = page.getByRole("button", { name: labels.paymentPlaceOrderBtn, exact: true });
    this.cardHolderNameInput = page.getByLabel(labels.paymentCardHolderNameInput, { exact: true });
    this.cardNumberInput = page.getByLabel(labels.paymentCardNumberInput, { exact: true });
    this.expiryMonthInput = page.getByRole("spinbutton", {
      name: labels.paymentExpiryMonthInput,
      exact: true,
    });
    this.expiryYearInput = page.getByRole("spinbutton", {
      name: labels.paymentExpiryYearInput,
      exact: true,
    });
    this.cvvInput = page.getByLabel(labels.paymentCvvInput, { exact: true });
    this.payNowBtn = page.getByRole("button", { name: labels.paymentPayNowBtn, exact: true });
  }

  async enterVStripeDetails(details: VStripeDetails): Promise<void> {
    const [month, year] = details.expiry.split("/");
    if (!month || !year) {
      throw new Error("vStripeData.expiry must use MM/YY format");
    }

    await this.cardHolderNameInput.fill(details.cardHolderName);
    await this.cardNumberInput.fill(details.cardNumber);
    await this.expiryMonthInput.fill(month);
    await this.expiryYearInput.fill(year);
    await this.cvvInput.fill(details.cvv);
  }

  async authorizeVStripe(): Promise<void> {
    await this.payNowBtn.click();
  }

  authorizationMessage(message: string): Locator {
    return this.page.getByText(message);
  }
}