import { Provider } from "injection-js";

import { RouteService } from "./route.service";
import { RouteServiceImpl } from "./route.service.impl";
import { ServerManager } from "./server.manager";
import { ServerManagerImpl } from "./server.manager.impl";


export function addServerManager(): Provider[] {
	return [
		{ provide: RouteService, useClass: RouteServiceImpl },
		{ provide: ServerManager, useClass: ServerManagerImpl }
	];
}
