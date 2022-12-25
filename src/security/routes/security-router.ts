import {Router} from "express";
import {refreshTokenValidationMiddleware} from "../../main/middlewares/refreshToken-validation-middleware";
import {securityController} from "../../main/composition-root";

export const securityRouter = Router({})

securityRouter.get('/devices', refreshTokenValidationMiddleware, securityController.getDevices.bind(securityController))
securityRouter.delete('/devices', refreshTokenValidationMiddleware, securityController.deleteDevices.bind(securityController))
securityRouter.delete('/devices/:id', refreshTokenValidationMiddleware, securityController.deleteDevice.bind(securityController))