import { forwardRef, Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating } from './schema/rating.schema';
import { RatingSchema } from './schema/rating.schema';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';
import { ForwardReference } from '@nestjs/common';

@Module({
  imports:[MongooseModule.forFeature([{name:Rating.name,schema:RatingSchema}]),UserModule,ProductModule,forwardRef(()=>OrderModule)],
  controllers: [RatingController],
  providers: [RatingService],
  exports:[MongooseModule,RatingService]
})
export class RatingModule {}
