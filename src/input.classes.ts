import { IsEnum, IsNotEmpty, IsNotIn, IsObject, IsString, IsUrl, Length, Matches, Validate } from "class-validator";
import { Transform } from "class-transformer";
import { StatusTypeEnum } from "./mongo/mongooseSchemas";

export class CommentForSpecifiedPostDTO{
  @IsNotEmpty()
  @Length(20, 300)
  content : string // string minLength: 20 maxLength: 300
}

export class LikeStatusDTO {
  @IsEnum(StatusTypeEnum)
  //@IsNotIn(["None", "Like", "Dislike"])
  likeStatus : StatusTypeEnum
}
export class PostForSpecificBlogDTO{
  @Transform(item => item.value.trim() )
  @IsNotEmpty()
  @Length(1, 30)
  title: string //maxLength: 30

  @Transform(item => item.value.trim() )
  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string // maxLength: 100

  @Transform(item => item.value.trim() )
  @IsNotEmpty()
  @Length(1, 1000)
  content: string // maxLength: 1000
}


export class BlogDTO {
  @Transform(item => item.value.trim() )
  @IsNotEmpty()
  @Length(1, 15)
  name : string // maxLength: 15

  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  description: string // maxLength: 500

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @Length(1, 100)
  websiteUrl : string // maxLength: 100 pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}

export class PostDTO {
  @Transform(item => item.value.trim() )
  @IsNotEmpty()
  @Length(1, 30)
  title: string //maxLength: 30
  @Transform(item => item.value.trim() )
  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string // maxLength: 100
  @Transform(item => item.value.trim() )
  @IsNotEmpty()
  @Length(1, 1000)
  content: string // maxLength: 1000
  @Transform(item => item.value.trim() )
  @IsNotEmpty()
  //@Validate(UserExistsRule)
  blogId: string
}

export class UserDTO {
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login : string //maxLength: 10 minLength: 3 pattern: ^[a-zA-Z0-9_-]*$

  @IsNotEmpty()
  @Length(6, 20)
  password: string // maxLength: 20 minLength: 6
  @IsNotEmpty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email : string // pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
}

export class LoginDTO {
  @IsNotEmpty()
  loginOrEmail : string //maxLength: 10 minLength: 3 pattern: ^[a-zA-Z0-9_-]*$

  @IsNotEmpty()
  @Length(6, 20)
  password: string // maxLength: 20 minLength: 6
}
export class emailDTO {
  @IsNotEmpty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email : string //maxLength: 10 minLength: 3 pattern: ^[a-zA-Z0-9_-]*$

}