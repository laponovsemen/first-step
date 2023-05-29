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
}