import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;


  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  category: string;

  @Prop()
  brand: string;

  @Prop()
  rating: number;

  @Prop({min:0})
  stock: number;

  @Prop({ type: Types.ObjectId, ref: User.name })
  addedBy: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
