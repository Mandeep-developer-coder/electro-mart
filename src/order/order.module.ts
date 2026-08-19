import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { UserModule } from 'src/user/user.module';
import { RatingModule } from 'src/rating/rating.module';
import { ForwardReference } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Order.name,schema:OrderSchema},
      {name:Payment.name,schema:PaymentSchema}
    ]),
    UserModule,
    forwardRef(()=>RatingModule),
    forwardRef(()=>ProductModule)
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports:[OrderService,MongooseModule]
})
export class OrderModule {}
