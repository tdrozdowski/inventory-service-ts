import { item } from './items/items'
import { person } from './persons/persons'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(item)
  app.configure(person)
  // All services will be registered here
}
