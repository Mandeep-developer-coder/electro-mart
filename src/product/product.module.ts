import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './schema/product.schema';
import { ProductSchema } from './schema/product.schema';
import { MongooseModule } from '@nestjs/mongoose';



@Module({
  imports:[MongooseModule.forFeature([{name:Product.name,schema:ProductSchema}])],
  controllers: [ProductController],
  providers: [ProductService],
  exports:[ProductService,MongooseModule]
})
export class ProductModule {}
