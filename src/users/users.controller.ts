import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { paginationCriteriaType } from "../appTypes";
import { Common } from "../common";
import { IsNotEmpty, Length, Matches } from "class-validator";
import { AuthGuard, BasicAuthGuard } from "../auth/auth.guard";

export class UserDTO {
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login : string //maxLength: 10 minLength: 3 pattern: ^[a-zA-Z0-9_-]*$

  @IsNotEmpty()
  @Length(6, 20)
  password: string // maxLength: 20 minLength: 6
  @IsNotEmpty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email : string // pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
}

@UseGuards(BasicAuthGuard)
@Controller('users')
export class UsersController{
  constructor(protected readonly usersService : UsersService,
              protected readonly common : Common) {
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@Query() QueryParams){
    const paginationCriteria: paginationCriteriaType =
      this.common.getPaginationCriteria(QueryParams);
    return this.usersService.getAllUsers(paginationCriteria)
  }


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() DTO : UserDTO){
    return await this.usersService.createUser(DTO)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserById(@Param("id") id){
    const result = await this.usersService.deleteUserById(id)
    if (!result){
      throw new NotFoundException("not found")
    }
    return
  }
}