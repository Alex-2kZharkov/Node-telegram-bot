import { RoleCodes } from "../../utils/shared.types";

export interface CommandFields {
  command: string;
  description: string;
  roles: RoleCodes[];
}

export const commands = [
  {
    command: '/new_order',
    description: 'order something right now ๐',
    roles: [RoleCodes.CUSTOMER, RoleCodes.ADMIN],
  },
  {
    command: '/orders',
    description: 'all confirmed orders (most recent first) ๐งพ',
    roles: [RoleCodes.ADMIN],
  },
  {
    command: '/order_status',
    description: 'was your order delivered yet โ',
    roles: [RoleCodes.CUSTOMER, RoleCodes.ADMIN],
  },
  {
    command: '/deliver_order',
    description: 'admin confirms that order was delivered โ',
    roles: [RoleCodes.ADMIN],
  },
  {
    command: '/new_catalog',
    description: 'admin adds new catalog to already existing ones ๐จ',
    roles: [RoleCodes.ADMIN],
  },
  {
    command: '/new_stuff',
    description: 'admin adds new stuff to already existing catalogs ๐',
    roles: [RoleCodes.ADMIN],
  },
] as CommandFields[];
