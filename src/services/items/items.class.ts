// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Item, ItemData, ItemPatch, ItemQuery } from './items.schema'

export type { Item, ItemData, ItemPatch, ItemQuery }

export interface ItemParams extends KnexAdapterParams<ItemQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ItemService<ServiceParams extends Params = ItemParams> extends KnexService<
  Item,
  ItemData,
  ItemParams,
  ItemPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'items'
  }
}
