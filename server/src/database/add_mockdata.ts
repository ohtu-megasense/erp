import { addToInventoryItem } from "./database_handler";
import { randomInt } from "crypto";

const generateMockData = async (tableName: string, values: Array<string>) => {
	try {
		await addToInventoryItem(tableName, values);
		console.log("added mock data");
	} catch (error) {
		console.error("Error adding mockdata:", error);
	}
};

if (require.main == module) {
	//createInventoryItem("sensors", [
	//"name",
	//"location",
	//"status",
	//"last_updated",
	//]);
	for (let i = 0; i < 649; i++) {
		const cities = ["London", "Riyadh"];
		const activity = ["Inactive", "Active"];
		const values = ["Megasense AQ sensor", "", "", ""];
		values[0] += `${i}`;
		values[1] = cities[randomInt(0, 2)];
		values[2] = activity[randomInt(0, 2)];
		values[3] =
			"" +
			randomInt(2024, 2026) +
			"-0" +
			randomInt(1, 9) +
			"-" +
			randomInt(10, 30) +
			"T" +
			randomInt(10, 24) +
			":" +
			randomInt(10, 59) +
			":" +
			randomInt(10, 59) +
			"Z";
		generateMockData("sensors", values);
		if (i < 10) {
			values[0].slice(0, -1);
		}
	}
}
