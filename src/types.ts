import {Request} from "express";

export type RequestWithParam<P> = Request<P>
export type RequestWithBody<B> = Request<{}, {}, B>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamAndBody<P, B> = Request<P, {}, B>
export type RequestWithParamAndQuery<P, Q> = Request<P, {}, {}, Q>
export type RequestWithParamAndBodyAndQuery<P, B, Q> = Request<P, {}, B, Q>