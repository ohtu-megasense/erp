import * as xlsx from 'xlsx';
import path from 'path';
import { addCategory, AddItem } from './database_handler';

// Define TypeScript interface for the Excel row structure

if (require.main === module) {
  (async () => {
    try {
      const filePath = path.join(
        __dirname,
        '../../data/Ride_Sharing_Mockdata.xlsx'
      );
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const data: Record<string, string | number>[] =
        xlsx.utils.sheet_to_json(sheet);

      if (data.length === 0) {
        console.log('No data found in Excel file.');
        return;
      }

      const moduleName = 'ride_sharing';
      const categoryName = 'Ride Sharing Data';

      // Define itemShape explicitly based on provided headers
      const itemShape = {
        'Ride ID': 'INTEGER',
        'Request Time': 'TEXT',
        'Pickup Location': 'TEXT',
        'Latitude Pickup': 'FLOAT',
        'Longitude Pickup': 'FLOAT',
        'Dropoff Location': 'TEXT',
        'Latitude Dropoff': 'FLOAT',
        'Longtitude Dropoff': 'FLOAT',
        'Ride Distance (in miles)': 'FLOAT',
        'Fare Amount (in $)': 'FLOAT',
        'Payment Method': 'TEXT',
        'Driver ID': 'TEXT',
        'Vehicle Type': 'TEXT',
        'Traffic Condition': 'TEXT',
        'Peak Hours': 'TEXT',
        'Day of Week': 'TEXT',
        'Public Holiday': 'TEXT',
        'User Rating': 'INTEGER'
      };

      const category = await addCategory({
        name: categoryName,
        module: moduleName,
        itemShape: itemShape
      });

      for (const row of data) {
        await AddItem(String(category.id), row);
      }

      console.log('Excel data import completed.');
    } catch (error) {
      console.error('Error importing Excel data:', error);
    }
  })();
}
