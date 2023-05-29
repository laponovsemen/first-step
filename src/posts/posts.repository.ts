import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { APIPost, Blog, BlogDocument } from "../mongo/mongooseSchemas";
import { Model } from "mongoose";

@Injectable()
export class PostsRepository{
  constructor( @InjectModel(APIPost.name) private postsModel: Model<APIPost>,) {
  }
  async deleteAllData(){
    await this.postsModel.deleteMany({})
  }
}