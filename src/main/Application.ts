import * as config from "config";
import { ReflectiveInjector } from "injection-js";
import * as winston from "winston";

import { Configuration } from "./Configuration";
import { IStartup } from "./IStartup";
import { Logger } from "./Logger";
import { Controller } from "./server/controller";
import { addServerManager } from "./server/provide";
import { ServerManager } from "./server/server.manager";

export class Application {
	constructor(
		private startup: new (config: Configuration) => IStartup
	) {
	}

	public async run(): Promise<void> {
		const [injector, controllers, logger, config] = this.initServices();

		const server = (injector.get(ServerManager) as ServerManager);
		controllers
			.map(ctrl => (injector.get(ctrl) as Controller))
			.filter(ctrl => ctrl != null)
			.reduce((server, ctrl) => server.withController(ctrl), server);

		const port = config.has("server.port") ? config.get<number>("server.port") : 5000;
		await server.open(port);

		logger.info(`Running server on ${port}.`);
		logger.info(`Press CTRL+C to exit...`);
	}

	private initServices(): [ReflectiveInjector, typeof Controller[], Logger, Configuration] {
		const startup = new this.startup(config);

		const logLevel = config.has("logging.loglevel") ? config.get<string>("logging.logLevel") : "info";
		const loggerOptions = Object.assign({}, { level: logLevel, transports: [ new (winston.transports.Console)() ] }, startup.configureLogger());
		winston.configure(loggerOptions);

		const controllers = startup.configureControllers([]);

		const providers = startup.configureServices([])
			.concat([{ provide: Configuration, useValue: config }])
			.concat([{ provide: Logger, useValue: winston }])
			.concat(controllers)
			.concat( addServerManager() );

		return [ReflectiveInjector.resolveAndCreate(providers), controllers, winston, config];
	}
}
