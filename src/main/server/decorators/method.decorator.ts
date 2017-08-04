import { Method, RouteDecorator, RouteDescriptor } from "../route.model";
import { WithDecorator } from "./core.decorator";

export function HttpMethod(method: Method): any {
	const withMethod = (method: Method): RouteDecorator => (route: RouteDescriptor) => Object.assign({}, route, { method: method });

	return WithDecorator(withMethod(method));
}

export const HttpGet = () => HttpMethod(Method.Get);
export const HttpPut = () => HttpMethod(Method.Put);
export const HttpDelete = () => HttpMethod(Method.Delete);
export const HttpPost = () => HttpMethod(Method.Post);
