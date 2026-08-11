import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Types } from 'mongoose';
import { InternalServerErrorException } from '@nestjs/common';
import { parse } from 'path';
import { Rating } from 'src/rating/schema/rating.schema';
import { RatingDocument } from 'src/rating/schema/rating.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>
  ) { }
  async getProducts(page, limit) {
    const skip = (page - 1) * limit
    const products = await this.productModel.find().skip(skip).limit(limit)
    const total = await this.productModel.countDocuments();

    return {
      data: products,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  async getAllProducts(page, limit) {
    const skip = (page - 1) * limit
    const products = await this.productModel.find().skip(skip).limit(limit)
    const total = await this.productModel.countDocuments()
    return {
      products,
      totalPages: Math.ceil(total / limit)
    }
  }
  async fetchProductById(id: string) {
    try {
      const product = await this.productModel.findById(id);

      if (!product) {
        return { success: false };
      }

      return { success: true, product };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  async editProduct(id: string, data: any) {
    try {
      const product = await this.productModel.findByIdAndUpdate(id, data, { new: true });

      if (!product) {
        return {
          success: false,
          msg: "Product not found or something went wrong",
        };
      }

      return {
        success: true,
        product,
        msg: "Updated successfully",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        msg: "Internal server error",
      };
    }
  }
  async addProduct(data, req, files) {
    const addedBy = new Types.ObjectId(req.user.UserId)
    const product = await this.productModel.create({
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      addedBy,
      images: files.map(file => `http://localhost:3005/uploads/${file.filename}`)

    })
    if (product) {
      return { success: true, msg: "Product added successfully" }
    }
    if (!product) {
      return { success: false, msg: "Something went wrong!" }
    }
  }
  async getProductById(id) {
    const product = await this.productModel.findById(id)
    return {
      success: true,
      product
    }
  }
  async getProduct() {
    const product = await this.productModel.find()
    return {
      success: true
      , product
    }
  }

  async deleteProduct(id: string) {
    try {
      const product = await this.productModel.findByIdAndDelete(id);
      if (!product) {
        return { success: false, msg: "Product not found" };
      }
      return { success: true, msg: "Product deleted successfully" };
    } catch (error) {
      console.error("Delete product error:", error);
      return { success: false, msg: "Internal server error" };
    }
  }

}
