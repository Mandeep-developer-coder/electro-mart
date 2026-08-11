import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { OtpModule } from 'src/otp/otp.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[PassportModule,JwtModule.register({
    secret:"mysecretkey",
    signOptions:{expiresIn:"1d"}
  }),UserModule,OtpModule,MailModule],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports:[JwtModule,PassportModule]
})
export class AuthModule {}
