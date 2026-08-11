import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { userDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import {
  NotAcceptableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<userDocument>) {}
  async findByEmail(email) {
    return await this.userModel.findOne({ email });
  }
  async createUser(data) {
    return await this.userModel.create(data);
  }
  async addaddress(req, data) {
    try {
      const userId = req.user.userId;
      const updatesUser = await this.userModel.findOneAndUpdate(
        { _id: userId },
        { $push: { addresses: data } },
      );
      if (!updatesUser) {
        throw new NotAcceptableException('User not found');
      }
      return {
        success: true,
        updatesUser,
      };
    } catch (err) {
      if (err instanceof NotAcceptableException) throw err;
      throw new InternalServerErrorException('Internal server problem');
    }
  }
  async getAddress(req) {
    // try{
    //  const userId=req.user.userId
    //  const user=await this.userModel.findById(userId,"addresses").sort({"addresses.createdAt":-1})
    //  if(!user){
    //     throw new NotAcceptableException("User not found")
    //  }
    //  return{
    //     success:true,
    //     address:user.addresses
    //  }

    // }
    // catch(err){
    //     if(err instanceof NotAcceptableException) throw err
    //     throw new InternalServerErrorException("Internal server problem")

    // }
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const user = await this.userModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$addresses' },
      { $sort: { 'addresses.createdAt': -1 } },
      { $group: { _id: '$_id', addresses: { $push: '$addresses' } } },
    ]);
    return {
      success: true,
      address: user[0]?.addresses || [],
    };
  }
  async remove(req, id) {
    const userId = req.user.userId;
    const user = await this.userModel.updateOne(
      { _id: req.user.userId },
      { $pull: { addresses: { _id: id } } },
    );
    return { success: true, user };
  }
  async getAddressByIdAndUpdate(req, id, data) {
    try {
      const userId = req.user.userId;
      const user = await this.userModel.findOneAndUpdate(
        { _id: userId ,
        'addresses._id': id },
        {
          $set: { 'addresses.$.name': data.name ,
          'addresses.$.phone': data.phone,
          'addresses.$.street': data.street,
          'addresses.$.city': data.city,
          'addresses.$.state': data.state,
          'addresses.$.zip': data.zip},
        }, { new: true }
      );
   if(!user){
    return {success:false}
   }
      return {success:true,address:user?.addresses}
    } catch (err) {}
  }
async getAddressById(req, id) {
    const user=await this.userModel.findOne({_id:req.user.userId,"addresses._id":id},{"addresses.$":1})
    return {
        success:true,
        address:user?.addresses[0]
    }
   
  }

  async updatePassword(userId: any, hashPassword: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { password: hashPassword } }
    );
  }
}
