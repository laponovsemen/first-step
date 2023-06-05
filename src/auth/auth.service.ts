import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { jwtConstants } from "./constants";
import { UsersRepository } from "../users/users.reposiroty";
import { EmailAdapter } from "./email.adapter";
import { Common } from "../common";
import { emailDTO, UserDTO } from "../input.classes";
import { User } from "../mongo/mongooseSchemas";
import { ObjectId } from "mongodb";
import { SecurityDevicesRepository } from "../security.devices/security.devices.repository";


type payloadType = {
  userId: string,
  login: string,
  iat: number,
  exp: number

}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
    private securityDevicesRepository: SecurityDevicesRepository,
    private emailAdapter: EmailAdapter,
    private common: Common,
  ) {}

  async signIn(user : User, ip : string, title : string, deviceId : ObjectId) {

    const payload = { userId : user._id.toHexString(), login : user.login,ip, title,deviceId };
    console.log(user._id.toHexString(), "user._id user._id");
    return {
      access_token: await this.jwtService.signAsync(payload, {expiresIn: '10s',secret :jwtConstants.secret}),
      refresh_token: await this.jwtService.signAsync(payload, {expiresIn: '20s', secret :jwtConstants.secret}),
    };
  }

  async registration(userDTO: UserDTO) {
    const login : string = userDTO.login
    const email : string = userDTO.email
    const password : string = userDTO.password
    const foundUserByLogin = await this.usersRepository.findUserByLogin(login)
    const foundUserByEmail = await this.usersRepository.findUserByEmail(email)
    if (foundUserByLogin) {
      return {result : false, field : "login"}
    } else if (foundUserByEmail) {
      return {result : false, field : "email"}
    } else {
        const user = await this.usersRepository.createUnconfirmedUser(login, password, email)
        const info = await this.emailAdapter.sendEmail(email, user.code)
        return {result : true, field : null}
      }
    }


  async registrationEmailResending(emailFromFront: emailDTO) {
    const email = emailFromFront.email
    const UserExists = await this.usersRepository.findUserByEmail(email)

    const confirmationCode = this.common.createEmailSendCode()
    if (!UserExists) {
      return {result : false, field : "email", message : "user email doesnt exist"}
    } else if (UserExists.isConfirmed) {
      return {result : false, field : "email", message : "email already confirmed"}
    } else{
      const UserStatus = UserExists.code

      await this.emailAdapter.sendEmail(email, confirmationCode)
      await this.usersRepository.changeUsersConfirmationCode(UserExists._id, confirmationCode)
      return {result : true, field : null, message : null}
    }
  }

  async registrationConfirmation(codeDTO: {code : string}) {
    const code = codeDTO.code
    const foundUser = await this.usersRepository.findUserByRegistrationCode(code)
    if(!foundUser){
      return null
    }
    const foundUserCodeFreshness = await this.usersRepository.findUserCodeFreshness(foundUser)
    if(!foundUserCodeFreshness){
      return null
    }
    await this.usersRepository.makeUserConfirmed(foundUser)
    return true
  }

  async getUserByToken(accessToken: any) {
    if(!accessToken){
      return null
    }
    const veriable = accessToken.split(" ")[1]
    console.log(veriable, "veriable");
    const payload = this.jwtService.decode(accessToken.split(" ")[1] )
    //if (typeof payload === "string") return undefined;
    if (!payload) return null;
    const userId = (payload as payloadType).userId

    //console.log(userId)
    console.log(userId, " userId")
    console.log(payload, " payload")
    //console.log(accessToken, "accessToken in getUserByToken");

    return await this.usersRepository.findUserById(userId)

  }

  async refreshToken(refreshToken: string) {
    const refreshTokenVerification = await this.verifyRefreshToken(refreshToken)
    if (!refreshTokenVerification) {
      console.log("refreshTokenVerification is failed" );
      return null
    }
    const lastActiveDate = new Date()
    const deviceId =  refreshTokenVerification.deviceId
    refreshTokenVerification.lastActiveDate = lastActiveDate
    console.log(refreshTokenVerification)
    const payload = { userId : refreshTokenVerification._id.toHexString(),
      login : refreshTokenVerification.login,
      ip : refreshTokenVerification.ip,
      title: refreshTokenVerification.title,
      deviceId: refreshTokenVerification.deviceId.toString() }

    const newAccessToken = await this.jwtService.signAsync(payload, {expiresIn: '10h',secret :jwtConstants.secret})
    const newRefreshToken = await this.jwtService.signAsync(payload, {expiresIn: '20h',secret :jwtConstants.secret})
    const updatedSession = await this.securityDevicesRepository.updateSessionByDeviceId(deviceId, lastActiveDate, newRefreshToken)
    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  public async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret
      })
    } catch (e) {
      return null
    }
  }

  async logout(refreshToken: string) {
    const refreshTokenVerification = await this.verifyRefreshToken(refreshToken)
    if (!refreshTokenVerification) {
      return null
    }
    const deviceId : string = refreshTokenVerification.deviceId
    return await this.securityDevicesRepository.deleteDeviceById(deviceId)
  }
}