import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { APIComment, CommentsDocument } from "../mongo/mongooseSchemas";
import { ObjectId } from "mongodb";
import { CommentForSpecifiedPostDTO } from "../input.classes";
import { Common } from "../common";
import { LikeRepository } from "../likes/likes.repository";

@Injectable()
export class CommentsRepository{
  constructor(@InjectModel(APIComment.name) private  commentsModel : Model<CommentsDocument>,
              protected readonly common : Common,
              protected readonly likeRepository : LikeRepository,
  ) {
  }
  async deleteAllData(){
    await this.commentsModel.deleteMany({})
  }
  async createNewComment(newComment : APIComment){
    console.log(newComment, 'in repo');
    return await this.commentsModel.create(newComment)
  }

  async getCommentById(commentIdFromService: string, userId: string) {
    const commentId = this.common.tryConvertToObjectId(commentIdFromService)
    if (!commentId) {
      return null
    }
    const foundComment = await this.commentsModel.findOne({ _id: commentId })
    if (!foundComment) {
      return null
    } else {
      console.log(userId, "userId in getPostById");
      const foundCommentFrame = this.common.mongoCommentSlicing(foundComment)
      const likesCount = await this.likeRepository.findLikesCountForSpecificComment(commentId)
      const dislikesCount = await this.likeRepository.findDisikesCountForSpecificComment(commentId)
      const myLike = await this.likeRepository.findMyStatusForSpecificComment(commentId, userId)
      foundCommentFrame.likesInfo.likesCount = likesCount
      foundCommentFrame.likesInfo.dislikesCount = dislikesCount
      foundCommentFrame.likesInfo.myStatus = myLike ? myLike.status : "None"
      //console.log(foundPostFrame);
      //console.log(foundPostFrame, "foundPostFrame");
      console.log(myLike, "myLike");
      //console.log(userId , "userId");
      return foundCommentFrame
    }
  }

  deleteCommentById(commentId: string) {
    return this.commentsModel.deleteOne({_id : new ObjectId(commentId)})
  }

  async updateCommentById(commentId: string, DTO: CommentForSpecifiedPostDTO) {
    const content = DTO.content
    return this.commentsModel.updateOne({_id : new ObjectId(commentId)}, {$set: {content : content}})
  }

  async getCommentByIdWithOutLikes(commentId: string) {
    return this.commentsModel.findOne({ _id: new ObjectId(commentId) });
  }
}