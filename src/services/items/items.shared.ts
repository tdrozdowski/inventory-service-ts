// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Item, ItemData, ItemPatch, ItemQuery, ItemService } from './items.class'

export type { Item, ItemData, ItemPatch, ItemQuery }

export type ItemClientService = Pick<ItemService<Params<ItemQuery>>, (typeof itemMethods)[number]>

export const itemPath = 'items'

export const itemMethods: Array<keyof ItemService> = ['find', 'get', 'create', 'patch', 'remove']

export const itemClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(itemPath, connection.service(itemPath), {
    methods: itemMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [itemPath]: ItemClientService
  }
}
