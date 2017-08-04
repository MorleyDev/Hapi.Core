import "rxjs/add/observable/defer";
import "rxjs/add/operator/mergeMap";

import { Observable } from "rxjs/Observable";

import { Request } from "../route.model";
import { OnProcessAsync } from "./process.decorator";

export function OnRequest(decorator: (request: Request) => Request): any {
	return OnProcessAsync((request, next) => next(decorator(request)));
}

export function OnRequestAsync(decorator: (request: Request) => Promise<Request> | Observable<Request>): any {
	return OnProcessAsync((request, next) => Observable.defer(() => decorator(request)).mergeMap(request => next(request)));
}
