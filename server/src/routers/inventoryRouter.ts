import { Router } from 'express';
import { temporarySensorKoosteFunction } from "../database/database_handler";



const router = Router();

router.get('/', (req, res) => {
    temporarySensorKoosteFunction()
    .then(data => res.json(data))
    .catch(error => console.error("Error retrieving data:", error))

    /**
    retrieveInventoryTable("app_metrics")
    .then(data => res.json(data))
    .catch(error => console.error('Error retrieving data:', error));
    */
});

/**
router.get('/api/reports/inventory', (req, res) => {
  res.json({
    total_sensors: 150,
    active_sensors: 130,
    inactive_sensors: 20,
    total_cloud_resources: 50,
    monthly_api_usage: 25000
  });
});
*/

export default router;
