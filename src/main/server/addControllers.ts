import { Controller } from "./controller";
import { readdirSync, statSync } from "fs";
import { join } from "path";

export function addControllers(folder: string = "./controllers"): (typeof Controller)[] {
	return readdirSync(folder)
		.filter(fileEntry => fileEntry.endsWith(".js"))
		.map(fileEntry => join(folder, fileEntry))
		.filter(file => statSync(file).isFile())
		.map(file => require(file))
		.map(fd => Object.keys(fd).map(k => fd[k]))
		.reduce((lhs, rhs) => lhs.concat(rhs), []);
}
