import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";

export const getBaseEntityColumns = (): TableColumnOptions[] => [
  {
    name: "id",
    type: "uuid",
    isPrimary: true,
    isGenerated: true,
    generationStrategy: "uuid"
  },
  {
    name: "createdAt",
    type: "timestamp",
    isNullable: false,
    default: "CURRENT_TIMESTAMP"
  },
  {
    name: "updatedAt",
    type: "timestamp",
    isNullable: false,
    default: "CURRENT_TIMESTAMP"
  }
];
