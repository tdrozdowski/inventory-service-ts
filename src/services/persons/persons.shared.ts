// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Person, PersonData, PersonPatch, PersonQuery, PersonService } from './persons.class'

export type { Person, PersonData, PersonPatch, PersonQuery }

export type PersonClientService = Pick<PersonService<Params<PersonQuery>>, (typeof personMethods)[number]>

export const personPath = 'persons'

export const personMethods: Array<keyof PersonService> = ['find', 'get', 'create', 'patch', 'remove']

export const personClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(personPath, connection.service(personPath), {
    methods: personMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [personPath]: PersonClientService
  }
}
