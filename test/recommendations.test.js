import { expect } from 'chai';
import { getPersonalizedEventRecommendations, calculateDistance } from '../src/services/interestService.js';
import User from '../src/models/user.js';
import Interest from '../src/models/interest.js';
import Subcategory from '../src/models/subcategory.js';
import Event from '../src/models/event.js';
import Participant from '../src/models/participant.js';

describe('Recommendation Service', () => {
  it('should recommend events based on user interests', async () => {
    const userId = 1;

    const userInterests = await Interest.findAll({
      where: { user_id: userId },
      include: [{ model: Subcategory }],
    });
    const allowedSubcategories = userInterests.map((interest) => interest.subcategory_id);

    const recommendations = await getPersonalizedEventRecommendations(userId);

    expect(recommendations).to.be.an('array');
    recommendations.forEach((event) => {
      expect(allowedSubcategories).to.include(event.subcategory_id);
    });
  });

  it('should prioritize events near the user', async () => {
    const userId = 4;
    
    const recommendations = await getPersonalizedEventRecommendations(userId);

    const user = await User.findByPk(userId);
    const userLatitude = user.location_latitude;
    const userLongitude = user.location_longitude;

    recommendations.forEach((event) => {
      const distance = calculateDistance(userLatitude, userLongitude, event.latitude, event.longitude);
      expect(distance).to.be.lessThan(50); 
    });
  });

  it('should prioritize past events for recommendations', async () => {
    const userId = 1;
    
    const pastParticipationEvents = await Participant.findAll({
      where: { user_id: userId },
      include: [{ model: Event, include: [Subcategory] }],
    });
    const pastEventSubcategoryIds = pastParticipationEvents.map((participation) => participation.Event.subcategory_id);

    const recommendations = await getPersonalizedEventRecommendations(userId);

    recommendations.forEach((event) => {
      if (pastEventSubcategoryIds.includes(event.subcategory_id)) {
        expect(event).to.have.property('weight').that.is.greaterThan(1); 
      }
    });
  });
});