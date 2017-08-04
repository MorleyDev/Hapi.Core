import * as config from "config";
import { Injectable } from "injection-js";

@Injectable()
export abstract class Configuration implements config.IConfig {
	public abstract get<T>(setting: string): T;
	public abstract has(setting: string): boolean;

	public util: config.IUtil;
}
