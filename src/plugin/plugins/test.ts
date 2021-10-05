import { Plugin } from "../plugin";

export default {
	name: "test",
	version: "1.0.0",

	load(app) {
		app.message.system("test plugin loaded");
	},

	reload(app) {

	}
} as Plugin;