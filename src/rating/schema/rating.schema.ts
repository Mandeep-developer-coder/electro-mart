import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document,Types } from "mongoose";
import { User } from "src/user/schema/user.schema";
import { Product } from "src/product/schema/product.schema";
import { Order } from "src/order/schema/order.schema";
export type RatingDocument=Rating & Document
@Schema({timestamps:true})
export class Rating{
    @Prop({required:true,type:Types.ObjectId,ref:User.name})
    userId:Types.ObjectId
    @Prop({required:true,type:Types.ObjectId,ref:Product.name})
    productId:Types.ObjectId
      @Prop({required:true,type:Types.ObjectId,ref:Order.name})
    orderId:Types.ObjectId
    @Prop({required:true,type:Number,min:1,max:5})
    rating:number

}
export const RatingSchema=SchemaFactory.createForClass(Rating)
RatingSchema.index(
  { userId: 1, productId: 1, orderId: 1 },
  { unique: true }
);
