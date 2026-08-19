import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: "Order", required: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: "inr" })
  currency: string;

  @Prop({
    enum: ["COD", "CARD", "UPI"],
    required: true,
    uppercase: true
  })
  paymentMethod: string;

  @Prop({
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING",
    uppercase: true
  })
  status: string;

  @Prop({
    type: String,
    default: null,
  })
  paymentIntentId: string | null;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
