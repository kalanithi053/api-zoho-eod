import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { User } from "../schema/user.schema";
import { CreateUserDto } from "../dto/create-user.dto";

@ApiTags("User")
@Controller("user")
export class UserController {
  private readonly looger = new Logger(UserService.name);
  constructor(private readonly userService: UserService) {}

  @Get("users")
  @ApiOperation({
    summary: "Fetch all users",
  })
  async getAllusers() {
    return await this.userService.findAll();
  }

  @Post("users")
  @ApiOperation({
    summary: "Upsert user",
  })
  async postUser(@Body() user: CreateUserDto) {
    return await this.userService.upsertUser(user);
  }
}
