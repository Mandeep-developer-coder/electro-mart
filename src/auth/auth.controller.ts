import { Controller,Get,Post,Req,UseGuards,Param,Body,Put,Delete ,Res,Response} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}
  @Post('signup')
  signup(@Body()data:SignupDto,@Res({passthrough:true}) res:Response){
    return this.authService.signup(data,res)
  }
  @Post('login')
  login(@Body()data:LoginDto,@Res({passthrough:true})res:Response){
    return this.authService.login(data,res)
  }
  @Post('logout')
  logout(@Res({passthrough:true}) res:Response){
    return this.authService.logout(res)
  }
 
  @Post('forgot-password')
  forgotPassword(@Body('email')email:string){
    return this.authService.forgotPassword(email)
  }
  @Post('reset-password')
  resetPassword(@Body() body: any){
    return this.authService.resetPassword(body.email, body.otp, body);
  }
  @Get('me')
  @UseGuards(JwtGuard)
  me(@Req() req){
    return this.authService.me(req)
  }

}
