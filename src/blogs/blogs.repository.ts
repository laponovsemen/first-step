import { InjectModel, Prop } from "@nestjs/mongoose";
import {
  APIPost,
  Blog,
  BlogDocument, NewestLike,
  PostDocument
} from "../mongo/mongooseSchemas";
import { Model } from 'mongoose';
import { paginationCriteriaType } from '../appTypes';
import { Common } from '../common';
import { ObjectId } from 'mongodb';
import { Injectable } from "@nestjs/common";

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(APIPost.name) private postModel: Model<PostDocument>,
    protected readonly common: Common,
  ) {}
  async getAllBlogs(postsPagination: paginationCriteriaType) {
    const pageSize = postsPagination.pageSize;
    const totalCount = await this.blogModel.countDocuments({});
    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = postsPagination.pageNumber;
    const sortBy = postsPagination.sortBy;
    const sortDirection: 'asc' | 'desc' = postsPagination.sortDirection;
    const ToSkip = postsPagination.pageSize * (postsPagination.pageNumber - 1);

    const result = await this.blogModel
      .find({})
      .sort({ [sortBy]: sortDirection })
      .skip(ToSkip)
      .limit(pageSize)
      .lean() //.exec()

    if (result) {
      const items = result.map((item) => {
        return this.common.mongoBlogSlicing(item);
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
  async getAllPostsForSpecificBlog(
    paginationCriteria: paginationCriteriaType,
    blogId: string,
  ) {
    const pageSize = paginationCriteria.pageSize;
    const totalCount = await this.blogModel.countDocuments({});
    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = paginationCriteria.pageNumber;
    const sortBy = paginationCriteria.sortBy;
    const sortDirection: 'asc' | 'desc' = paginationCriteria.sortDirection;
    const ToSkip =
      paginationCriteria.pageSize * (paginationCriteria.pageNumber - 1);

    const result = await this.postModel
      .find({ blogId: new ObjectId(blogId) }) //
      .sort({ [sortBy]: sortDirection })
      .skip(ToSkip)
      .limit(pageSize);

    if (result) {
      const items = result

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
  createNewBlog(DTO: any) {
    const createdBlog = new this.blogModel(DTO);
    return createdBlog.save();
  }
  getBlogById(id: string) {
    return this.blogModel.findOne({ _id: new ObjectId(id) });
  }
  updateBlogById(DTO: any, id: string) {
    return this.blogModel.updateOne({ _id: new ObjectId(id) }, { $set: DTO });
  }
  deleteBlogById(id: string) {
    return this.blogModel.deleteOne({ _id: new ObjectId(id) });
  }
  createPostForSpecificBlog(DTO: any, id: string) {
    const createdAt = new Date()
    const newPost : APIPost = {
      title: DTO.title, //    maxLength: 30
      shortDescription: DTO.shortDescription, //maxLength: 100
      content: DTO.string, // maxLength: 1000
      blogId: DTO.blogId,
      blogName: DTO.blogName,
      createdAt: createdAt,

    }
    return this.postModel.create(newPost);
  }
  async deleteAllData(){
    await this.blogModel.deleteMany({})
  }
}
