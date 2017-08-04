import { BadRequestResponse, CreatedResponse, InternalServerErrorResponse, JsonResponse, NoContentResponse, NotFoundResponse, OkResponse, UnauthorizedResponse } from "./response.factory";
import { Response } from "./route.model";

export class Controller {
	public statusCode(statusCode: number, body?: any): Response {
		return JsonResponse(statusCode);
	}

	public ok(body: any): Response {
		return OkResponse(body);
	};

	public created(path: string, body?: any): Response {
		return CreatedResponse(path, body);
	}

	public noContent(): Response {
		return NoContentResponse();
	}

	public badRequest(message: string = "Request data was incorrectly formatted"): Response {
		return BadRequestResponse(message);
	}

	public notFound(message: string = "Resource was not found"): Response {
		return NotFoundResponse(message);
	}

	public unauthorized(): Response {
		return UnauthorizedResponse();
	}

	public internalServerError(err: Error): Response {
		return InternalServerErrorResponse(err);
	}
}
