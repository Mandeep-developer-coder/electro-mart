import { Injectable } from '@nestjs/common';
import { User } from 'src/user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { userDocument } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class ProfileService {
    constructor(@InjectModel(User.name) private userModel:Model<userDocument>){}
   async getProfile(req){
    const email=req.user.email
    const user=await this.userModel.findOne({email})
    if(!user){
        return {
            success:false,
            msg:"User not found"
        }
    }
    return{
        success:true,
        name:user.name,
        email:user.email,
        phone:user.phone,
        avatar:user.avatar
    }

    }
    async updateProfile(req,data,file){
        const updatedData={...data}
        if(file){
          updatedData.avatar = `http://localhost:3005/uploads/${file.filename}`;

        }
        const updatedUser=await this.userModel.findOneAndUpdate(
            {email:req.user.email},
            {$set:updatedData},
            {new:true}
        )
        return {
            success:true,user:updatedUser
        }
    }}
