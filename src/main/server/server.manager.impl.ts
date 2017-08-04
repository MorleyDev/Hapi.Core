import * as hapi from "hapi";
import { Inject } from "injection-js";

import { Configuration } from "../Configuration";
import { RouteDescriptor } from "./route.model";
import { RouteService } from "./route.service";
import { ServerManager } from "./server.manager";

export class ServerManagerImpl implements ServerManager {
	private routes: RouteDescriptor[] = [];

	constructor(
		@Inject(RouteService) private route: RouteService
	) {
	}

	public withController(controller: any): ServerManager {
		this.routes = this.routes.concat( this.route.getControllerRoutes(controller) );
		return this;
	}

	public async open(port: number): Promise<void> {
		const handlers = this.route.getRouteHandlers(this.routes)
			.concat([
				{ method: "GET", path: `/{param*}`, handler: (req, reply) => reply("").header("content-type", "application/json").code(404) },
				{ method: "POST", path: `/{param*}`, handler: (req, reply) => reply("").header("content-type", "application/json").code(404) },
				{ method: "PUT", path: `/{param*}`, handler: (req, reply) => reply("").header("content-type", "application/json").code(404) },
				{ method: "DELETE", path: `/{param*}`, handler: (req, reply) => reply("").header("content-type", "application/json").code(404) },
				{ method: "PATCH", path: `/{param*}`, handler: (req, reply) => reply("").header("content-type", "application/json").code(404) }
			]);

		const server = new hapi.Server();
		server.connection({ port });
		server.route(handlers);
		await server.start();
	}
}
