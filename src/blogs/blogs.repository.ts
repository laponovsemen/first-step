import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../mongo/mongooseSchemas';
import { Model } from 'mongoose';
import {
  paginationCriteriaType,
  PaginatorBlogViewModelType,
} from '../appTypes';
import { Common } from '../common';
import { ObjectId } from 'mongodb';

export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
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
      .find({}) //
      .sort({ [sortBy]: sortDirection })
      .skip(ToSkip)
      .limit(pageSize);

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
  createNewBlog(DTO: any) {
    const createdBlog = new this.blogModel(DTO);
    return createdBlog.save();
  }
  getBlogById(id : string) {
    const foundBlog = this.blogModel.findOne({ _id: new ObjectId(id) });
    return foundBlog;
  }
  updateBlogById(id: string) {
    const foundBlog = this.blogModel.findOne({ _id: new ObjectId(id) });
    return foundBlog;
  }
}
