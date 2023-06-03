import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { APIComment, CommentsDocument } from "../mongo/mongooseSchemas";
import { ObjectId } from "mongodb";
import { CommentForSpecifiedPostDTO } from "../input.classes";

@Injectable()
export class CommentsRepository{
  constructor(@InjectModel(APIComment.name) private  commentsModel : Model<CommentsDocument>) {
  }
  async deleteAllData(){
    await this.commentsModel.deleteMany({})
  }
  async createNewComment(newComment : APIComment){
    console.log(newComment, 'in repo');
    return await this.commentsModel.create(newComment)
  }

  getCommentById(commentId: string) {
    return this.commentsModel.findOne({_id : new ObjectId(commentId)})
  }

  deleteCommentById(commentId: string) {
    return this.commentsModel.deleteOne({_id : new ObjectId(commentId)})
  }

  async updateCommentById(commentId: string, DTO: CommentForSpecifiedPostDTO) {
    const content = DTO.content
    return this.commentsModel.updateOne({_id : new ObjectId(commentId)}, {$set: {content : content}})
  }
}