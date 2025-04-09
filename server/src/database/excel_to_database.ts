import * as xlsx from "xlsx";
import path from "path";
import { addCategory, AddItem } from "./database_handler";

// Define TypeScript interface for the Excel row structure
interface RideDataRow {
  "Ride ID": number;
  "Request Time": string;
  "Pickup Location": string;
  "Latitude Pickup": number;
  "Longitude Pickup": number;
  "Dropoff Location": string;
  "Latitude Dropoff": number;
  "Longtitude Dropoff": number;
  "Ride Distance (in miles)": number;
  "Fare Amount (in $)": number;
  "Payment Method": string;
  "Driver ID": string;
  "Vehicle Type": string;
  "Traffic Condition": string;
  "Peak Hours": string;
  "Day of Week": string;
  "Public Holiday": string;
  "User Rating": number;
}

if (require.main === module) {
  (async () => {
    try {
      const filePath = path.join(__dirname, "../../data/Ride_Sharing_Mockdata.xlsx");
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const data: RideDataRow[] = xlsx.utils.sheet_to_json<RideDataRow>(sheet);

      if (data.length === 0) {
        console.log("No data found in Excel file.");
        return;
      }

      const moduleName = 'ride_sharing';
      const categoryName = "Ride Sharing Data";

      // Define itemShape explicitly based on provided headers
      const itemShape = {
        "Ride ID": "number",
        "Request Time": "string",
        "Pickup Location": "string",
        "Latitude Pickup": "number",
        "Longitude Pickup": "number",
        "Dropoff Location": "string",
        "Latitude Dropoff": "number",
        "Longtitude Dropoff": "number",
        "Ride Distance (in miles)": "number",
        "Fare Amount (in $)": "number",
        "Payment Method": "string",
        "Driver ID": "string",
        "Vehicle Type": "string",
        "Traffic Condition": "string",
        "Peak Hours": "string",
        "Day of Week": "string",
        "Public Holiday": "string",
        "User Rating": "number"
      };

      const category = await addCategory({
        name: categoryName,
        module: moduleName,
        itemShape
      });

      for (const row of data) {
        await AddItem(category.id.toString(), row as unknown as JSON);
      }      

      console.log("Excel data import completed.");
    } catch (error) {
      console.error("Error importing Excel data:", error);
    }
  })();
}
