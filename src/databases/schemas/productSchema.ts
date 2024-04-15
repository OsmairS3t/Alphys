import { tableSchema } from "@nozbe/watermelondb";

export const productSchema = tableSchema({
  name: 'products',
  columns: [
    { name: 'name', type: 'string' }
  ]
})