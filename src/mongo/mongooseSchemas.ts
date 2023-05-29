/*
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { paginationCriteriaType } from '../appTypes';

export type NewestLikeDocument = HydratedDocument<NewestLike>;
export type WithMongoId<Type> = Type & { _id: ObjectId };
export type WithPagination<Type> = Type & paginationCriteriaType;
@Schema()
export class NewestLike {
  @Prop()
  addedAt: Date;
  @Prop()
  userId: string;
  @Prop()
  login: string;
}

export type APIPostDocument = HydratedDocument<APIPost>;
@Schema()
export class APIPost {
  @Prop()
  title: string; //    maxLength: 30
  @Prop()
  shortDescription: string; //maxLength: 100
  @Prop()
  content: string; // maxLength: 1000
  @Prop()
  blogId: ObjectId;
  @Prop()
  blogName: string;
  @Prop()
  createdAt: Date;
  @Prop()
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: number;
    newestLikes: [NewestLike] | [];
  };
}
@Schema()
export class APIPostDTO {
  title: string; //    maxLength: 30
  shortDescription: string; //maxLength: 100
  content: string; // maxLength: 1000
  blogId: string;
  blogName: string;
  createdAt: string;
}

@Schema()
export class Blog {
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  websiteUrl: string;
  @Prop()
  isMembership: boolean;
  @Prop()
  createdAt: string;
}
export type BlogDocument = HydratedDocument<Blog>;
export type PostDocument = HydratedDocument<APIPost>;
export const BlogsSchema = SchemaFactory.createForClass(Blog);
*/
