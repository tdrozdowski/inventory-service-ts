// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Person, PersonData, PersonPatch, PersonQuery } from './persons.schema'

export type { Person, PersonData, PersonPatch, PersonQuery }

export interface PersonParams extends KnexAdapterParams<PersonQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class PersonService<ServiceParams extends Params = PersonParams> extends KnexService<
  Person,
  PersonData,
  PersonParams,
  PersonPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'persons'
  }
}
