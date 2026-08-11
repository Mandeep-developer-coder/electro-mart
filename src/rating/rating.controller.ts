import { Controller,Post,UseGuards ,Body,Req} from '@nestjs/common';
import { RatingService } from './rating.service';
import { UserRole } from 'src/user/enum/user-role.enum';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';


@Controller('rating')
export class RatingController {
    constructor(private readonly ratingService:RatingService){}
    @UseGuards(JwtGuard,RolesGuard)
    @Roles(UserRole.USER,UserRole.USER)
    @Post()
    saveRating(@Body() data,@Req() req){
      return this.ratingService.saveRating(data,req)
    }
}
