import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from 'src/user/user.module';
import { OrderModule } from 'src/order/order.module';
import { ProductModule } from 'src/product/product.module';



@Module({
  imports:[UserModule,OrderModule,ProductModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
