import { Client, Pool } from "pg";
import { database_URL } from "../config";
import fs from "fs";
import path from "path";
import logger from "../utils/logger";

const getCaPath = (): string | undefined => {
	const env = process.env.NODE_ENV;

	if (env === "production") {
		return process.env.CA_PATH || path.join(__dirname, "../../ca.pem");
	}

	return undefined;
};

const getDatabaseClient = (): Client => {
	if (process.env.NODE_ENV === "production") {
		const caPath = getCaPath();
		logger.info(
			`Database certificate authority file for pg.Client is using path: ${caPath}.`,
		);

		if (!caPath) {
			throw new Error(
				"Certificate authority path for pg.Client is undefined. Is the process node env in production mode?",
			);
		}

		return new Client({
			connectionString: database_URL,
			ssl: {
				rejectUnauthorized: true,
				ca: fs.readFileSync(caPath).toString(),
			},
		});
	}

	return new Client({
		connectionString: database_URL,
	});
};

const getDatabasePool = (): Pool => {
	if (process.env.NODE_ENV === "production") {
		const caPath = getCaPath();
		logger.info(
			`Database certificate authority file for pg.Pool is using path: ${caPath}.`,
		);

		if (!caPath) {
			throw new Error(
				"Certificate authority path for pg.Pool is undefined. Is the process node env in production mode?",
			);
		}

		return new Pool({
			connectionString: database_URL,
			ssl: {
				rejectUnauthorized: true,
				ca: fs.readFileSync(caPath).toString(),
			},
		});
	}

	return new Pool({
		connectionString: database_URL,
	});
};

// Client is used for checking if
// database connection can be established
// successfully and for load schema script.
const client = getDatabaseClient();

export const pool = getDatabasePool();

export const testDatabaseConnection = async (): Promise<{
	isConnectionSuccessful: boolean;
}> => {
	try {
		await client.connect();

		logger.info("Data base connection successful.");

		await client.end();

		return {
			isConnectionSuccessful: true,
		};
	} catch (error) {
		let logMessage = "";

		if (error instanceof Error) {
			logMessage += error.message;
		}

		await client.end();
		logger.error(`Database connection failed. Error message: ${logMessage}`);

		return {
			isConnectionSuccessful: false,
		};
	}
};

export const resetDatabase = async () => {
	const query = {
		text: `
      DELETE FROM items;
      DELETE FROM categories;
    `,
	};

	await pool.query(query);
};

const loadSchema = async () => {
	try {
		await client.connect();
		console.log("Connected to the database");

		const schemaPath = path.join(__dirname, "schema.sql");
		const SQLschema = fs.readFileSync(schemaPath, "utf-8");

		await client.query(SQLschema);
		console.log("Schema loaded successfully");

		await client.query(
			"INSERT INTO modules(module_name) VALUES ('crm'),('inventory');",
		);
	} finally {
		await client.end();
		console.log("Disconnected from the database");
	}
};

if (require.main == module) {
	loadSchema();
}
