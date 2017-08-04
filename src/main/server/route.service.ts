import { Injectable } from "injection-js";

import { RouteDescriptor, RouteHandler } from "./route.model";

@Injectable()
export abstract class RouteService {
	public abstract getControllerRoutes(controller: any): RouteDescriptor[];

	public abstract getRouteHandlers<T>(descriptors: RouteDescriptor[]): RouteHandler[];
}
