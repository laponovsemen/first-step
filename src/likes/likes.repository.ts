import { LikeStatusDTO } from "../input.classes";
import { ObjectId } from "mongodb";
import { InjectModel } from "@nestjs/mongoose";
import { APILike, LikesDocument, parentTypeEnum } from "../mongo/mongooseSchemas";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LikeRepository{
  constructor(@InjectModel(APILike.name) private  likesModel : Model<LikesDocument>) {
  }
  async createNewLike(Like : APILike){

  }

  async likePost(DTO: LikeStatusDTO, Id: string, login : string, postId: string) {
    const dateOfCreation = new Date()
    const parentId = new ObjectId(postId)
    const  parentType = parentTypeEnum.post
      const  createdAt = dateOfCreation
    const  userId = new ObjectId(Id)
    const  status = DTO.likeStatus

    const newLikeToCreate : APILike = {
    parentId : parentId,
    parentType : parentType,
    createdAt : createdAt,
    userId : userId,
    status : status,
      }
    const createdLike =  await this.likesModel.create({
      parentId : parentId,
      parentType : parentType,
      createdAt : createdAt,
      userId : userId,
      status : status,
    })
    return true
  }
}