import { Injector } from "injection-js";

import { Method, RouteDecorator, RouteDescriptor, RouteProcess } from "./route.model";

export function createRoute<T>(process: RouteProcess, ...decorators: RouteDecorator[]): RouteDescriptor {
	return { process, decorators };
}

export function applyDecorators(route: RouteDescriptor, container: Injector): RouteDescriptor {
	return (route.decorators || []).reduce((prev, curr) => curr(prev, container), route);
}

export function getMethodString(method?: Method): "DELETE" | "GET" | "POST" | "PUT" | "GET" {
	switch (method) {
		case Method.Delete:
			return "DELETE";
		case Method.Get:
			return "GET";
		case Method.Post:
			return "POST";
		case Method.Put:
			return "PUT";
		default:
			return "GET";
	}
}
