import { Provider } from "injection-js";
import { LoggerOptions } from "winston";

import { Controller } from "./server/controller";

export interface IStartup {
	configureServices(providers: Provider[]): Provider[];
	configureControllers(controllers: (typeof Controller)[]): (typeof Controller)[];
	configureLogger(): LoggerOptions;
}
