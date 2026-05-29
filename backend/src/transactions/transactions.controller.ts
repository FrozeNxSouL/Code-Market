import {
  Controller, Get, Post, Body, Param, UseGuards,
  NotFoundException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyTransactions(@CurrentUser() user: { id: string }) {
    return this.prisma.transaction.findMany({
      where: { userId: user.id },
      include: { product: { select: { id: true, name: true, price: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTransaction(
    @Body() body: { productId: string; paymentMethodId: string },
    @CurrentUser() user: { id: string },
  ) {
    const { productId, paymentMethodId } = body;
    if (!productId) {
      throw new BadRequestException('productId is required');
    }

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.transaction.create({
      data: {
        productId,
        userId: user.id,
        amount: product.price,
        description: `Purchase of ${product.name}`,
        status: 'COMPLETED',
        sourceInfo: paymentMethodId ? { paymentMethodId } : undefined,
      },
    });
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }
}
