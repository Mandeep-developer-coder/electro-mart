import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating } from './schema/rating.schema';
import { RatingDocument } from './schema/rating.schema';
import { Product } from 'src/product/schema/product.schema';
import { ProductDocument } from 'src/product/schema/product.schema';
import { Types } from 'mongoose';
@Injectable()
export class RatingService {
    constructor(@InjectModel(Rating.name) private ratingModel:Model<RatingDocument>,@InjectModel(Product.name) private productModel :Model<ProductDocument>){}
   async saveRating(data, req) {
  const userId = new Types.ObjectId(req.user.userId);
  const productId = new Types.ObjectId(data.productId);
  const orderId = new Types.ObjectId(data.orderId);

  await this.ratingModel.findOneAndUpdate(
    { userId, productId, orderId },
    { rating: data.star },
    { new: true, upsert: true }
  );

  const result = await this.ratingModel.aggregate([
    { $match: { productId: productId } },
    {
      $group: {
        _id: "$productId",
        avg: { $avg: "$rating" },
        count: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    await this.productModel.findByIdAndUpdate(productId, {
      $set: {
       rating:result[0].avg
      }
    });
  }

  return {
    success: true,
    msg: "Rating saved successfully"
  };
}


}
