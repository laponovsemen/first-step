import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('password-recovery')
  @HttpCode(HttpStatus.OK)
  passwordRecovery(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.OK)
  newPassword(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.OK)
  registrationConfirmation(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('registration')
  @HttpCode(HttpStatus.OK)
  registration(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.OK)
  registrationEmailResending(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}