// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  personDataValidator,
  personPatchValidator,
  personQueryValidator,
  personResolver,
  personExternalResolver,
  personDataResolver,
  personPatchResolver,
  personQueryResolver
} from './persons.schema'

import type { Application } from '../../declarations'
import { PersonService, getOptions } from './persons.class'
import { personPath, personMethods } from './persons.shared'

export * from './persons.class'
export * from './persons.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const person = (app: Application) => {
  // Register our service on the Feathers application
  app.use(personPath, new PersonService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: personMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(personPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(personExternalResolver), schemaHooks.resolveResult(personResolver)],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    },
    before: {
      all: [schemaHooks.validateQuery(personQueryValidator), schemaHooks.resolveQuery(personQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(personDataValidator), schemaHooks.resolveData(personDataResolver)],
      patch: [schemaHooks.validateData(personPatchValidator), schemaHooks.resolveData(personPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [personPath]: PersonService
  }
}
