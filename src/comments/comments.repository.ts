import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentsDocument } from "../mongo/mongooseSchemas";

@Injectable()
export class CommentsRepository{
  constructor(@InjectModel(Comment.name) private  commentsModel : Model<CommentsDocument>) {
  }
  async deleteAllData(){
    await this.commentsModel.deleteMany({})
  }
}