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
    const myLike = await this.findMyStatusForSpecificPost(new ObjectId(postId), Id)
    const status = DTO.likeStatus
    if (!myLike) {
      const dateOfCreation = new Date()
      const parentId = new ObjectId(postId)
      const parentType = parentTypeEnum.post
      const addedAt = dateOfCreation
      const userId = new ObjectId(Id)


      const newLikeToCreate: APILike = {
        parentId: parentId,
        parentType: parentType,
        addedAt: addedAt,
        userId: userId,
        login: login,
        status: status
      }
      await this.likesModel.create({
        parentId: parentId,
        parentType: parentType,
        addedAt: addedAt,
        userId: userId,
        login: login,
        status: status,
      })
      return true
    } else {

      await this.changeMyLikeStatus(status, Id,  postId, parentTypeEnum.post)

      return true
    }
  }

  async changeMyLikeStatus(status : StatusTypeEnum, userId : string, parentId: string, parentType: parentTypeEnum){
    await this.likesModel.updateOne({$and:
        [
          {parentId : new ObjectId(parentId)},
          {parentType : parentType},
          {userId : new ObjectId(userId)}
        ]
    }, {
      $set: {
        status : status
      }
    })

  }

  async findLikesCountForSpecificPost(postId: ObjectId) {
    const likes = await this.likesModel.find({ $and: [
        { parentId: postId},
        {  parentType: parentTypeEnum.post},
        { status: StatusTypeEnum.Like }
      ]})
      .lean().exec();
    return likes.length
  }

  async findDisikesCountForSpecificPost(postId: ObjectId) {
    const dislikes = await this.likesModel.find({ $and: [
        {parentId: postId},
        {parentType: parentTypeEnum.post},
        {status: StatusTypeEnum.Dislike},]
    })
    return dislikes.length

  }

  async findNewestLikesForSpecificPost(postId:ObjectId) {
    const likesFilter = { $and: [{ parentId: postId }, { parentType: parentTypeEnum.post }, { status: StatusTypeEnum.Like }] }
    const newestLikesToUpdate = await this.likesModel.find(likesFilter, { _id: 0, status: 0, parentId: 0, parentType:0 }).sort({ addedAt: "desc" }).limit(3)

    console.log(newestLikesToUpdate, " newestLikesToUpdate")
    return newestLikesToUpdate
  }

  async findMyStatusForSpecificPost(postId: ObjectId, userIdAsString: string) {
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

  async deleteAllData(){
    await this.likesModel.deleteMany({})
  }
}