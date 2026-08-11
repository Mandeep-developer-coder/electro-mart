import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, otpSchema } from './schema/otp.schema';


@Module({
  imports:[UserModule,MongooseModule.forFeature([{name:Otp.name,schema:otpSchema}])],
  controllers: [OtpController],
  providers: [OtpService],
  exports:[OtpService]
})
export class OtpModule {}
