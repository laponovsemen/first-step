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
    const foundBlog = await this.blogModel.findOne({_id : new  ObjectId(blogId)}).lean()
    if(!foundBlog) {
      return null
    }
    const pageSize = paginationCriteria.pageSize;
    const totalCount = await this.postModel.countDocuments({blogId : new ObjectId(blogId)});
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
    const createdAt = new Date()
    const description = DTO.description
    const isMembership = false
    const name = DTO.name
    const websiteUrl = DTO.websiteUrl

    const blogToCreate = {
      name,
      description,
      websiteUrl,
      isMembership,
      createdAt
    }
    const createdBlog = new this.blogModel(blogToCreate);
    createdBlog.save();
    return {
      id : createdBlog._id,
      name,
      description,
      websiteUrl,
      isMembership,
      createdAt
    }
  }
  async getBlogById(id: string) {
    const foundBlog = await this.blogModel.findOne({ _id: new ObjectId(id) });
    return {
      id: foundBlog._id,
      name: foundBlog.name,
      description: foundBlog.description,
      websiteUrl: foundBlog.websiteUrl,
      isMembership: foundBlog.isMembership,
      createdAt: foundBlog.createdAt
    }
  }
  updateBlogById(DTO: any, id: string) {
    return this.blogModel.updateOne({ _id: new ObjectId(id) }, { $set: DTO });
  }
  deleteBlogById(id: string) {
    return this.blogModel.deleteOne({ _id: new ObjectId(id) });
  }
  async createPostForSpecificBlog(DTO: any, id: string) {
    const createdAt = new Date()
    const blog = await this.blogModel.findOne({_id : new ObjectId(id)})
    const newPost: APIPost = {
      title: DTO.title, //    maxLength: 30
      shortDescription: DTO.shortDescription, //maxLength: 100
      content: DTO.content, // maxLength: 1000
      blogId: new ObjectId(id),
      blogName : blog.name,
      createdAt: createdAt,

    }
    const createdPostForSpecificBlog = await this.postModel.create(newPost);
    return this.common.mongoPostSlicing(createdPostForSpecificBlog)
  }
  async deleteAllData(){
    await this.blogModel.deleteMany({})
  }
}
