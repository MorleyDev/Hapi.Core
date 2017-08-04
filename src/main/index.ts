import { Injectable, Inject } from "injection-js";
import { Config as LoggerConfig } from "winston";

import { HttpDelete, HttpGet, HttpPost, HttpPut } from "./server/decorators/method.decorator";
import { Route } from "./server/decorators/route.decorator";
import { Body } from "./server/decorators/body.decorator";
import { addControllers } from "./server/addControllers";
import { IStartup } from "./IStartup";
import { Logger } from "./Logger";
import { Configuration } from "./Configuration";
import { Application } from "./Application";

export {
	IStartup,
	Logger,
	LoggerConfig,
	Configuration,
	Application,

	Route,
	HttpGet,
	HttpPost,
	HttpDelete,
	HttpPut,
	Body,

	addControllers,

	Inject,
	Injectable
};
