import { LikeStatusDTO } from "../input.classes";
import { ObjectId } from "mongodb";
import { InjectModel } from "@nestjs/mongoose";
import { APILike, LikesDocument, parentTypeEnum } from "../mongo/mongooseSchemas";
import { Model } from "mongoose";


export class LikeRepository{
  constructor(@InjectModel(APILike.name) private  likesModel : Model<LikesDocument>) {
  }
  async createNewLike(Like : APILike){

  }

  async likePost(DTO: LikeStatusDTO, userId: string, login : string, postId: string) {
    const dateOfCreation = new Date()
    const newLikeToCreate : APILike = {
    parentId : new ObjectId(postId),
    parentType : parentTypeEnum.post,
    createdAt : dateOfCreation,
    userId : new ObjectId(userId),
    status : DTO.likeStatus,
      }
    await this.likesModel.create({newLikeToCreate})
  }
}