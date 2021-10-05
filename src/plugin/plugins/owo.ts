import Uwuifier from "uwuifier";
import { Plugin } from "../plugin";

export default {
	name: "test",
	version: "1.0.0",

	load(app) {
		app.commands.set("owoify", (args: string[]) => {
			var uwuifier = new Uwuifier();
			var text = args.join(" ");
			var result = uwuifier.uwuifySentence(text);

			app.state.get().channel.send(result);
		});
	},

	reload(app) {

	}
} as Plugin;