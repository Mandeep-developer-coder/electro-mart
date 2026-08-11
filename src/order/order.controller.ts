import { Controller,Get,Post,Body,Param,Req,UseGuards ,Headers,Res,Patch} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import Stripe from "stripe"

@Controller('order')
export class OrderController {
    constructor(private readonly orderService:OrderService){}
    @UseGuards(JwtGuard)
    @Post('add-order')
    addOrder(@Req() req,@Body() data){
        return this.orderService.addOrder(req,data)

    }
      @UseGuards(JwtGuard)
  @Post('create-intent')
  async createIntent(@Body() body: { amount: number }) {
    return this.orderService.createPaymentIntent(body.amount);
  }
  @Post('webhook')
  async stripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const stripe = this.orderService.stripe;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;
    const rawBody = req['rawBody'] || req.body;

    try {
   
      event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed', err.message);
      return {
        success:false
      }
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await this.orderService.markOrderPaid(paymentIntent.id);
    }

    return {success:true}
  }
  @UseGuards(JwtGuard)
  @Get('get-order')
  getUserOrder(@Req() req){
    return this.orderService.getUserOrders(req)
  }
    @UseGuards(JwtGuard)
  @Patch('cancel-order/:id')
  cancelOrder(@Req() req,@Param('id') id:string){
    return this.orderService.cancelOrder(req,id)
  }
   @UseGuards(JwtGuard)
  @Get('rating/:id')
  rating(@Req() req,@Param('id') id){
    return this.orderService.rating(req,id)
  }

}
