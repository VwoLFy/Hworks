import {Request} from "express";
import {URIParamsModelType} from "../models/URIParamsModel";

export type RequestWithParam = Request<URIParamsModelType>
export type RequestWithBody<B> = Request<{}, {}, B>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamAndBody<B> = Request<URIParamsModelType, {}, B>
export type RequestWithParamAndQuery<Q> = Request<URIParamsModelType, {}, {}, Q>
//export type RequestWithParamAndBodyAndQuery<P, B, Q> = Request<P, {}, B, Q>
