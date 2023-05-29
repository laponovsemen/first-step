import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { paginationCriteriaType } from '../appTypes';
import { ObjectId } from "mongodb";


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

}
@Schema()
export class APIPostDTO {
  title: string; //    maxLength: 30
  shortDescription: string; //maxLength: 100
  content: string; // maxLength: 1000
  blogId: ObjectId;
  blogName: string;
  createdAt: Date;
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
  createdAt: Date;
}
export class APIComment {
  id: ObjectId;
  content: string;
  commentatorInfo: {
    "userId": string,
    "userLogin": string
  };
  createdAt: Date
}
export class User {

  id: string;
  login: string;
  email: string;
  password : string
  createdAt: Date

}
export type BlogDocument = HydratedDocument<Blog>;
export type PostDocument = HydratedDocument<APIPost>;
export type CommentsDocument = HydratedDocument<APIComment>;
export type UsersDocument = HydratedDocument<User>;
export type NewestLikeDocument = HydratedDocument<NewestLike>;
export const BlogsSchema = SchemaFactory.createForClass(Blog);
export const PostsSchema = SchemaFactory.createForClass(APIPost);
export const CommentsSchema = SchemaFactory.createForClass(APIComment);
export const UsersSchema = SchemaFactory.createForClass(User);
