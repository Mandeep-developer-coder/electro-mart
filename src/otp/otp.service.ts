import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from './schema/otp.schema';
import { otpDocument } from './schema/otp.schema';
@Injectable()
export class OtpService {
    constructor(@InjectModel(Otp.name) private otpModel:Model<otpDocument>){
        
    }
    async saveOtp({userId,otp,expiresAt}){
         await this.otpModel.deleteMany({ userId: userId });
        await this.otpModel.create({userId,otp,expiresAt})
    }

    async verifyOtp(userId: any, otp: string): Promise<boolean> {
        const otpRecord = await this.otpModel.findOne({ userId }).sort({ createdAt: -1 });
        if (!otpRecord) return false;
        if (otpRecord.otp !== otp) return false;
        if (otpRecord.expiresAt.getTime() < Date.now()) return false;
        return true;
    }

    async deleteOtp(userId: any): Promise<void> {
        await this.otpModel.deleteMany({ userId });
    }
}
