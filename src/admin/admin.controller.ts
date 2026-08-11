import { Controller,Post,Put,Get,Delete,Body,Param,UseGuards,Req,Query,Patch} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { UserRole } from 'src/user/enum/user-role.enum';
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService:AdminService){}
    @UseGuards(JwtGuard,RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('get-customers')
    getCustomers(@Req() req){
        return this.adminService.getCustomers(req)

    }
    @UseGuards(JwtGuard,RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('customer-order')
    customerOrder(@Req() req){
        return this.adminService.customerOrder(req)
    }
@UseGuards(JwtGuard,RolesGuard)
@Roles(UserRole.ADMIN)
@Get('customer-detail/:id')
customerDetails(@Req() req, @Param('id') id:string){
    return this.adminService.customerDetails(req,id)
}
@UseGuards(JwtGuard,RolesGuard)
@Roles(UserRole.ADMIN)
@Get('order-detail/:id')
orderDetail(@Req() req, @Param('id') id:string){
    return this.adminService.orderDetail(req,id)
}
@UseGuards(JwtGuard,RolesGuard)
@Roles(UserRole.ADMIN)
@Get('filter-customer')
filterCustomer(@Query('search') search?:string){
return this.adminService.filterCustomer(search)
}
@UseGuards(JwtGuard,RolesGuard)
@Roles(UserRole.ADMIN)
@Patch('update-status/:orderId')
updateStatus(@Param('orderId') orderId:string,@Body('orderStatus') orderStatus:string){
    return this.adminService.updateStatus(orderId,orderStatus)

}
@UseGuards(JwtGuard,RolesGuard)
@Roles(UserRole.ADMIN)
@Get('all-orders')
allOrders(){
    return this.adminService.allOrders()
}
@UseGuards(JwtGuard,RolesGuard)
@Roles(UserRole.ADMIN)
@Get('dashboard')
dashboardDetails(){
    return this.adminService.dashboardDetails()
}
@UseGuards(JwtGuard)
@Roles(UserRole.ADMIN)
@Get('sale-graph')
getSale(){
    return this.adminService.getSale()
}
}
