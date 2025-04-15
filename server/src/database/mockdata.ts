import { addCategory, AddItem } from "../database/database_handler";

async function addMockCategory() {
	try {
		addCategory({
			name: "Laptops",
			module: "1",
			itemShape: {
				Model: "TEXT",
				Price: "FLOAT",
				Owner: "TEXT",
				"Manufacturing year": "INTEGER",
			},
		});
		addCategory({
			name: "Sensors",
			module: "1",
			itemShape: {
				Model: "TEXT",
				Price: "FLOAT",
				Location: "TEXT",
				Status: "TEXT",
				"Serial number": "INTEGER",
			},
		});
	} catch (error) {
		console.log("Mockdata failed: ", error);
	}
}

async function addMockdata() {
	AddItem("1", {
		Model: "Lenovo Thinkpad",
		Price: 1200.5,
		Owner: "Jarkko",
		"Manufacturing year": 2020,
	});
	AddItem("2", {
		Model: "Sensor1",
		Price: 22.45,
		Location: "London",
		Status: "Active",
		"Serial number": 10001,
	});
}
if (require.main === module) {
	addMockCategory();
	addMockdata();
}
