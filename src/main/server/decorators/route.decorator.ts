import { RouteDecorator, RouteDescriptor } from "../route.model";
import { WithDecorator } from "./core.decorator";

export function Route(path: string): any {
	const withPath = (path: string): RouteDecorator => (route: RouteDescriptor) => Object.assign({}, route, {
		path: ((route.path || "") + path).replace(/\/\//g, "/")
	});

	return WithDecorator(withPath(path));
}
