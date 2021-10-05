import fetch from "node-fetch";

function translate(pr: string) {
	switch (pr) {
		case "unspecified": return "Unspecified";
		case "hh": return "He/him";
		case "hi": return "He/it";
		case "hs": return "He/she";
		case "ht": return "He/they";
		case "ih": return "It/him";
		case "ii": return "It/its";
		case "ssh": return "She/he";
		case "sh": return "She/her";
		case "si": return "She/it";
		case "st": return "She/they";
		case "th": return "They/he";
		case "ti": return "They/it";
		case "ts": return "They/she";
		case "tt": return "They/them";
		case "any": return "Any pronouns";
		case "other": return "Other pronouns";
		case "ask": return "Ask me my pronouns";
		case "avoid": return "Avoid pronouns, use my name";
		default: return "Unknown: " + pr;
	}
}

export interface PronounDBRes {
	pronouns?: string;
	error?: number;
	message?: string;
}

export async function fetch_pronouns(id: string): Promise<string> {
	const response = await fetch('https://pronoundb.org/api/v1/lookup?platform=discord&id=' + id);
	const json = await response.json() as PronounDBRes;

	if (json.error) {
		return "none";
	} else {
		if (json.pronouns) {
			return translate(json.pronouns);
		} else {
			return "none";
		}
	}
}