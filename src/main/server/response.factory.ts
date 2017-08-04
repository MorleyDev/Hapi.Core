import { Response } from "./route.model";

export function JsonResponse<T>(statusCode: number, body?: T): Response {
	return {
		statusCode: statusCode,
		body: body != null ? JSON.stringify(body) : undefined,
		headers: {
			"Content-Type": "application/json"
		}
	};
}

export function ErrorResponse(statusCode: number, status: string, message: string): Response {
	return JsonResponse(statusCode, { statusCode, status, message });
}

export function OkResponse<T>(body: T): Response {
	return JsonResponse(200, body);
}

export function CreatedResponse<T>(path: string, body?: T): Response {
	if (body == null) {
		return {
			statusCode: 201,
			body: undefined,
			headers: { "Location": path }
		};
	}

	const response = JsonResponse(201, body);
	return {
		body: response.body,
		headers: Object.assign({}, response.headers, { "Location": path }),
		statusCode: response.statusCode
	};
}

export function NoContentResponse(): Response {
	return {
		body: "",
		headers: { },
		statusCode: 204
	};
}

export function BadRequestResponse(message: string = "Request data was incorrectly formatted"): Response {
	return ErrorResponse(400, "BadRequest", message);
}

export function UnauthorizedResponse(message: string = "No or invalid authentication token provided"): Response {
	return ErrorResponse(401, "Unauthorized", message);
}

export function NotFoundResponse(message: string = "Resource was not found"): Response {
	return ErrorResponse(404, "ResourceNotFound", message);
}

export function MethodNotSupported(method: string): Response {
	return ErrorResponse(405, "MethodNotSupported", `Method ${method} was not supported on route`);
}

export function InternalServerErrorResponse(err?: Error | string): Response {
	return ErrorResponse(500, "InternalServerError", "An unexpected error has occured");
}
