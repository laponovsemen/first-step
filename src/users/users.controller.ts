import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UsersService } from "./users.service";


@Controller('users')
export class UsersController{
  constructor(protected readonly usersService : UsersService) {
  }
  @Get()
  async getAllUsers(){

    return this.usersService.getAllUsers()
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