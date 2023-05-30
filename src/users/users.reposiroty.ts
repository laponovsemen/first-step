import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentsDocument, User, UsersDocument } from "../mongo/mongooseSchemas";
import { Common } from "../common";

@Injectable()
export class UsersRepository{
  constructor(@InjectModel(User.name) private  usersModel : Model<UsersDocument>,
              protected readonly common : Common){

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

  async deleteUserById(id: string) {
    const userId = this.common.tryConvertToObjectId(id)
    if (!userId) {
      return null
    }
    const deletedUser = await this.usersModel.deleteOne({ _id: userId })
    return deletedUser.deletedCount === 1
  }
}