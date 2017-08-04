export abstract class Logger {
	public abstract silly(msg: string, ...meta: any[]): Logger;
	public abstract debug(msg: string, ...meta: any[]): Logger;
	public abstract verbose(msg: string, ...meta: any[]): Logger;
	public abstract info(msg: string, ...meta: any[]): Logger;
	public abstract warn(msg: string, ...meta: any[]): Logger;
	public abstract error(msg: string, ...meta: any[]): Logger;
}
