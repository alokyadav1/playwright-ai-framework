/** Fill {placeholders} in a locator or path template: tpl("[data-sku='{sku}']", { sku: "A1" }). */
export const tpl = (template: string, vars: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const value = vars[key];
    if (value === undefined) throw new Error(`tpl: missing value for {${key}} in "${template}"`);
    return value;
  });
