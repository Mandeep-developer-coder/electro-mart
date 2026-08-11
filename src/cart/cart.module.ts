import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart } from './schema/cart.schema';
import { cartSchema } from './schema/cart.schema';
@Module({
  imports:[AuthModule,MongooseModule.forFeature([{name:Cart.name,schema:cartSchema}])],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
