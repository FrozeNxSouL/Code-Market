import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('categories')
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getCategories() {
    return this.prisma.category.findMany({
      where: { status: 'ACTIVE' },
    });
  }
}
