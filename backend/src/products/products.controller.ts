import {
  Controller, Get, Param, Query, Post, Body, UseGuards,
  NotFoundException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getProducts(@Query() query: any) {
    const { search, category, sort, page = 1 } = query;
    const take = 10;
    const skip = (page - 1) * take;

    let where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (category) {
      where.tags = { some: { categoryId: category } };
    }

    let orderBy: any = { createdAt: 'desc' }; // default: newest
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'score_desc') orderBy = { score: 'desc' };

    const total = await this.prisma.product.count({ where });
    const data = await this.prisma.product.findMany({
      where,
      orderBy,
      take,
      skip,
      include: { user: { select: { id: true, name: true, accountName: true, type: true } } },
    });

    return { data, total, page: Number(page) };
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, accountName: true, accountImage: true } },
        tags: { include: { category: true } },
        feedbacks: { include: { user: { select: { id: true, name: true } } } },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Get(':id/feedback')
  async getProductFeedbacks(@Param('id') id: string) {
    return this.prisma.productFeedback.findMany({
      where: { productId: id },
      include: { user: { select: { id: true, name: true, accountName: true, accountImage: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/feedback')
  async submitFeedback(
    @Param('id') id: string,
    @Body() body: { score: number; text: string; type: string },
    @CurrentUser() user: { id: string },
  ) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!body.score || !body.text || !body.type) {
      throw new BadRequestException('score, text, and type are required');
    }

    return this.prisma.productFeedback.create({
      data: {
        productId: id,
        userId: user.id,
        score: body.score,
        text: body.text,
        type: body.type,
        status: 'PUBLISHED',
      },
    });
  }
}
