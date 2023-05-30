import { Controller, Delete, Get, Post } from "@nestjs/common";
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
  async createUser(){
    return this.usersService.createUser()
  }


  @Delete()
  async deleteUserById(){
    return this.usersService.deleteUserById()
  }
}