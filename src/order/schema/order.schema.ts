import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type OrderDocument = Order & Document;


@Schema({ _id: false })
export class OrderItem {

  @Prop({ type: Types.ObjectId, ref: "Product", required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, min: 1 })
  quantity: number;
}

export const OrderItemSchema =
  SchemaFactory.createForClass(OrderItem);




@Schema({ _id: false })
export class ShippingAddress {

  @Prop({ required: true })
  name: string;

  @Prop({ 
    required: true, 
    match: /^(\+91)?[6-9]\d{9}$/ 
  })
  phone: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true, default: "India" })
  country: string;

  @Prop({
    required: true,
    match: /^[1-9][0-9]{5}$/
  })
  zip: string;
}

export const ShippingAddressSchema =
  SchemaFactory.createForClass(ShippingAddress);

@Schema({ timestamps: true })
export class Order {


  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: ShippingAddress;

  
  @Prop({ required: true })
  subtotal: number;

  @Prop({ required: true })
  shippingCharge: number;

  @Prop({ required: true })
  tax: number;

  @Prop({ required: true })
  totalAmount: number;

  
  @Prop({
    enum: ["COD", "CARD", "UPI"],
    required: true,
   uppercase:true
  })
  paymentMethod: string;

  @Prop({
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  })
  paymentStatus: string;

  @Prop({
    enum: [
      "PLACED",
      "CONFIRMED",
      "PACKED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED"
    ],
    default: "PLACED"
  })
  orderStatus: string;
@Prop({
  type: String,
  default: null,
})
paymentIntentId: string | null;

@Prop({
  type:[
    {
      status:String,
      date:{type:Date,default:Date.now()}
    }
  ]
})
statusHistory:{status:string,date:Date}[]

  @Prop({ required: true, unique: true })
  idempotencyKey: string;
}

export const OrderSchema =
  SchemaFactory.createForClass(Order);
