import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { hash } from 'bcryptjs'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(@Body() body: any) {
    const { name, email, password } = body

    const usersWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (usersWithSameEmail) {
      throw new ConflictException('An user with the same email already exists')
    }

    const passwordHash = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password_hash: passwordHash,
      },
    })
  }
}
