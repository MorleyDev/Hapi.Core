import { Injectable } from "injection-js";

@Injectable()
export abstract class ServerManager {
	public abstract withController(controller: any): ServerManager;
	public abstract open(port: number): Promise<void>;
}
