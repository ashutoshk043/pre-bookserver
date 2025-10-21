import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './models/product_model';
import { CreateProductDto } from './dtos/create_product';
import { UpdateProductDto } from './dtos/update_product';
import { Model } from 'mongoose';

@Injectable()
export class ProductserviceService {
  constructor(
    @InjectModel(Product.name,'ordersConnection') private readonly productModel: Model<ProductDocument>,
  ) {}

  // 🔹 Create Product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = new this.productModel(createProductDto);
      return await product.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create product', error.message);
    }
  }

  // 🔹 Update Product
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        { $set: updateProductDto },
        { new: true },
      );
      if (!updatedProduct) throw new NotFoundException('Product not found');
      return updatedProduct;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product', error.message);
    }
  }

  // 🔹 Soft Delete / Hide Product
  async hideProduct(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findByIdAndUpdate(
        id,
        { $set: { isDeleted: true, isAvailable: false } },
        { new: true },
      );
      if (!product) throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      throw new InternalServerErrorException('Failed to hide product', error.message);
    }
  }

  // 🔹 Restore Product
  async restoreProduct(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findByIdAndUpdate(
        id,
        { $set: { isDeleted: false, isAvailable: true } },
        { new: true },
      );
      if (!product) throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      throw new InternalServerErrorException('Failed to restore product', error.message);
    }
  }

  // 🔹 Hard Delete Product
  async hardDelete(id: string): Promise<boolean> {
    try {
      const result = await this.productModel.findByIdAndDelete(id);
      if (!result) throw new NotFoundException('Product not found');
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete product', error.message);
    }
  }

  // 🔹 Find All Products
  async findAll(): Promise<Product[]> {
    try {
      return await this.productModel.find({ isDeleted: false }).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch products', error.message);
    }
  }

  // 🔹 Find Products by Restaurant
  async findByRestaurant(restaurantId: string): Promise<Product[]> {
    try {
      return await this.productModel.find({ restaurantId, isDeleted: false }).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch products for restaurant', error.message);
    }
  }
}
