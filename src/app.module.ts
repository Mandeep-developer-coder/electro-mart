import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CartModule } from './cart/cart.module';
import { OtpModule } from './otp/otp.module';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { ProfileModule } from './profile/profile.module';
import { OrderModule } from './order/order.module';
import { AdminModule } from './admin/admin.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),AuthModule, UserModule,MongooseModule.forRoot("mongodb://127.0.0.1:27017/ecommerce"), CartModule, OtpModule, MailModule, ProductModule, ProfileModule, OrderModule, AdminModule, RatingModule],
  controllers: [AppController, MailController],
  providers: [AppService, MailService],
})
export class AppModule {}
