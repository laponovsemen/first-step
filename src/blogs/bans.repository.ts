import { InjectModel, Prop } from "@nestjs/mongoose";
import {
  APIPost, BanInfoDB,
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
    const banExists = await this.banModel.findOne({
      blogId : new ObjectId(blogId),
      ownerId : new ObjectId(ownerId),
      userId : new ObjectId(userToBanId)
    })
    const userToBan = await this.usersRepository.findUserById(userToBanId)
    if(!userToBan){
      return null
    }

    if(!banExists && DTO.isBanned ){
      const newBan = {
        ownerId : new ObjectId(ownerId),
        blogId: new ObjectId(blogId),
        banInfo : {
          banDate: new Date().toISOString(),
          banReason: DTO.banReason,
          isBanned: DTO.isBanned,
        },
        userId: new ObjectId(userToBanId),
        login: userToBan.login,
      }
      await this.banModel.create(newBan)
      return true
    } else {
      if (banExists && !DTO.isBanned) {
        await this.banModel.deleteMany({
          ownerId : new ObjectId(ownerId),
          blogId: new ObjectId(blogId),
          userId : new ObjectId(userToBanId)})
        return true
      } else {
        return true
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
        return this.common.mongoBanSlicing(item);
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

  async deleteAllData() {
    await  this.banModel.deleteMany({})
  }

  async findBanStatusForSpecificUser(blogId: string, commentatorId: string) {
    return this.banModel.findOne({ blogId: new ObjectId(blogId), userId: new ObjectId(commentatorId) });
  }
}
