import { LikeStatusDTO } from "../input.classes";
import { ObjectId } from "mongodb";
import { InjectModel } from "@nestjs/mongoose";
import { APILike, LikesDocument, parentTypeEnum, StatusTypeEnum } from "../mongo/mongooseSchemas";
import { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { Common } from "../common";

@Injectable()
export class LikeRepository{
  constructor(@InjectModel(APILike.name) private  likesModel : Model<LikesDocument>,
              protected readonly common : Common) {
  }
  async createNewLike(Like : APILike){

  }

  async likePost(DTO: LikeStatusDTO, Id: string, login : string, postId: string) {
    const dateOfCreation = new Date()
    const parentId = new ObjectId(postId)
    const  parentType = parentTypeEnum.post
    const  addedAt = dateOfCreation
    const  userId = new ObjectId(Id)
    const  status = DTO.likeStatus

    const newLikeToCreate : APILike = {
      parentId: parentId,
      parentType: parentType,
      addedAt: addedAt,
      userId: userId,
      login: login,
      status: status
    }
    const createdLike =  await this.likesModel.create({
      parentId : parentId,
      parentType : parentType,
      addedAt : addedAt,
      userId : userId,
      login: login,
      status : status,
    })
    return true
  }

  async findLikesCountForSpecificPost(postId: Types.ObjectId) {
    const likes = await this.likesModel.find({ $and: [
        { parentId: postId},
        {  parentType: parentTypeEnum.post},
        { status: StatusTypeEnum.Like }
      ]})
      .lean().exec();
    return likes.length
  }

  async findDisikesCountForSpecificPost(postId: Types.ObjectId) {
    const dislikes = await this.likesModel.find({ $and: [
        {parentId: postId},
        {parentType: parentTypeEnum.post},
        {status: StatusTypeEnum.Dislike},]
    })
    return dislikes.length

  }

  async findNewestLikesForSpecificPost(postId: Types.ObjectId) {
    const likesFilter = { $and: [{ parentId: postId }, { parentType: parentTypeEnum.post }, { status: StatusTypeEnum.Like }] }
    const newestLikesToUpdate = await this.likesModel.find(likesFilter, { _id: 0, login: 0, parentId: 0, parentType:0 }).sort({ addedAt: "desc" }).limit(3)

    console.log(newestLikesToUpdate, " newestLikesToUpdate")
    return newestLikesToUpdate
  }

  async findMyStatusForSpecificPost(postId: Types.ObjectId, userIdAsString: string) {
    const userId = this.common.tryConvertToObjectId(userIdAsString)
    if(!userId){
      return null
    }
    return this.likesModel.findOne({
      $and:
        [
          { parentId: postId },
          { parentType: parentTypeEnum.post },
          { userId: new ObjectId(userId) }
        ]
    });
  }
}