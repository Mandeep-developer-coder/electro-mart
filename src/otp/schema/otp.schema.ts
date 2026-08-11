import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document,Types } from "mongoose";
import { User } from "src/user/schema/user.schema";
export type otpDocument=Otp & Document
@Schema({timestamps:true})
export class Otp{
    @Prop({type:Types.ObjectId,ref:User.name,required:true})
    userId:Types.ObjectId
    @Prop({required:true})
    otp:string
    @Prop({required:true})
    expiresAt:Date
    @Prop({default:false})
    isVerified:boolean
}
export const otpSchema=SchemaFactory.createForClass(Otp)