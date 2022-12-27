import {Router} from "express";
import {refreshTokenValidationMiddleware} from "../../main/middlewares/refreshToken-validation-middleware";
import {container} from "../../main/composition-root";
import {SecurityController} from "./security-controller";

const securityController = container.resolve(SecurityController)

export const securityRouter = Router({})

securityRouter.get('/devices', refreshTokenValidationMiddleware, securityController.getDevices.bind(securityController))
securityRouter.delete('/devices', refreshTokenValidationMiddleware, securityController.deleteDevices.bind(securityController))
securityRouter.delete('/devices/:id', refreshTokenValidationMiddleware, securityController.deleteDevice.bind(securityController))