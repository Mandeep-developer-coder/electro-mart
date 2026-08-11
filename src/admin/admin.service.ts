import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { userDocument } from 'src/user/schema/user.schema';
import { Order } from 'src/order/schema/order.schema';
import { OrderDocument } from 'src/order/schema/order.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { UserRole } from 'src/user/enum/user-role.enum';

import { NotFoundException } from '@nestjs/common';
import { Product } from 'src/product/schema/product.schema';
import { ProductDocument } from 'src/product/schema/product.schema';
@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<userDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
     @InjectModel(  Product.name) private productModel: Model<  ProductDocument>,
  ) {}
  async getCustomers(req) {
    const customer = await this.userModel
    .find({
    role: { $ne: UserRole.ADMIN }
})
      .select('name email phone avatar createdAt');
    if (customer) {
      return {
        success: true,
        customer,
      };
    }
    return {
      success: false,
      customer: [],
    };
  }
  async customerOrder(req) {}
  async customerDetails(req, id) {
    const userId = new Types.ObjectId(id);
    const user = await this.userModel
      .findOne({ _id: id })
      .select('name email phone avatar addresses createdAt');
    const order = await this.orderModel
      .find({ userId })
      .select(
        'items paymentMethod orderStatus paymentStatus totalAmount createdAt',
      )
      .sort({ createdAt: -1 });
    return { success: true, user, order };
  }
  async orderDetail(req, id) {
    // console.log('id', id);
    const order = await this.orderModel
      .findById(id)
      .populate({
        path: 'items.productId',
        select: 'images',
      })
      .populate({
        path: 'userId',
        select: 'name email',
      });
    if (!order) {
      console.log('Order not found in DB');
      return { success: false, message: 'Order not found' };
    }

    return { success: true, order };
  }
  async filterCustomer(search?: string) {
    const query: any = { role: 'user' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    const customer = await this.userModel
      .find(query)
      .select('name email phone avatar createdAt')
      .sort({ createdAt: -1 } as any);
    return { success: true, customer };
  }
  async updateStatus(orderId, orderStatus) {
    const id=new Types.ObjectId(orderId)
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      {
        $set: { orderStatus },
        $push:{statusHistory:{
           status:orderStatus,
          date:Date.now()
        }
         
        }
      },
      { new: true },
    );
    
    if(!updatedOrder){
      throw new NotFoundException("Order not found")
    }
    if(orderStatus=="DELIVERED"){
    updatedOrder.paymentStatus="PAID"

    for(const item of updatedOrder.items){
       const productId=new Types.ObjectId(item.productId)
        await this.productModel.findOneAndUpdate(
          {
            _id:productId,
            stock:{$gte:item.quantity}
          },{
            $inc:{stock:-item.quantity}
          },
          {new:true}
        )
    }
    
    }
    await updatedOrder.save()

    return updatedOrder
  }
  async allOrders(){
    const order=await this.orderModel.find().populate({path:"userId",select:"email" }).sort({createdAt:-1})
    return order
  }
  async dashboardDetails(){
 const totalUsers=await this.userModel.countDocuments({
  role: { $ne: UserRole.ADMIN }
 })
 const totalProducts=await this.productModel.countDocuments()
 const totalOrders=await this.orderModel.countDocuments()
 const sale=await this.orderModel.aggregate([
  {
    $match:{paymentStatus:"PAID"}},
    {
      $group:{
        _id:null,
          total:{$sum:"$totalAmount"}

        
      
    }
  }

 ])
 const totalSales=sale[0].total||0
 return {
  totalUsers,totalOrders,totalProducts,totalSales
 }
  }
  async getSale() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  const salesLast30Days = await this.orderModel.aggregate([
    {
      $match: {
        paymentStatus: 'PAID',
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        total: { $sum: '$totalAmount' },
      },
    },
    { $sort: { '_id': 1 } },
  ]);

  
  const salesMap: { [key: string]: number } = {};
  salesLast30Days.forEach((s) => {
    salesMap[s._id] = s.total;
  });

 
  const last30Days: { date: string; total: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    last30Days.push({
      date: dateStr,
      total: salesMap[dateStr] || 0,
    });
  }

  return last30Days;
}

}
