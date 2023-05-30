import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { APIComment, APIPost, Blog, BlogDocument } from "../mongo/mongooseSchemas";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { paginationCriteriaType } from "../appTypes";
import { Common } from "../common";

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(APIPost.name) private postsModel: Model<APIPost>,
              @InjectModel(Blog.name) private blogsModel: Model<Blog>,
              @InjectModel(APIComment.name) private commentsModel: Model<APIComment>,
              protected readonly common: Common
  ) {
  }

  async createNewPost(DTO: any) {
    const blogId = DTO.blogId
    const createdAt = new Date()
    const blog = await this.blogsModel.findOne({ _id: new ObjectId(blogId) })
    const newPost = {
      title: DTO.title, //    maxLength: 30
      shortDescription: DTO.shortDescription, //maxLength: 100
      content: DTO.content, // maxLength: 1000
      blogId: new ObjectId(blogId),
      blogName: blog.name,
      createdAt: createdAt,
    }
    const createdPost = await this.postsModel.create(newPost)
    return {
      id: createdPost._id,
      title: DTO.title, //    maxLength: 30
      shortDescription: DTO.shortDescription, //maxLength: 100
      content: DTO.content, // maxLength: 1000
      blogId: new ObjectId(blogId),
      blogName: blog.name,
      createdAt: createdAt,
      extendedLikesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: "None",
        newestLikes: [],
      },
    }

  }

  async getPostById(id: string) {
    const postId = this.common.tryConvertToObjectId(id)
    if (!postId) {
      return null
    }
    const foundPost = await this.postsModel.findOne({ _id: postId })
    if (!foundPost) {
      return null
    } else {
      return this.common.mongoPostSlicing(foundPost)
    }
  }

  async getAllPosts(paginationCriteria: paginationCriteriaType) {

    const pageSize = paginationCriteria.pageSize;
    const totalCount = await this.postsModel.countDocuments({});
    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = paginationCriteria.pageNumber;
    const sortBy = paginationCriteria.sortBy;
    const sortDirection: 'asc' | 'desc' = paginationCriteria.sortDirection;
    const ToSkip = paginationCriteria.pageSize * (paginationCriteria.pageNumber - 1);

    const result = await this.postsModel
      .find({})
      .sort({ [sortBy]: sortDirection })
      .skip(ToSkip)
      .limit(pageSize)
      .lean() //.exec()
    const items = result.map((item) => {
      return this.common.mongoPostSlicing(item)
    });

    console.log(
      {
        pageSize: pageSize,
        totalCount: totalCount,
        pagesCount: pagesCount,
        page: page,
        items: items,
      },
      'its fucking result',
    );
    return {
      pageSize: pageSize,
      totalCount: totalCount,
      pagesCount: pagesCount,
      page: page,
      items: items,
    };
  }
  async deletePostById(id : string) {
    return this.postsModel.deleteOne({_id: new ObjectId(id)})
  }
  async updatePostById( DTO : any, id : string) {
    return this.postsModel.updateOne({_id: new ObjectId(id)}, {$set : {
        shortDescription : DTO.shortDescription,
        content : DTO.content,
        title : DTO.title,
      }})
  }
  async deleteAllData(){
    await this.postsModel.deleteMany({})
  }

  async getAllCommentsForSpecificPosts(paginationCriteria: paginationCriteriaType, id: string) {
    const foundPost = await this.postsModel.findOne({ _id: new ObjectId(id) })
    if (!foundPost) {
      return null
    } else {
      const pageSize = paginationCriteria.pageSize;
      const totalCount = await this.commentsModel.countDocuments({postId : new ObjectId(id)});
      const pagesCount = Math.ceil(totalCount / pageSize);
      const page = paginationCriteria.pageNumber;
      const sortBy = paginationCriteria.sortBy;
      const sortDirection: 'asc' | 'desc' = paginationCriteria.sortDirection;
      const ToSkip =
        paginationCriteria.pageSize * (paginationCriteria.pageNumber - 1);

      const result = await this.commentsModel
        .find({ postId: new ObjectId(id) }) //
        .sort({ [sortBy]: sortDirection })
        .skip(ToSkip)
        .limit(pageSize);
    }

  }
}