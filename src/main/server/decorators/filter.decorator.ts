import "rxjs/add/observable/of";

import { Observable } from "rxjs/Observable";

import { RouteDescriptor, RouteFilter, RouteFilterAsync } from "../route.model";
import { WithDecorator } from "./core.decorator";

export function WithFilter(filter: RouteFilter): any {
	return WithFilterAsync(request => Observable.of(filter(request)));
}

export function WithFilterAsync(filter: RouteFilterAsync): any {
	const withFilter = (route: RouteDescriptor): RouteDescriptor => Object.assign({}, route, { filters: (route.filters || []).concat([filter]) });

	return WithDecorator(withFilter);
}
