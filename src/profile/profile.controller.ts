import { Controller ,Post,Get,Req,UseGuards,Put,UseInterceptors,UploadedFile,Body} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService:ProfileService){}
    @Get('/get-profile')
    @UseGuards(JwtGuard)
    getProfile(@Req() req){
        return this.profileService.getProfile(req)
    }
    @UseGuards(JwtGuard)
    @Put('update-profile')
    @UseInterceptors(
        FileInterceptor('avatar',{
            storage:diskStorage({
            destination:"./uploads",
            filename:(req,file,cb)=>{
                 const ext = extname(file.originalname);
           const uniqueName = `avatar-${Date.now()}${ext}`;
         cb(null, uniqueName);
            }}),
           fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, 
        })
    )
     updateProfile(@Req() req,@Body() data:any, @UploadedFile() file?:Express.Multer.File ){
        return this.profileService.updateProfile(req,data,file)

     }
    
}
