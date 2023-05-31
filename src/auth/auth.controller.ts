import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request, Res, UseGuards
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { emailDTO, LoginDTO, UserDTO } from "../users/users.controller";
import { Response } from "express";
import { AuthGuard } from "./auth.guard";
import { tr } from "date-fns/locale";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  async login(@Res() res: Response,
              @Body() signInDto: LoginDTO) {

    const result = await this.authService.signIn(signInDto.loginOrEmail, signInDto.password);
    res.cookie('refreshToken', result.refresh_token, { httpOnly: true, secure: true })
    res.status(200).send({
      accessToken: result.access_token
    })
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() signInDto: Record<string, any>) {
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Res() res : Response,
                                 @Body() codeDTO: {code : string}) {
    const result = await this.authService.registrationConfirmation(codeDTO)
    if(!result){
      res.status(400).json({errorsMessages: [{ message: "Code already confirmed", field: "code" }]})
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
      res.status(HttpStatus.NO_CONTENT).json({errorsMessages: [{ message: result.message, field: result.field }]})
    }
    res.status(HttpStatus.NO_CONTENT).json({})

  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() signInDto: Record<string, any>) {
  }

  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}