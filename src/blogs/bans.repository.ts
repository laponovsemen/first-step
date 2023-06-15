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
import { UsersRepository } from "../users/users.reposiroty";

@Injectable()
export class BansRepository {
  constructor(
    @InjectModel(BloggerBansForSpecificBlog.name) private banModel: Model<BloggerBansForSpecificBlogDocument>,
    protected readonly common: Common,
    protected readonly usersRepository: UsersRepository,
  ) {}
  async banUserForSpecificBlog(ownerId : string, userToBanId : string, DTO : BanUserByBloggerDTO){
    const blogId = DTO.blogId
    const BlackListExists = await this.banModel.findOne({
      blogId : new ObjectId(blogId),
      userId : new ObjectId(ownerId),
    })
    const userToBan = await  this.usersRepository.findUserById(userToBanId)
    const newBan = {
      banInfo:{
        banReason: DTO.banReason,
        banDate: new Date().toISOString(),
        isBanned : true
      },
      userId: new ObjectId(userToBanId),
      login : userToBan.login
    }

    if(!BlackListExists && DTO.isBanned){
      const newBlackList = {
        userId: new ObjectId(ownerId),
        blogId: new ObjectId(blogId),
        listOfBans: [newBan]
      }
      await this.banModel.create(newBlackList)
    } else {
      if (DTO.isBanned) {
        await this.banModel.updateOne({
            blogId: new ObjectId(blogId),
            userId: new ObjectId(ownerId)
          },
          {
            $push: {
              newBan
            }
          });
      } else {
        await this.banModel.updateOne({
            blogId: new ObjectId(blogId),
            userId: new ObjectId(ownerId)
          },
          {
            $pull: {
              userId : new ObjectId(userToBanId)
            }
          });
      }
    }
  }

  async unbanUserForSpecificBlog(blogId: any) {

  }

  async getAllBannedUsersForSpecificBlog(paginationCriteria: paginationCriteriaType, userId: string, blogId: string) {
    const filter: { name?: any } = {}
    if (paginationCriteria.searchNameTerm) {
      filter.name = { $regex: paginationCriteria.searchNameTerm, $options: 'i' }
    }
    const pageSize = paginationCriteria.pageSize;
    const totalCount = await this.banModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = paginationCriteria.pageNumber;
    const sortBy = paginationCriteria.sortBy;
    const sortDirection: 'asc' | 'desc' = paginationCriteria.sortDirection;
    const ToSkip = paginationCriteria.pageSize * (paginationCriteria.pageNumber - 1);


    const result = await this.banModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(ToSkip)
      .limit(pageSize)
      .lean() //.exec()

    if (result) {
      const items = result.map((item) => {
        return this.common.mongoBlogSlicingWithoutBlogOwnerInfo(item);
      });
      const array = await Promise.all(items);
      console.log(
        {
          pageSize: pageSize,
          totalCount: totalCount,
          pagesCount: pagesCount,
          page: page,
          items: array,
        },
        'its fucking result',
      );
      return {
        pageSize: pageSize,
        totalCount: totalCount,
        pagesCount: pagesCount,
        page: page,
        items: array,
      };
    }
  }
}
