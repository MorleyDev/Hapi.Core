import "rxjs/add/observable/defer";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";

import { Observable } from "rxjs/Observable";

import { Request, Response } from "../route.model";
import { OnProcessAsync } from "./process.decorator";

export function OnResponse(decorator: (request: Request, response: Response) => Response): any {
	return OnProcessAsync((request, next) => Observable.defer(() => next(request)).map(response => decorator(request, response)));
}

export function OnResponseAsync(decorator: (request: Request, response: Response) => Promise<Response> | Observable<Response>): any {
	return OnProcessAsync((request, next) => Observable.defer(() => next(request)).mergeMap(response => decorator(request, response)));
}
