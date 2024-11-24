import { expect } from 'chai';
import { getPersonalizedEventRecommendations, getUserInterestsService, calculateDistance } from '../src/services/interestService.js';
import User from '../src/models/user.js';

describe('Recommendation Service', () => {
    it('should recommend events based on user interests', async () => {
      const userId = 1;
      
      const userInterests = await getUserInterestsService(userId); 
      const allowedSubcategories = userInterests.map(interest => interest.subcategory_id);
  
      const recommendations = await getPersonalizedEventRecommendations(userId);
  
      expect(recommendations).to.be.an('array');
      recommendations.forEach(event => {
        expect(allowedSubcategories).to.include(event.subcategory_id);
      });
    });
  
    it('should prioritize events near the user', async () => {
      const userId = 4;
      const recommendations = await getPersonalizedEventRecommendations(userId);
  
      const user = await User.findByPk(userId);
      const userLatitude = user.location_latitude;
      const userLongitude = user.location_longitude;
      recommendations.forEach(event => {
        const distance = calculateDistance(userLatitude, userLongitude, event.latitude, event.longitude);
        expect(distance).to.be.lessThan(50); 
      });
    });
  });
