import { test as base, createBdd } from "playwright-bdd";
import { ApiInterceptor } from "../core/ApiInterceptor";
import {
  readEnvConfig,
  readStoreData,
  readStoreLabels,
  type Labels,
  type StoreData,
} from "../core/runtime";

type Fixtures = {
  labels: Labels;
  data: StoreData;
  api: ApiInterceptor;
};

export const test = base.extend<Fixtures>({
  labels: async ({}, use) => use(readStoreLabels()),
  data: async ({}, use) => use(readStoreData()),
  api: async ({ page }, use) =>
    use(new ApiInterceptor(page, readEnvConfig().apiBaseURL)),
});

export const { Given, When, Then } = createBdd(test);
