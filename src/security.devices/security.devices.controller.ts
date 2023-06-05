import { Controller, Delete, Get, Query, Req, Res, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";
import { SecurityDevicesRepository } from "./security.devices.repository";
import { SecurityDevicesService } from "./security.devices.service";

@Controller()
export class SecurityDevicesController{
  constructor(protected readonly securityDevicesService : SecurityDevicesService) {
  }

  @Get()
  async getAllDevicesForCurrentUser(@Req() req: Request,
                                    @Res({ passthrough: true }) res: Response,
                                    @Query() QueryParams,) {
    const refreshToken = req.cookies.refreshToken

    const result = await this.securityDevicesService.getAllDevicesForCurrentUser(refreshToken)
    if (!result) {
      throw new UnauthorizedException()
    }
    return result
  }


  @Delete()
  async deleteAllOtherDevices (@Req() req: Request,
                          @Res({ passthrough: true }) res: Response){

  }

  @Delete()
  async deleteDeviceById (@Req() req: Request,
                          @Res({ passthrough: true }) res: Response){

  }
}