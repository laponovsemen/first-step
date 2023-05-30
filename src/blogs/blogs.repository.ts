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
  async getAllBlogs(blogsPagination: paginationCriteriaType) {
    const filter: { name?: any } = {}
    if (blogsPagination.searchNameTerm) {
      filter.name = {$regex: blogsPagination.searchNameTerm, $options: 'gi'}
    }
    const pageSize = blogsPagination.pageSize;
    const regex = blogsPagination.searchNameTerm
    const totalCount = await this.blogModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = blogsPagination.pageNumber;
    const sortBy = blogsPagination.sortBy;
    const sortDirection: 'asc' | 'desc' = blogsPagination.sortDirection;
    const ToSkip = blogsPagination.pageSize * (blogsPagination.pageNumber - 1);



    const result = await this.blogModel
      .find(filter)
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
  async getAllPostsForSpecificBlog(paginationCriteria: paginationCriteriaType, blogId: string,) {
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


      console.log(
        {
          pageSize: pageSize,
          totalCount: totalCount,
          pagesCount: pagesCount,
          page: page,
          items: result,
        },
        'its fucking result',
      );
      return {
        pageSize: pageSize,
        totalCount: totalCount,
        pagesCount: pagesCount,
        page: page,
        items: result.map(item => this.common.mongoPostSlicing(item)),
      };
    }

  async createNewBlog(DTO: any) {
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
    const createdBlog = await this.blogModel.create(blogToCreate);
    return {
      id: createdBlog._id,
      name,
      description,
      websiteUrl,
      isMembership,
      createdAt
    }
  }
  async getBlogById(id: string) {
    const blogId = this.common.tryConvertToObjectId(id)
    if (!blogId) {
      return null
    }
    const foundBlog = await this.blogModel.findOne({ _id: blogId });
    return {
      id: foundBlog._id,
      name: foundBlog.name,
      description: foundBlog.description,
      websiteUrl: foundBlog.websiteUrl,
      isMembership: foundBlog.isMembership,
      createdAt: foundBlog.createdAt
    }
  }
  async updateBlogById(DTO: any, id: string) {
    const blogId = this.common.tryConvertToObjectId(id)
    if (!blogId) {
      return null
    }
    const updateResult = await this.blogModel.updateOne({ _id: blogId }, { $set: DTO });
    return updateResult.matchedCount === 1
  }
  async deleteBlogById(id: string) {
    const blogId = this.common.tryConvertToObjectId(id)
    if (!blogId) {
      return null
    }
    const deletedBlog = await this.blogModel.deleteOne({ _id: blogId });
    return deletedBlog.deletedCount === 1
  }
  async createPostForSpecificBlog(DTO: any, id: string) {
    const createdAt = new Date()
    const blog = await this.blogModel.findOne({_id : new ObjectId(id)})
    if(!blog){
      return null
    }
    const newPost: APIPost = {
      title: DTO.title, //    maxLength: 30
      shortDescription: DTO.shortDescription, //maxLength: 100
      content: DTO.content, // maxLength: 1000
      blogId: new ObjectId(id),
      blogName : blog.name,
      createdAt: createdAt,

    }
    const createdPostForSpecificBlog = await this.postModel.create(newPost);
    console.log(newPost + "newPost")
    return this.common.mongoPostSlicing(createdPostForSpecificBlog)
  }
  async deleteAllData(){
    await this.blogModel.deleteMany({})
  }
}
