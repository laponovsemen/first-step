import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentsDocument, User, UsersDocument } from "../mongo/mongooseSchemas";

@Injectable()
export class UsersRepository{
  constructor(@InjectModel(User.name) private  usersModel : Model<UsersDocument>){

  };
  async deleteAllData(){
    await this.usersModel.deleteMany({})
  }
  getAllUsers(){

  }

  async createUser(DTO: any) {
    const dateOfCreation = new Date()
    const newUser = {
      login: DTO.login,
      password: DTO.password,
      email: DTO.email,
      createdAt : dateOfCreation
    }
    const newlyCreatedUser = await this.usersModel.create(newUser)
    return {
      id: newlyCreatedUser._id,
      login: DTO.login,
      email: DTO.email,
      createdAt : dateOfCreation
    }
  }

  deleteUserById(){

  }
}