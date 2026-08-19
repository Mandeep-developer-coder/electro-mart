import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/order.schema';
import { OrderDocument } from './schema/order.schema';
import { Payment } from './schema/payment.schema';
import { PaymentDocument } from './schema/payment.schema';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import Twilio from 'twilio';
import { User } from 'src/user/schema/user.schema';
import { userDocument } from 'src/user/schema/user.schema';
import { Rating } from 'src/rating/schema/rating.schema';
import { RatingDocument } from 'src/rating/schema/rating.schema';
import Stripe from 'stripe';
import { Product } from 'src/product/schema/product.schema';
import { ProductDocument } from 'src/product/schema/product.schema';


@Injectable()
export class OrderService {
  private twilioClient: ReturnType<typeof Twilio>;
  public stripe: any;
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<userDocument>,
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2026-02-25.clover',
    });
    const accSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    this.twilioClient = Twilio(accSid, authToken);
  }
  async createPaymentIntent(totalAmount: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'inr',
    });
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async addOrder(req, data) {
    const idempotencyKey = await this.orderModel.findOne({
      idempotencyKey: data.idempotencyKey,
    });
    if (idempotencyKey) {
      return { success: false };
    }

    const order = await this.orderModel.create({
      userId: new Types.ObjectId(req.user.userId),
      items: data.items.map((item) => ({
        ...item,
        productId: new Types.ObjectId(item.productId),
      })),

      shippingAddress: data.shippingAddress,
      subtotal: data.subtotal,
      shippingCharge: data.shippingCharge,
      tax: data.tax,
      totalAmount: data.totalAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod == 'CARD' ? 'PAID' : 'PENDING',
      orderStatus: 'CONFIRMED',
      paymentIntentId: data.paymentIntentId || null,
      statusHistory:[
        {
          status:'CONFIRMED',
          date:Date.now()
        }
      ],
      idempotencyKey: data.idempotencyKey,
    });
      if(data.paymentMethod=="CARD"){
        for(const item of order.items){
          const productId=new Types.ObjectId(item.productId)
          const updatedProuct=await this.productModel.findOneAndUpdate(
            {_id:productId,
              stock:{$gte:item.quantity}
            },{
              $inc:{stock:-item.quantity}
            },{new:true}
          )
        }
      } 
    if (order) {
      try {
        await this.paymentModel.create({
          orderId: order._id,
          userId: order.userId,
          amount: order.totalAmount,
          currency: 'inr',
          paymentMethod: order.paymentMethod,
          status: order.paymentStatus,
          paymentIntentId: order.paymentIntentId,
        });
      } catch (err) {
        console.error('Failed to create payment record:', err);
      }

      const user = await this.userModel.findOne({ _id: req.user.userId });
      const phone = user?.phone;
      try {
        await this.twilioClient.messages.create({
          // body: `Your order #${order._id} has been placed successfully!`, // Uncomment this after upgrading Twilio
          body: 'sms_appointment_reminders',
          from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
          to: phone || '',
        });
      } catch (err) {
        console.error('Twilio SMS failed:', err);
      }
      return {
        success: true,
        orderId: order._id,
      };
     
    }
    
   else {
      return { success: false };
    }
  }
  async markOrderPaid(paymentIntentId: string) {
    const order = await this.orderModel.findOne({ paymentIntentId });
    if (!order) return;

    order.paymentStatus = 'PAID';
    await order.save();

    try {
      await this.paymentModel.findOneAndUpdate(
        { paymentIntentId },
        { status: 'PAID' }
      );
    } catch (err) {
      console.error('Failed to update payment record status:', err);
    }
  }
  async getUserOrders(req) {
    const userId = new Types.ObjectId(req.user.userId);
    // console.log("User ID:", userId);

    const orders = await this.orderModel
      .find({ userId })
      .populate('items.productId', 'title images price')
      .sort({ createdAt: -1 })
      .exec();

    if (orders.length > 0) {
      return {
        success: true,
        orders,
      };
    }
    //   console.log(orders)

    return {
      success: false,
      orders: [],
    };
  }
  async cancelOrder(req, id) {
    const _id = new Types.ObjectId(id);
    const order = await this.orderModel.findById(_id);

    order!.orderStatus = 'CANCELLED';
    await order?.save();
    return { success: true };
  }

  async rating(req, id) {
    const userId = new Types.ObjectId(req.user.userId);
    const orderId = new Types.ObjectId(id);
    const rating = await this.ratingModel.findOne({ userId, orderId });
    if (rating) {
      return { success: true, rating: rating.rating };
    }
    return { success: false };
  }
}
