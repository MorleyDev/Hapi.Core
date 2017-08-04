Basic Example

```typescript
import "core-js";

import { Provider } from "injection-js";
import { Application } from "morleydev-hapi-core/Application";
import { Configuration } from "morleydev-hapi-core/Configuration";
import { IStartup } from "morleydev-hapi-core/IStartup";
import { addControllers } from "morleydev-hapi-core/server/addControllers";
import { Controller } from "morleydev-hapi-core/server/controller";
import { HttpGet } from "morleydev-hapi-core/server/decorators/method.decorator";
import { Route } from "morleydev-hapi-core/server/decorators/route.decorator";
import { Request, Response } from "morleydev-hapi-core/server/route.model";
import { LoggerOptions, transports } from "winston";

export class HomeController extends Controller {
	@Route("/")
	@HttpGet()
	public async home(request: Request): Promise<Response> {
		return this.ok({ });
	}
}

class Startup implements IStartup {
	constructor(private config: Configuration) {
	}

	public configureServices(providers: Provider[]): Provider[] {
		return providers;
	}

	public configureControllers(controllers: (typeof Controller)[]): (typeof Controller)[] {
		return controllers.concat([ HomeController ]).concat( addControllers(__dirname + "/controllers") );
	}

	public configureLogger(): LoggerOptions {
		return {
			level: "info",
			transports: [
				new (transports.Console)()
			]
		};
	}
}

const app = new Application(Startup);
app.run()
	.then(() => { })
	.catch(err => console.error(err));
```