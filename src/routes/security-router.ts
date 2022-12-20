import {Router} from "express";
import {refreshTokenValidationMiddleware} from "../middlewares/refreshToken-validation-middleware";
import {securityController} from "../composition-root";

export const securityRouter = Router({})

securityRouter.get('/devices', refreshTokenValidationMiddleware, securityController.getDevices.bind(securityController))
securityRouter.delete('/devices', refreshTokenValidationMiddleware, securityController.deleteDevices.bind(securityController))
securityRouter.delete('/devices/:id', refreshTokenValidationMiddleware, securityController.deleteDevice.bind(securityController))