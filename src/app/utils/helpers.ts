import { Catalog } from "../modules/interfaces";

export const formCatalogString = (catalogs: Catalog[]): string => {
  return catalogs.reduce(
    (acc, item) => (acc += `● ${item.name} - ${item.description}\n`),
    '<b>Pick name of the catalog:</b>\n',
  );
}