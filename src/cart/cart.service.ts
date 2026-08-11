import { Injectable, BadRequestException, InternalServerErrorException,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, cartDocument } from './schema/cart.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<cartDocument>) {}

  async addCart(req, data) {
    try {
    
      if (!data || !data.productId || !data.price || !data.quantity) {
        throw new BadRequestException("productId, price, and quantity are required");
      }

      const cart = await this.cartModel.findOne({ userId: req.user.userId });

      if (!cart) {
        
        await this.cartModel.create({
          userId: req.user.userId,
          items: [
            {
              productId: data.productId,
              priceAtAdded: data.price,
              quantity: data.quantity,
            },
          ],
        });
      } else {
   
        const existingProduct = cart.items.find(
          (item) => item.productId.toString() === data.productId
        );

        if (existingProduct) {

          existingProduct.quantity += data.quantity;
        } else {
          cart.items.push({
            productId: data.productId,
            priceAtAdded: data.price,
            quantity: data.quantity || 1,
          });
        }

        await cart.save();
      }

      return { success: true, msg: "Added to cart" };
    } catch (err) {
      console.error("CartService.addCart error:", err);
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException("Failed to add to cart");
    }
  }
  // async updateQty(req,data){
  //   try{
  //        const cart=await this.cartModel.findOne({userId:req.user.userId})
  //        if(!cart){
  //         throw new NotFoundException("Cart not found")
  //        }
  //        const existingProduct=await cart.items.find((id)=>id.productId.toString()==data.productId)
  //        if(!existingProduct){
  //         throw new NotFoundException("Product not found")
  //        }
  //        existingProduct.quantity=data.quantity
  //        await cart.save()
  //        return {success:true}

  //   }catch(err){
  //     if(err instanceof NotFoundException) throw err
  //     throw new InternalServerErrorException("Internal server problem")

  //   }

  // }



  async updateQty(req,data){
    if(data.action=="INC"){
    const res=await this.cartModel.updateOne(
      {
        userId:req.user.userId,
        "items.productId":data.productId,
        
      },{
        $inc:{"items.$.quantity":1}
      }
    )
    if(res.matchedCount==0){
      throw new NotFoundException("Product not found")
    }return {success:true}}
    if(data.action=="DEC"){
      const res=await this.cartModel.updateOne(
        {
          userId:req.user.userId,
          "items.productId":data.productId,
          "items.quantity":{$gt:1}
        },
        {$inc:{"items.$.quantity":-1}}
      )
       return {success:true}
    }
    
  }
  async deleteItem(req,id){
    try{
        const res=await this.cartModel.updateOne(
         { userId:req.user.userId},
         {
          $pull:{
            items:{
              productId:id
            }
          }
         }



        )
        if(res.modifiedCount==0){
           throw new NotFoundException("Product not found")
        }
        return {success:true}
    }catch(err){
      if(err instanceof NotFoundException) throw err
      throw new InternalServerErrorException("Internal server error")

    }
  }
async getCart(req) {
  const userId = req.user.userId;
  const cart = await this.cartModel.findOne({ userId }).populate('items.productId');

  
  if (!cart) {
    return { items: [] };
  }

  const items = cart.items
    .filter(item => item.productId) 
    .map(item => {
      const product = item.productId as any;
      return {
        productId: product._id,
        stock:product.stock,
        image: product.images[0],
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: item.quantity,
        priceAtAdded: item.priceAtAdded,
      };
    });

  return { items };
}

async productExist(req,id){
  const isExist=await this.cartModel.exists({
    userId:req.user.userId,
    "items.productId":id
  })
  return{success:!!isExist}
}
async delAllCart(req){
  const del=await this.cartModel.deleteMany({userId:req.user.userId})
  if(del){
    return {success:true}
  }
}

}
