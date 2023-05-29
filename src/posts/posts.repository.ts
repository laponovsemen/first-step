import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { APIPost, Blog, BlogDocument } from "../mongo/mongooseSchemas";
import { Model } from "mongoose";
import { ObjectId } from "mongodb";
import { paginationCriteriaType } from "../appTypes";

@Injectable()
export class PostsRepository{
  constructor( @InjectModel(APIPost.name) private postsModel: Model<APIPost>,
               @InjectModel(Blog.name) private blogsModel: Model<Blog>,
               ) {
  }
  async createNewPost(DTO: any){
    const blogId = DTO.blogId
    const createdAt = new Date()
    const blog = await this.blogsModel.findOne({_id : new ObjectId(blogId)})
    const newPost = {
      title: DTO.title, //    maxLength: 30
      shortDescription: DTO.shortDescription, //maxLength: 100
      content: DTO.content, // maxLength: 1000
      blogId: new ObjectId(blogId),
      blogName : blog.name,
      createdAt: createdAt,
    }

  }

  async getPostById(id : string) {
    return this.postsModel.findOne({_id: new ObjectId(id)})
  }
  async deleteAllData(){
    await this.postsModel.deleteMany({})
  }

  async getAllCommentsForSpecificPosts(paginationCriteria: paginationCriteriaType, id: string) {
    const foundPost = await this.postsModel.findOne({ _id: new ObjectId(id) })
    if (!foundPost) {
      return null
    } else {
      return foundPost
    }

  }
}