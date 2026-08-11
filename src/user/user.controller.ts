import { Controller,Post,Req,Res,Get,Put,Patch,Delete,Body,Param,UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}
    @UseGuards(JwtGuard)
    @Post('add-address')
    addAddress(@Req()req , @Body() data:any){
        return this.userService.addaddress(req,data)

    }
    @UseGuards(JwtGuard)
    @Get('get-address')
    getAddress(@Req() req){
        return this.userService.getAddress(req)
    }
    @UseGuards(JwtGuard)
    @Delete("remove/:id")
    remove(@Req() req,@Param('id') id:string){
        return  this.userService.remove(req,id)
    }
    @UseGuards(JwtGuard)
    @Get("getAddressById/:id")
    getAddressById(@Req() req ,@Param('id') id:string){
        return this.userService.getAddressById(req,id)
    }
     @UseGuards(JwtGuard)
    @Put("getAddressByIdAndUpdate/:id")
    getAddressByIdAndUpdate(@Req() req ,@Param('id') id:string,@Body()data){
        return this.userService.getAddressByIdAndUpdate(req,id,data)
    }
}
