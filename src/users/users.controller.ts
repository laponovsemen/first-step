import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { paginationCriteriaType } from "../appTypes";
import { Common } from "../common";


@Controller('users')
export class UsersController{
  constructor(protected readonly usersService : UsersService,
              protected readonly common : Common) {
  }
  @Get()
  async getAllUsers(@Query() QueryParams){
    const paginationCriteria: paginationCriteriaType =
      this.common.getPaginationCriteria(QueryParams);
    return this.usersService.getAllUsers(paginationCriteria)
  }


  @Post()
  async createUser(@Body() DTO){
    return this.usersService.createUser(DTO)
  }


  @Delete(':id')
  async deleteUserById(@Param("id") id){
    return this.usersService.deleteUserById(id)
  }
}