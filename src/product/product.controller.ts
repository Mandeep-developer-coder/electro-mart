import {
  Controller,
  Post,
  Get,
  Query,
  UseGuards,
  Param,
  Put,
  Body,
  UseFilters,
  UploadedFiles,
  Req, Patch,
  UseInterceptors,
  Delete
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UserRole } from 'src/user/enum/user-role.enum';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { ProductService } from './product.service';

import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('products')
export class ProductController {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private readonly productService: ProductService,
  ) { }

  @Post('seed')
  async seedProducts() {
    const res = await fetch(
      'https://dummyjson.com/products/category/smartphones?limit=30',
    );
    const data = await res.json();

    const products = data.products;
    const adminId = new Types.ObjectId('6a799ab0fd623c3cd52dd47c');

    const formatted = products.map((p) => ({
      title: p.title,
      description: p.description,
      price: p.price,
      images: p.images,
      category: p.category,
      brand: p.brand,
      rating: p.rating,
      stock: p.stock,
      addedBy: adminId,
    }));

    await this.productModel.insertMany(formatted);

    return {
      message: '✅ Products seeded successfully',
      count: formatted.length,
    };
  }

  //   @Get()
  //   async getAllProducts() {
  //     return this.productModel
  //       .find()
  //       .populate('addedBy', 'name email role');
  //   }
  @Get()
  getProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('category') category?: string,
  ) {
    return this.productService.getProducts(Number(page), Number(limit), category);
  }
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('get-products')
  getAllProducts(@Query('page') page: string, @Query('limit') limit: string) {
    return this.productService.getAllProducts(Number(page), Number(limit));
  }
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('fetch-product/:id')
  fetchProductById(@Param('id') id: string) {
    return this.productService.fetchProductById(id);
  }
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('edit-product/:id')
  editProduct(@Param('id') id: string, @Body() data) {
    return this.productService.editProduct(id, data);
  }
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('add-products')
  @UseInterceptors(FilesInterceptor("images", 10, {
    storage: diskStorage({
      destination: "./uploads",
      filename: (req, file, cb) => {
        const fileName = Date.now() + extname(file.originalname)
        cb(null, fileName)
      }
    })
  }))
  addProducts(@Body() data, @Req() req, @UploadedFiles() files: Express.Multer.File[]) {
    return this.productService.addProduct(data, req, files)
  }
  @Get('getProductById/:id')
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id)

  }

  @Get('getProducts')
  getProduct() {
    return this.productService.getProduct()
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('delete-product/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

}
