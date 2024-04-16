import { Model } from "@nozbe/watermelondb";
import { text, field } from "@nozbe/watermelondb/decorators";

export class CategoryModel extends Model {
  static table = 'categories'
  @field('name') 
  name!:string
}

