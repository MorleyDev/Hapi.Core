import { RouteDecorator } from "../route.model";

export function WithDecorator(decorator: RouteDecorator): any {
	return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
		if (propertyKey != null) {
			Reflect.defineMetadata(`hapi:route:${propertyKey}`, true, target);
		}

		const fullKey = propertyKey != null ? `hapi:route:${propertyKey}:decorators` : `hapi:route:decorators`;
		const fullTarget = propertyKey != null ? target : target.prototype;
		const decorators: RouteDecorator[] | null = Reflect.getMetadata(fullKey, fullTarget);
		Reflect.defineMetadata(fullKey, (decorators || []).concat([decorator]), fullTarget);
		return target;
	};
}
