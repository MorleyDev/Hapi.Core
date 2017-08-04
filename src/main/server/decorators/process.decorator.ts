import "rxjs/add/observable/defer";

import { Injector } from "injection-js";
import { Observable } from "rxjs/Observable";

import { Request, Response, RouteDescriptor } from "../route.model";
import { WithDecorator } from "./core.decorator";

export type OnProcessDecorator =  (
	request: Request,
	next: (request: Request) => Promise<Response> | Observable<Response>,
	container: Injector
) => Promise<Response> | Observable<Response>;

export function OnProcessAsync(decorator: OnProcessDecorator): any {
	const onProcessAsync = (route: RouteDescriptor, container: Injector): RouteDescriptor => Object.assign({}, route, {
		process: (request: Request): Observable<Response> => Observable.defer(() => decorator(request, req => route.process(req), container)),
	});
	return WithDecorator(onProcessAsync);
}
