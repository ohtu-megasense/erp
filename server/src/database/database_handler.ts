import { Pool } from "pg";
import format from "pg-format";
import { database_URL } from "../config";

const pool = new Pool({
	connectionString: database_URL,
});

const createSQLquery = async (
	values: Array<string>,
	sql_query: string,
	sql_placeholder: string,
) => {
	const placeholders = values.map(() => sql_placeholder).join("");
	sql_query += placeholders;
	sql_query = sql_query.slice(0, -2);
	sql_query = sql_query + ");";
	console.log("sqlquery:", sql_query, "placeholders:", placeholders);
	return sql_query;
};

export const createInventoryItem = async (
	tableName: string,
	columns: Array<string>,
) => {
	const client = await pool.connect();
	try {
		console.log("Connected to the database");

		let sql_text: string = "CREATE TABLE %I (id SERIAL PRIMARY KEY, ";
		for (let i = 0; i < columns.length; i++) {
			sql_text = sql_text + "%I TEXT, ";
		}
		sql_text = sql_text.slice(0, -2); // this removes the extra , and space
		sql_text = sql_text + ");";

		console.log(sql_text);
		console.log(tableName);
		console.log(columns);

		const query = format(sql_text, tableName, ...columns);

		await client.query(query);
		console.log(
			`Table "${tableName}" with columns ${columns} created successfully!`,
		);
	} catch (error) {
		console.error("Error creating table:", error);
	} finally {
		client.release();
		console.log("Disconnected from the database");
	}
};
export const addToInventoryItem = async (
	tableName: string,
	values: Array<string>,
) => {
	const client = await pool.connect();
	try {
		console.log("Connected to the database");

		let sql_text: string = 'INSERT INTO "%I" VALUES (DEFAULT, ';
		for (let i = 0; i < values.length; i++) {
			sql_text = sql_text + "'%s', ";
		}
		sql_text = sql_text.slice(0, -2); // this removes the extra , and space
		sql_text = sql_text + ");";

		console.log(sql_text);
		console.log(tableName);
		console.log(values);

		const query = format(sql_text, tableName, ...values);

		await client.query(query);
		console.log(`Table "${tableName}" added values ${values}!`);
	} catch (error) {
		console.error("Error adding values:", error);
	} finally {
		client.release();
		console.log("Disconnected from the database");
	}
};

export async function retrieveInventoryTable(tableName: string) {
	const client = await pool.connect();
	try {
		console.log("Connected to the database");

		const sql_text: string = 'SELECT * FROM "%I"';
		console.log(sql_text);
		console.log(tableName);

		const query = format(sql_text, tableName);
		console.log(query);
		const result = await client.query(query);
		console.log(`Retrieved everything from "${tableName}"!`);

		const results = result.rows;
		return results;
	} catch (error) {
		console.error("Error retrieving from table:", error);
	} finally {
		client.release();
		console.log("Disconnected from the database");
	}
}

export async function temporarySensorKoosteFunction() {
	const client = await pool.connect();
	try {
		console.log("Connected to the database");

		const sql_text: string =
			"SELECT COUNT(status) FROM sensors WHERE status='Active'";
		const query = format(sql_text);
		const result_active = await client.query(query);
		console.log(`Retrieved count from "sensors"!`);
		const results_active = result_active.rows;

		const sql_text_all: string = "SELECT COUNT(status) FROM sensors";
		const query_2 = format(sql_text_all);
		const result_all = await client.query(query_2);
		console.log(`Retrieved count from "sensors"!`);
		const results_all = result_all.rows;

		let asql_text_all_fields: string = "SELECT * FROM sensors";
		const query_3 = format(asql_text_all_fields);
		const result_all_fields = await client.query(query_3);
		console.log("Retrieved everything");
		const results_all_fields = result_all_fields.rows;
		//console.log("here is all data:", results_all_fields);
		return {
			total_sensors: results_all[0]["count"],
			active_sensors: results_active[0]["count"],
			inactive_sensors: results_all[0]["count"] - results_active[0]["count"],
			everything: results_all_fields,
		};
	} catch (error) {
		console.error("Error retrieving from table:", error);
	} finally {
		client.release();
		console.log("Disconnected from the database");
	}
}

export async function AddingCategoryFunction(category_name: string) {
	try {
		//creating new table named category_name with only id column by passing
		// an empty array for additional columns to createInventoryItem_function
		await createInventoryItem(category_name, []);
		return { message: `Category table '${category_name}' created` }; // returning message to client/frontend
	} catch (error) {
		console.error("Error creating category table:", error);
		throw error; //throwing error so errors can be caught in categoryRouter.ts
	}
}

if (require.main == module) {
	temporarySensorKoosteFunction();

	createInventoryItem("sensors", [
		"name",
		"location",
		"status",
		"last_updated",
	]);

	createInventoryItem("app_metrics", [
		"app_name",
		"platform",
		"downloads",
		"app_rating",
		"active_subscriptions",
		"revenue",
		"last_updated",
	]);
	addToInventoryItem("app_metrics", [
		"GO2-app",
		"iOS",
		"892",
		"3.9",
		"108",
		"1080",
	]);
	retrieveInventoryTable("app_metrics");
	//addToInventoryItem("lusers", ["santeri", "kuusela"]);
}

//export default addToInventoryItem;
//export createInventoryItem;
