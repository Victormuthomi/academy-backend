import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

/**
 * User registration controller
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users/register
   */
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.usersService.create(createUserDto);
    // Return user info without password
    const { password, ...result } = user.toObject();
    return result;
  }
}
