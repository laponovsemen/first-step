import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { emailDTO, UserDTO } from "../users/users.controller";
import { jwtConstants } from "./constants";
import { UsersRepository } from "../users/users.reposiroty";
import { EmailAdapter } from "./email.adapter";
import { Common } from "../common";


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
    private emailAdapter: EmailAdapter,
    private common: Common,
  ) {}

  async signIn(loginOrEmail : string, pass : string) {

    const user = await this.usersService.findUserByLoginOrEmail(loginOrEmail, pass);
    console.log(user)
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { userId : user._id, login : user.login, };
    return {
      access_token: await this.jwtService.signAsync(payload, {secret :jwtConstants.secret}),
      refresh_token: await this.jwtService.signAsync(payload, {expiresIn: '12h', secret :jwtConstants.secret}),
    };
  }

  async registration(userDTO: UserDTO) {
    const login : string = userDTO.login
    const email : string = userDTO.email
    const password : string = userDTO.password
    const foundUserByLogin = await this.usersRepository.findUserByLogin(login)
    const foundUserByEmail = await this.usersRepository.findUserByEmail(email)
    const credentialsExists = foundUserByLogin || foundUserByEmail
    if (credentialsExists) {
      return null
    } else {
      const user = await this.usersRepository.createUnconfirmedUser(login, password, email)
      if (user) {
        const info = await this.emailAdapter.sendEmail(email, user.code)
        return true
      } else {
        return null
      }
    }

  }

  async registrationEmailResending(emailFromFront: emailDTO) {
    const email = emailFromFront.email
    const UserExists = await this.usersRepository.findUserByEmail(email)
    const confirmationCode = this.common.createEmailSendCode()
    if (!UserExists) {
      await this.emailAdapter.sendEmail(email, confirmationCode)
      return true
    } else {
      await this.emailAdapter.sendEmail(email, confirmationCode)
      await this.usersRepository.changeUsersConfirmationCode(UserExists._id, confirmationCode)
      return true
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
}