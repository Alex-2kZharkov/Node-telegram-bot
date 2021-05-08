import { Catalog, StuffFields } from "../modules/interfaces";
import { PICK_CATALOG_TEXT, STUFF_TITLE } from "./constants";
import { OrderStatuses } from "./shared.types";

export const formCatalogString = (catalogs: Catalog[]): string => {
  return catalogs.reduce(
    (acc, item) => (acc += `● ${item.name} - ${item.description}\n`),
    PICK_CATALOG_TEXT,
  );
};

export const parseMessage = (message: string, splitter: string): string[] => {
  return message.split(splitter);
};

export const formStuffString = (stuff: StuffFields[]): string => {
  return stuff.reduce(
    (acc, x) => acc += `● 🆔${x.id}. 📜${x.name} for 💸${x.amount}\n`,
    STUFF_TITLE,
  );
};

export const formOrderOptions = (orderId: string, status: OrderStatuses): string => {
  return `Your order has status ${status} and temporary code: <b>${orderId}</b>\n
      You have two options:\n
      1️⃣ Confirm order by sending code and quantity of stuff: <b>code:how many stuff you want</b>\n
      2️⃣ Cancel order by sending code and word cancel: <b>code:cancel</b>`;
}

export const formCancelOrderString = (name: string): string => {
  return `Dear, ${name}, your order was cancelled. Let's try again`
}