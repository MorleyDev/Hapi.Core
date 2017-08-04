import * as hapi from "hapi";
import { Injector } from "injection-js";
import { Observable } from "rxjs/Observable";

export enum Method {
	Get,
	Put,
	Post,
	Delete
}

export type Request = {
	readonly method: Method;
	readonly params: { [key: string]: string | undefined };
	readonly headers: { [key: string]: string | undefined };
	readonly body: null | string | any;
};

export type Response = {
	readonly statusCode?: number;
	readonly body?: string | Buffer;
	readonly headers?: { [key: string]: string | undefined };
};

export type RouteDecorator = ((route: RouteDescriptor, container: Injector) => RouteDescriptor);

export type RouteFilterAsync = (request: Request) => Promise<boolean> | Observable<boolean>;

export type RouteFilter = (request: Request) => boolean;

export type RouteProcess = (request: Request) => Promise<Response> | Observable<Response>;

export type RouteDescriptor = {
	readonly method?: Method;
	readonly path?: string;
	readonly process: RouteProcess;
	readonly decorators?: RouteDecorator[];
	readonly filters?: RouteFilterAsync[];
	readonly priority?: number;
}

export type RouteHandler = Readonly<hapi.RouteConfiguration>;
