import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post, Req, Res, UnauthorizedException, UseGuards
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { Public, RefreshToken } from "./decorators/public.decorator";
import { Response, Request } from "express";
import { AuthGuard, RefreshTokenAuthGuard } from "./auth.guard";
import { tr } from "date-fns/locale";
import { emailDTO, LoginDTO, UserDTO } from "../input.classes";
import { JwtService } from "@nestjs/jwt";
import {randomUUID} from "crypto";
import { SecurityDevicesRepository } from "../security.devices/security.devices.repository";
import { UsersService } from "../users/users.service";
import { Common } from "../common";
import { ObjectId } from "mongodb";


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
              protected readonly jwtService : JwtService,
              protected readonly common : Common,
              protected readonly usersService : UsersService,
              protected readonly securityDevicesRepository : SecurityDevicesRepository,
              ) {}

  @Post('password-recovery')
  @HttpCode(HttpStatus.OK)
  passwordRecovery(@Body() signInDto: Record<string, any>) {
  }

  @Post('new-password')
  @HttpCode(HttpStatus.OK)
  newPassword(@Body() signInDto: Record<string, any>) {
  }
  //@UseGuards(AuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req : Request,
              @Res() res: Response,
              @Body() signInDto: LoginDTO) {

    const ip = req.ip
    const title = req.headers["user-agent"] || 'Default UA'
    const lastActiveDate = new Date()
    const deviceId = new ObjectId(this.common.mongoObjectId())
    const user = await this.usersService.findUserByLoginOrEmail(signInDto.loginOrEmail, signInDto.password);
    console.log(user)
    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException();
    }


    const result = await this.authService.signIn(user, ip, title, deviceId);
    const newSession = await this.securityDevicesRepository.createNewSession(user._id.toString(),
      ip,
      title,
      lastActiveDate,
      deviceId,
      result.refresh_token)

    res.cookie('refreshToken', result.refresh_token, { httpOnly: true, secure: true })
    res.status(200).send({
      accessToken: result.access_token
    })
  }
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request,
                     @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken
    console.log(refreshToken);

    const result = await this.authService.refreshToken(refreshToken)
    if (!result) {
      throw new UnauthorizedException()
    }
    return result
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Res() res : Response,
                                 @Body() codeDTO: {code : string}) {
    const result = await this.authService.registrationConfirmation(codeDTO)
    if(!result){
      res.status(400).json({errorsMessages: [{ message: "Code already confirmed", field: "code" }]})
      return
    }
      res.status(204).json({})

  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(
    @Res() res : Response,
    @Body() userDTO: UserDTO) {
    const result = await this.authService.registration(userDTO)
    if(!result.result){
      res.status(400).json({ errorsMessages: [{ message: "email already confirmed", field: result.field }] })
    }
    res.status(204).json({})

  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Res() res: Response,
                                   @Body() email: emailDTO) {
    const result = await this.authService.registrationEmailResending(email)
    if (!result.result) {
      res.status(HttpStatus.BAD_REQUEST).json({errorsMessages: [{ message: result.message, field: result.field }]})
    }
    res.status(HttpStatus.NO_CONTENT).json({})

  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request,
               @Res({ passthrough: true }) res: Response,
               @Body() signInDto: Record<string, any>) {
    const refreshToken = req.cookies.refreshToken

    const result = await this.authService.logout(refreshToken)
    if (!result) {
      throw new UnauthorizedException()
    }
    return result
  }


  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Res() res: Response,
                   @Req() req : Request) {
    const accessToken = req.headers.authorization
    const refreshToken = req.cookies.refreshToken
    const refreshTokenValidation = this.jwtService.verify(refreshToken)
    if (!refreshTokenValidation) {
      throw new UnauthorizedException()
    }
    const user = await this.authService.getUserByToken(accessToken)
    return user;
  }
}