import { IsString,IsEmail,MinLength,IsOptional } from "class-validator";
import { UserRole } from "src/user/enum/user-role.enum";
export class LoginDto{
  
    @IsString()
    @IsEmail()
    email:string
    @IsString()
    @MinLength(6)
    password:string
   

}