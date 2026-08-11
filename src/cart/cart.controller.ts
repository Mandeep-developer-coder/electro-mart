import { Controller,Req,UseGuards,Get,Post ,Body,Patch,Delete,Param} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService:CartService){}
    // @UseGuards(JwtGuard)
//      @Get()
// getCart(@Req() req) {
//   console.log(req.user.id); 
//   return {sent:req.user};
// }
@UseGuards(JwtGuard)
@Post('add-cart')
addCart(@Req() req,@Body()data){
  return this.cartService.addCart(req,data)

}
@UseGuards(JwtGuard)
@Patch('update-qty')
updateQty(@Req() req ,@Body() data){
  return this.cartService.updateQty(req,data)
}
@UseGuards(JwtGuard)
@Delete('delete-item')
deleteItem(@Req() req,@Body('id') id:string ){
  return this.cartService.deleteItem(req,id)
}
@UseGuards(JwtGuard)
@Get('get-cart')
getCart(@Req() req){
  return this.cartService.getCart(req)
}
@UseGuards(JwtGuard)
@Get('product-exist/:id')
productExist(@Req() req,@Param('id') id:string){
  return this.cartService.productExist(req,id)
}
@UseGuards(JwtGuard)
@Delete('del-allcart')
delAllCart(@Req() req){
  return this.cartService.delAllCart(req)
}

}
