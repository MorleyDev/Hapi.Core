import { Injectable, Inject, Provider } from "injection-js";
import { LoggerOptions } from "winston";

import { HttpDelete, HttpGet, HttpPost, HttpPut } from "./server/decorators/method.decorator";
import { Route } from "./server/decorators/route.decorator";
import { Body } from "./server/decorators/body.decorator";
import { addControllers } from "./server/addControllers";
import { Request, Response } from "./server/route.model";
import { Controller } from "./server/controller";
import { IStartup } from "./IStartup";
import { Logger } from "./Logger";
import { Configuration } from "./Configuration";
import { Application } from "./Application";

export {
	IStartup,
	Logger,
	LoggerOptions,
	Configuration,
	Application,

	Route,
	Body,
	HttpGet,
	HttpPost,
	HttpDelete,
	HttpPut,

	Request,

	Controller,
	addControllers,

	Inject,
	Injectable,
	Provider
};

