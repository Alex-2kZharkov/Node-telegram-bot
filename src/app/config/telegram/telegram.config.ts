import { RoleCodes } from "../../utils/shared.types";

export interface CommandFields {
  command: string;
  description: string;
  roles: RoleCodes[];
}

export const commands = [
  {
    command: '/new_order',
    description: 'order something right now 📞',
    roles: [RoleCodes.CUSTOMER, RoleCodes.ADMIN],
  },
  {
    command: '/orders',
    description: 'all confirmed orders (most recent first) 🧾',
    roles: [RoleCodes.ADMIN],
  },
  {
    command: '/order_status',
    description: 'was your order delivered yet ❓',
    roles: [RoleCodes.CUSTOMER, RoleCodes.ADMIN],
  },
  {
    command: '/deliver_order',
    description: 'admin confirms that order was delivered ✅',
    roles: [RoleCodes.ADMIN],
  },
  {
    command: '/new_catalog',
    description: 'admin adds new catalog to already existing ones 📨',
    roles: [RoleCodes.ADMIN],
  },
  {
    command: '/new_stuff',
    description: 'admin adds new stuff to already existing catalogs 📝',
    roles: [RoleCodes.ADMIN],
  },
] as CommandFields[];
