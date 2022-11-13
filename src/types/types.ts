import {Request} from "express";
import {TypeURIParamsModel} from "../models/URIParamsModel";

export type RequestWithParam= Request<TypeURIParamsModel>
export type RequestWithBody<B> = Request<{}, {}, B>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamAndBody<B> = Request<TypeURIParamsModel, {}, B>
export type RequestWithParamAndQuery<Q> = Request<TypeURIParamsModel, {}, {}, Q>
//export type RequestWithParamAndBodyAndQuery<P, B, Q> = Request<P, {}, B, Q>