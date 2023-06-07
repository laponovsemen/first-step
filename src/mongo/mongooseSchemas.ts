import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { paginationCriteriaType } from "../appTypes";
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

@Schema({_id: false, id: false, versionKey: false})
export class APIDeviceModel {
  @Prop({ type: String, required: true })
  ip:	string // IP address of device during signing in
  @Prop({ type: String, required: true })

  title:	string // Device name: for example Chrome 105 (received by parsing http header "user-agent")
  @Prop({ type: String, required: true })
  lastActiveDate:	string // Date of the last generating of refresh/access tokens
  @Prop({ type: String, required: true })
  deviceId:	string //  Id of connected device session
}
export const DeviceModelSchema = SchemaFactory.createForClass(APIDeviceModel);

@Schema()
export class APISession {
  _id?: ObjectId;
  @Prop({ type: ObjectId, required: true })
  userId: ObjectId;
  @Prop({ type: DeviceModelSchema, required: true })
  device: APIDeviceModel;
  @Prop({ type: String, required: true })
  refreshToken: string;
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
@Schema({_id: false, id: false, versionKey: false})
export class commentatorInfoModel {
  @Prop({ type: ObjectId, required: true })
  userId: ObjectId;
  @Prop({ type: String, required: true })
  userLogin: string;
}

const coIS= SchemaFactory.createForClass(commentatorInfoModel)

@Schema({versionKey: false})
export class APIComment {
  id?: ObjectId;
  @Prop({ type: String, required: true })
  content: string;
  @Prop({type: coIS, required : true})
  commentatorInfo: commentatorInfoModel;

  @Prop({ type: Date, required: true })
  createdAt: Date;
  @Prop({ type: ObjectId, required: true })
  postId : ObjectId
}

@Schema({versionKey: false})
export class APILike{
  _id?: ObjectId;
  @Prop({ type: ObjectId, required: true })
  parentId : ObjectId
  @Prop({ type: String, required: true })
  parentType :parentTypeEnum
  @Prop({ type: Date, required: true })
  addedAt : Date
  @Prop({ type: ObjectId, required: true })
  userId : ObjectId
  @Prop({ type: String, required: true })
  login : string
  @Prop({ type: String, required: true })
  status : StatusTypeEnum

}

export enum StatusTypeEnum {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}


export enum parentTypeEnum {
  comment = "comment",
  post = "post"
}
@Schema({versionKey: false})
export class User {
  //({type: ObjectId, required: true, unique: true, default: new ObjectId()})
  _id?: ObjectId;
  @Prop({ type: String, required: true })
  login: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  password: string
  @Prop({ type: Date, required: true })
  createdAt: Date
  @Prop()
  isConfirmed: boolean;
  @Prop()
  code: string | null;
  @Prop()
  codeDateOfExpiary: Date | null;
  @Prop({ type: Boolean, required: true })
  isBanned : boolean
}

export type BlogDocument = HydratedDocument<Blog>;
export type PostDocument = HydratedDocument<APIPost>;
export type CommentsDocument = HydratedDocument<APIComment>;
export type UsersDocument = HydratedDocument<User>;
export type SessionDocument = HydratedDocument<APISession>;
export type DeviceDocument = HydratedDocument<APIDeviceModel>;
export type LikesDocument = HydratedDocument<APILike>;
export const BlogsSchema = SchemaFactory.createForClass(Blog);
export const PostsSchema = SchemaFactory.createForClass(APIPost);
export const CommentsSchema = SchemaFactory.createForClass(APIComment);
export const UsersSchema = SchemaFactory.createForClass(User);
export const LikesSchema = SchemaFactory.createForClass(APILike);
export const SessionSchema = SchemaFactory.createForClass(APISession);
