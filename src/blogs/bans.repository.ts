import { InjectModel, Prop } from "@nestjs/mongoose";
import {
  APIPost, Ban,
  Blog,
  BlogDocument,
  BloggerBansForSpecificBlog,
  BloggerBansForSpecificBlogDocument,
  BloggerBansForSpecificBlogSchema,
  NewestLike,
  PostDocument
} from "../mongo/mongooseSchemas";
import { Model } from 'mongoose';
import { paginationCriteriaType } from '../appTypes';
import { Common } from '../common';
import { ObjectId } from 'mongodb';
import { Injectable } from "@nestjs/common";
import { BanBlogDTO, BanUserByBloggerDTO } from "../input.classes";

@Injectable()
export class BansRepository {
  constructor(
    @InjectModel(BloggerBansForSpecificBlog.name) private banModel: Model<BloggerBansForSpecificBlogDocument>,
    protected readonly common: Common,
  ) {}
  async banUserForSpecificBlog(ownerId : string, userToBanId, DTO : BanUserByBloggerDTO){
    const blogId = DTO.blogId
    const BlackListExists = await this.banModel.findOne({
      blogId : new ObjectId(blogId),
      userId : new ObjectId(ownerId),
    })

    const newBan = {
      banReason: DTO.banReason,
      userId: new ObjectId(userToBanId),
      banDate: new Date().toISOString(),
    }

    if(!BlackListExists){
      const newBlackList = {
        userId: new ObjectId(ownerId),
        blogId: new ObjectId(blogId),
        listOfBans: [newBan]
      }
      await this.banModel.create(newBlackList)
    } else {
      BlackListExists.updateOne({
        blogId : new ObjectId(blogId),
        userId : new ObjectId(ownerId),
         },
        {
          $push:{
            newBan
           }
        })

    }
  }

  async unbanUserForSpecificBlog(blogId: any) {

  }
}
