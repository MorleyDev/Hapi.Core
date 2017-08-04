import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/do";

import { transformAndValidate } from "class-transformer-validator";
import { ClassType } from "class-transformer/ClassTransformer";
import { Observable } from "rxjs/Observable";

import { BadRequestResponse } from "../response.factory";
import { OnProcessAsync } from "./process.decorator";

export function Body<T extends object>(type: ClassType<T>): any {
	return OnProcessAsync((request, next) => {
		return Observable.fromPromise(transformAndValidate(type, request.body))
			.map(body => Object.assign({}, request, { body }))
			.mergeMap(body => next(body))
			.catch(err => Observable.of(BadRequestResponse(err)))
	});
} 
