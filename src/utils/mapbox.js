import mbxDirections from '@mapbox/mapbox-sdk/services/directions.js';
import dotenv from 'dotenv';

dotenv.config();

const directionsService = mbxDirections({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

export const getRoutesFromMapbox = async (start, end) => {
  try {
    const profiles = ['driving', 'cycling', 'walking'];

    const routesPromises = profiles.map(profile => 
      directionsService.getDirections({
        profile,
        waypoints: [
          { coordinates: start },
          { coordinates: end }
        ],
        alternatives: true, 
        geometries: 'geojson',
      }).send()
    );

    const responses = await Promise.all(routesPromises);

    const allRoutes = responses.flatMap(response => response.body.routes);

    return allRoutes;
  } catch (error) {
    console.error('Error fetching routes:', error.message);
    throw new Error('Failed to fetch routes from Mapbox');
  }
};
