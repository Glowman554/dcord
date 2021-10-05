import App from "../app";

export interface Plugin {
	name: string;
	version: string;

	load(app: App): void;
	reload(app: App): void;

	noload?: boolean;
}