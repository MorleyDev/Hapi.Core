import "rxjs/add/observable/from";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/concat";
import "rxjs/add/operator/defaultIfEmpty";
import "rxjs/add/operator/every";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/groupBy";
import "rxjs/add/operator/map";
import "rxjs/add/operator/max";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/reduce";
import "rxjs/add/operator/toArray";

import * as hapi from "hapi";
import { List } from "immutable";
import { Inject, Injector } from "injection-js";
import { Observable } from "rxjs/Observable";

import { Configuration } from "../Configuration";
import { Logger } from "../Logger";
import { BadRequestResponse, InternalServerErrorResponse, MethodNotSupported } from "./response.factory";
import { applyDecorators, createRoute, getMethodString } from "./route.factory";
import { Method, Request, Response, RouteDecorator, RouteDescriptor, RouteHandler } from "./route.model";
import { RouteService } from "./route.service";

export class RouteServiceImpl implements RouteService {
	constructor(
		@Inject(Configuration) private config: Configuration,
		@Inject(Injector) private injector: Injector,
		@Inject(Logger) private logger: Logger
	) {
	}

	public getRouteHandlers<T>(descriptors: RouteDescriptor[]): RouteHandler[] {
		return List(descriptors)
			.map(route => applyDecorators(route!, this.injector))
			.groupBy(descriptor => descriptor!.path)
			.map(group => group!.toArray())
			.toArray()
			.map(routes => this.getRouteHandlersForPath(routes))
			.reduce((prev, curr) => prev.concat(curr), []);
	}

	public getControllerRoutes(controller: any): RouteDescriptor[] {
		const controllerPrototype = Object.getPrototypeOf(controller);
		const sharedDecorators = Reflect.getMetadata(`hapi:route:decorators`, controllerPrototype) || [];
		const getRouteDecorators = (propertyKey: string): RouteDecorator[] => Reflect.getMetadata(`hapi:route:${propertyKey}:decorators`, controller) || [];

		return Object.keys(controllerPrototype)
			.filter(propertyKey => Reflect.getMetadata(`hapi:route:${propertyKey}`, controller) != null)
			.map(propertyKey => ({ propertyKey, decorators: sharedDecorators.concat(getRouteDecorators(propertyKey)) }))
			.map(property => createRoute(request => controller[property.propertyKey](request), ...property.decorators));
	}

	private getRouteHandlersForPath(routes: RouteDescriptor[]): RouteHandler[] {
		return List(routes)
			.groupBy(route => (route && route.method) || Method.Get)
			.map(routesByPath => (routesByPath && routesByPath.toArray()) || [])
			.toArray()
			.map(descriptor => this.getRouteHandlerForPathAndMethod(descriptor))
			.concat(this.getHandlerForExcludedMethods(routes));
	}

	private getRouteHandlerForPathAndMethod(routes: RouteDescriptor[]): RouteHandler {
		const method = routes.map(route => route.method)[0];
		const trueMethod = getMethodString(method);
		const truePath = routes.map(route => route.path)[0] || "";

		return {
			method: trueMethod,
			handler: (request, reply) => {
				const req: Request = {
					headers: request.headers,
					method: method || Method.Get,
					params: request.params,
					body: request.payload as null | string | any
				};

				const requestId = this.generateRequestId();
				this.logger.info(`${requestId}: Incoming request: method="${request.method}",path="${request.path}". ${routes.length} possible handler(s).`);

				Observable.from(routes)
					.mergeMap(route => Observable.from(route.filters || [])
						.mergeMap(routeFilterFunc => routeFilterFunc(req))
						.every(isAllowed => isAllowed)
						.map(isAllowed => ({ allowed: isAllowed, route: route }))
					)
					.filter(routeDetails => routeDetails.allowed)
					.map(routeDetails => routeDetails.route)
					.max((lhs, rhs) => (rhs.priority || 0) - (lhs.priority || 0))
					.mergeMap(route => {
						this.logger.info(`${requestId}: Request matched route. method="${getMethodString(route.method)}",path="${route.path}",priority=${route.priority || 0}`);
						return route.process(req);
					})
					.map(response => () => response)
					.catch((err: Error) => {
						this.logger.error(`${requestId}:Unexpected error occured, ${err}`, err);
						return Observable.of(() => InternalServerErrorResponse(err));
					})
					.defaultIfEmpty(() => {
						this.logger.info(`${requestId}:Request did not match any filters on route. method="${request.method}",path="${request.path}",length=${request.length}`);
						return BadRequestResponse();
					})
					.subscribe(response => this.applyResponse(requestId, response(), reply));
			},
			path: routes.map(route => route.path)[0]!
		};
	}

	private getHandlerForExcludedMethods(actualRoutes: RouteDescriptor[]): RouteHandler[] {
		return [Method.Get, Method.Delete, Method.Post, Method.Put]
			.filter(method => actualRoutes.every(route => route.method !== method))
			.map(method => getMethodString(method))
			.map(method => ({
				method: method,
				handler: (request: hapi.Request, reply: hapi.ReplyNoContinue): void => this.applyResponse(this.generateRequestId(), MethodNotSupported(method), reply),
				path: actualRoutes.map(route => route.path).find(() => true) || "/"
			}));
	}

	private applyResponse<T>(requestId: string, response: Response, reply: hapi.ReplyNoContinue): void {
		const headers = response.headers || {};
		const statusCode = response.statusCode || 200;
		const body = response.body || "";

		const replier = reply(body);
		Object.keys(headers)
			.filter(header => headers[header] != null)
			.forEach(header => replier.header(header, headers[header]!));
		replier.code(statusCode);

		this.logger.info(`${requestId}: Reply with status=${statusCode},body.length=${body.length}`);
	}

	private generateRequestId(): string {
		const lpad = (val: string) => val.length < 9 ? "0" + val : val;

		return lpad(Math.floor(Math.random() * 999999999).toString());
	}
}
