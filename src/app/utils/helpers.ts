import { Catalog } from "../modules/interfaces";
import { PICK_CATALOG_TEXT } from "./constants";

export const formCatalogString = (catalogs: Catalog[]): string => {
  return catalogs.reduce(
    (acc, item) => (acc += `● ${item.name} - ${item.description}\n`),
    PICK_CATALOG_TEXT,
  );
}