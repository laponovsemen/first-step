import { ObjectId } from 'mongodb';
import { Mongoose } from 'mongoose';
import { BlogViewModelType, PostDBModel } from './appTypes';
import { APIPost, WithMongoId } from "./mongo/mongooseSchemas";
import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class Common {



 tryConvertToObjectId = (id: string): Types.ObjectId | null => {
  try {
    const convertedId = new Types.ObjectId(id);
    return convertedId;
  } catch (e) {
    return null;
  }
}
  getPaginationCriteria(QueryParams: any) {
    const searchNameTerm = QueryParams.searchNameTerm
      ? QueryParams.searchNameTerm.toString()
      : null;
    const pageNumber: number = QueryParams.pageNumber
      ? parseInt(QueryParams.pageNumber.toString(), 10)
      : 1;
    const pageSize: number = QueryParams.pageSize
      ? parseInt(QueryParams.pageSize.toString(), 10)
      : 10;
    const sortBy: string = QueryParams.sortBy
      ? QueryParams.sortBy.toString()
      : 'createdAt';
    const sortDirection: 'asc' | 'desc' =
      QueryParams.sortDirection === 'asc' ? 'asc' : 'desc';
    return {
      searchNameTerm,
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
}
