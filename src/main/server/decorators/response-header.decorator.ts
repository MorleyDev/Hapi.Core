import { Request, Response } from "../route.model";
import { OnResponse } from "./response.decorator";

export const AddResponseHeader = (key: string, value: string): any => OnResponse((request: Request, response: Response) => ({
	body: response.body,
	statusCode: response.statusCode,
	headers: Object.assign({}, response.headers || {}, { [key]: value })
}));
