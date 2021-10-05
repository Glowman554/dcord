import { existsSync, FSWatcher, mkdirSync, readdirSync, watch } from "fs";
import App from "../app";
import { Plugin } from "./plugin";

export interface WatchEntry {
	name: string;
	watch: FSWatcher;
	plugin: Plugin;
}

export class PluginLoader {
	watches: WatchEntry[] = [];
	constructor(public app: App) {
		this.app = app;

		if (!existsSync(__dirname + "/plugins")) {
			mkdirSync(__dirname + "/plugins");
		}
	}

	load_all() {
		this.app.message.system("Loading plugins...");

		readdirSync(__dirname + "/plugins").forEach(name => {
			if (name.indexOf("noload") == -1) {
				this.load(name);
			}
		});
	}

	unload(name: string): void  {
		var path = require.resolve(name);
		//this.app.message.system("plugin", `Unloading plugin ${path}`);

		if (require.cache[path]) {
			this.app.message.system(`Deleting plugin from cache ${path}`);
			delete require.cache[path];
		}
	}

	load(name: string): Plugin|null {
		try {
			this.app.message.system(`Loading plugin ${name}`);

			try {
				this.unload(__dirname + "/plugins/" + name);
			} catch (e) {
				this.app.message.system(`Plugin ${name} not found! Not unloading!`);
			}

			const plugin = require(__dirname + "/plugins/" + name).default as Plugin;

			if (plugin?.load == undefined || plugin == undefined || plugin.noload == true) {
				this.app.message.system(`Plugin ${name} has no load function or doesn't want to be loaded!`);
			} else {
				plugin.load(this.app);
			}

			this.app.message.system(`Plugin ${plugin.name}@${plugin.version} loaded!`);

			if (this.watches.find(x => x.name == name) === undefined) {
				this.app.message.system(`Adding watch for ${name}`);
				var watch_ = watch(__dirname + "/plugins/" + name, () => {
					this.app.message.system(`Plugin ${name} changed, reloading...`);

					var watch_entry = this.watches.find(x => x.name == name);

					watch_entry?.plugin.reload(this.app);

					this.load(name);
				});

				this.watches.push({
					name: name,
					watch: watch_,
					plugin: plugin
				} as WatchEntry);
			} else {
				this.watches[this.watches.findIndex(x => x.name == name)].plugin = plugin;
			}

			return plugin;
		} catch (e: any) {
			this.app.message.system(`Plugin ${name} failed to load!`);
			this.app.message.system(e);
			return null;
		}
	}

}