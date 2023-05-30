import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentsDocument, User, UsersDocument } from "../mongo/mongooseSchemas";
import { Common } from "../common";
import { paginationCriteriaType } from "../appTypes";

@Injectable()
export class UsersRepository{
  constructor(@InjectModel(User.name) private  usersModel : Model<UsersDocument>,
              protected readonly common : Common){

  };
  async deleteAllData(){
    await this.usersModel.deleteMany({})
  }
  async getAllUsers(paginationCriteria: paginationCriteriaType) {

    const searchLoginTerm = paginationCriteria.searchLoginTerm
    const searchEmailTerm = paginationCriteria.searchEmailTerm
    let searchParams = []
    if (searchEmailTerm) searchParams.push({ email: { $regex: searchEmailTerm, $options: "i" } })
    if (searchLoginTerm) searchParams.push({ login: { $regex: searchLoginTerm, $options: "i" } })

    let filter: { $or?: any[] } = { $or: searchParams }
    if (searchParams.length === 0) filter = {}


    const pageSize = paginationCriteria.pageSize;
    const totalCount = await this.usersModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = paginationCriteria.pageNumber;
    const sortBy = paginationCriteria.sortBy;
    const sortDirection: 'asc' | 'desc' = paginationCriteria.sortDirection;
    const ToSkip = paginationCriteria.pageSize * (paginationCriteria.pageNumber - 1);


    const result = await this.usersModel
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(ToSkip)
      .limit(pageSize)
      .lean() //.exec()
    const items = result.map((item) => {
      return this.common.mongoUserSlicing(item)
    })


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

  async createUser(DTO: any) {
    const dateOfCreation = new Date()
    const login = DTO.login
    const password = DTO.password
    const email = DTO.email
    const createdAt = dateOfCreation
    const newlyCreatedUser = await this.usersModel.create({
      login,
      password,
      email,
      createdAt
    })
    console.log(newlyCreatedUser);
    console.log({
      login,
      password,
      email,
      createdAt
    });
    return {
      id: newlyCreatedUser._id,
      login,
      email,
      createdAt
    }
  }

  async deleteUserById(id: string) {
    const userId = this.common.tryConvertToObjectId(id)
    if (!userId) {
      return null
    }
    const deletedUser = await this.usersModel.deleteOne({ _id: userId })
    return deletedUser.deletedCount === 1
  }
}