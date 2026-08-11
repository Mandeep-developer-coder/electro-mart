import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UserRole } from "../enum/user-role.enum";
@Schema({timestamps:true})
export class Address{
    @Prop({required:true})
    name:string
    @Prop({ 
  required: true, 
  match: /^(\+91)?[6-9]\d{9}$/, 
  
})
phone: string;
    @Prop({required:true,trim:true})
    street:string
    @Prop({required:true,trim:true})
    city:string
    @Prop({required:true,trim:true})
    state:string
    @Prop({required:true,trim:true,default:"India"})
    country:string
     @Prop({
    required: true,
    match: /^[1-9][0-9]{5}$/,
  })
  zip: string;
}export const AddressSchema = SchemaFactory.createForClass(Address);
export type userDocument=User& Document
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];
@Prop({ 
required:false,
  match: /^(\+91)?[6-9]\d{9}$/, 
  unique: true ,
    sparse: true 
})
phone?: string;

  @Prop({
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  })
  avatar?: string;
}

export const userSchema=SchemaFactory.createForClass(User)