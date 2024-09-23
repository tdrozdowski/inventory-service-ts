// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PersonService } from './persons.class'

// Main data model schema
export const personSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    email: Type.String(),
    password: Type.Optional(Type.String()),
    created_by: Type.String(),
    created_at: Type.Number(),
    last_changed_by: Type.String(),
    last_updated_at: Type.Number(),
  },
  { $id: 'Person', additionalProperties: false }
)
export type Person = Static<typeof personSchema>
export const personValidator = getValidator(personSchema, dataValidator)
export const personResolver = resolve<Person, HookContext<PersonService>>({})

export const personExternalResolver = resolve<Person, HookContext<PersonService>>({
  // The password should never be visible externally
  password: async () => undefined
})

// Schema for creating new entries
export const personDataSchema = Type.Pick(personSchema, ['name', 'email', 'password', 'created_by'], {
  $id: 'PersonData'
})
export type PersonData = Static<typeof personDataSchema>
export const personDataValidator = getValidator(personDataSchema, dataValidator)
export const personDataResolver = resolve<Person, HookContext>({
  password: passwordHash({ strategy: 'local' }),
  created_at: async () => { return Date.now() },
  last_changed_by: async (_value, _message, context) => {
    return context.params.person.last_changed_by
  },
  last_updated_at: async () => { return Date.now() },
})

// Schema for updating existing entries
export const personPatchSchema = Type.Partial(personSchema, {
  $id: 'PersonPatch'
})
export type PersonPatch = Static<typeof personPatchSchema>
export const personPatchValidator = getValidator(personPatchSchema, dataValidator)
export const personPatchResolver = resolve<Person, HookContext<PersonService>>({
  password: passwordHash({ strategy: 'local' })
})

// Schema for allowed query properties
export const personQueryProperties = Type.Pick(personSchema, ['id', 'email'])
export const personQuerySchema = Type.Intersect(
  [
    querySyntax(personQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type PersonQuery = Static<typeof personQuerySchema>
export const personQueryValidator = getValidator(personQuerySchema, queryValidator)
export const personQueryResolver = resolve<PersonQuery, HookContext<PersonService>>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  id: async (value, user, context) => {
    if (context.params.person && context.method !== 'find') {
      return context.params.person.id
    }

    return value
  }
})
