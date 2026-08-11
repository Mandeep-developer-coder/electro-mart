import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Product } from "src/product/schema/product.schema";
import { User } from "src/user/schema/user.schema";
export type cartDocument = Cart & Document
@Schema({ _id: false })
export class CartItem {
    @Prop({ type: Types.ObjectId, required: true, ref: Product.name })
    productId: Types.ObjectId
    @Prop({ required: true })
    priceAtAdded: number
    @Prop({ required: true, min: 1, default: 1 })
    quantity: number
}
@Schema({ timestamps: true })
export class Cart {
    @Prop({ type: Types.ObjectId, required: true, unique: true, ref: User.name })
    userId: Types.ObjectId
    @Prop({ type: [CartItem], default: [] })
    items: CartItem[]

}
export const cartSchema = SchemaFactory.createForClass(Cart)


cartSchema.index({ "items.productId": 1 });
cartSchema.index({ "userId": 1 });


cartSchema.index({ userId: 1, "items.productId": 1 }, { unique: true });
