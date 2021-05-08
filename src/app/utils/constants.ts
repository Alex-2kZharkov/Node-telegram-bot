export const GREETING = 'Welcome to Tech Market - the best place to buy gadgets💻\n'
export const CATALOG_PREFIX = 'catalog-';
export const NEW_ORDER_PREFIX = 'new:';
export const CANCEL_ORDER_PREFIX = ':cancel';
export const CONFIRM_ORDER_SPLITTER = ':';

export const AllowedPrefixes = {
  prefixes: [CATALOG_PREFIX, NEW_ORDER_PREFIX]
}
export const SPLITTER = '-';
export const STUFF_TITLE = '<b>Here you go, dear friend. When you are ready to choose write new:id (id from stuff list)</b> \n';
export const PICK_CATALOG_TEXT = '<b>Pick name of the catalog (write "catalog-<i>catalogName</i>"):</b>\n'
export const DEFAULT_MESSAGE = `I didn't understand you. Please, type your message with specified prefix`;