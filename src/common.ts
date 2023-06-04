import { ObjectId } from 'mongodb';
import { Mongoose } from 'mongoose';
import { BlogViewModelType, PostDBModel } from './appTypes';
import { APIComment, APILike, APIPost, commentatorInfoModel, User, WithMongoId } from "./mongo/mongooseSchemas";
import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import {v4 as uuidv4} from "uuid";
import { Prop } from "@nestjs/mongoose";

@Injectable()
export class Common {
  mongoObjectId = function () {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
      return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  }


 tryConvertToObjectId = (id: string): Types.ObjectId | null => {
  try {
    const convertedId = new Types.ObjectId(id);

    return convertedId;
  } catch (e) {
    return null;
  }
}
  NewestLikesTypeSlicing = (Obj2: APILike) => {
    return {
      addedAt : Obj2.addedAt,
      userId : Obj2.userId,
      login : Obj2.login
    }
  }
  getPaginationCriteria(QueryParams: any) {
    const searchNameTerm = QueryParams.searchNameTerm ? QueryParams.searchNameTerm.toString() : null;
    const searchLoginTerm = QueryParams.searchLoginTerm ? QueryParams.searchLoginTerm.toString() : null;
    const searchEmailTerm = QueryParams.searchEmailTerm ? QueryParams.searchEmailTerm.toString() : null;
    const pageNumber: number = QueryParams.pageNumber ? parseInt(QueryParams.pageNumber.toString(), 10) : 1;
    const pageSize: number = QueryParams.pageSize ? parseInt(QueryParams.pageSize.toString(), 10) : 10;
    const sortBy: string = QueryParams.sortBy ? QueryParams.sortBy.toString() : 'createdAt';
    const sortDirection: 'asc' | 'desc' = QueryParams.sortDirection === 'asc' ? 'asc' : 'desc';
    return {
      searchNameTerm,
      searchLoginTerm,
      searchEmailTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    };
  }
  mongoPostSlicing = (Obj2: WithMongoId<APIPost>) => {
    return {
      id: Obj2._id,
      title: Obj2.title,
      shortDescription: Obj2.shortDescription,
      content: Obj2.content,
      blogId: Obj2.blogId,
      blogName: Obj2.blogName,
      createdAt: Obj2.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: [],
      },
    };
  };
  mongoCommentSlicing = (Obj2: WithMongoId<APIComment>) => {
    return {
      id: Obj2._id,
      content: Obj2.content,
      commentatorInfo: Obj2.commentatorInfo,
      createdAt: Obj2.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
      },
    };
  };
  mongoBlogSlicing = (Obj2: BlogViewModelType) => {
    return {
      id: Obj2._id,
      name: Obj2.name,
      description: Obj2.description,
      websiteUrl: Obj2.websiteUrl,
      isMembership: Obj2.isMembership,
      createdAt: Obj2.createdAt,
    };
  };

  createEmailSendCode() {
    return uuidv4()
  }
  mongoUserSlicing = (Obj2: User) => {
    return {
      id: Obj2._id,
      login: Obj2.login,
      email: Obj2.email,
      createdAt : Obj2.createdAt
    };
  };


}
