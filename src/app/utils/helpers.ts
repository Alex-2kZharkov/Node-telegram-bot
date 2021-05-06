import { Catalog, StuffFields } from "../modules/interfaces";
import { PICK_CATALOG_TEXT, STUFF_TITLE } from "./constants";

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
