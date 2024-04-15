import { appSchema } from "@nozbe/watermelondb";

import { categorySchema } from './categorySchema'

export const schemas = appSchema({
  version: 1,
  tables: [
    categorySchema
  ]
})
