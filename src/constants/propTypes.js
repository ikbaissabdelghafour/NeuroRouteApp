// PropTypes definitions for NeuroRoute App
import PropTypes from 'prop-types';

// Route PropTypes
export const RoutePropTypes = {
  route: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['shortest', 'calm', 'accessible', 'balanced']).isRequired,
    mode: PropTypes.oneOf(['walking', 'bicycle', 'car', 'public_transport']).isRequired,
    duration: PropTypes.number.isRequired,
    distance: PropTypes.number.isRequired,
    comfortScore: PropTypes.number.isRequired,
    noiseLevel: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    crowdLevel: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    accessibilityScore: PropTypes.number.isRequired,
    safetyScore: PropTypes.number.isRequired,
    warnings: PropTypes.arrayOf(PropTypes.string).isRequired,
    coordinates: PropTypes.arrayOf(
      PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      })
    ).isRequired,
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        instruction: PropTypes.string.isRequired,
        distance: PropTypes.number.isRequired,
        duration: PropTypes.number.isRequired,
        coordinates: PropTypes.shape({
          latitude: PropTypes.number.isRequired,
          longitude: PropTypes.number.isRequired,
        }).isRequired,
        notes: PropTypes.string,
      })
    ),
  }),
};

// User Profile PropTypes
export const UserProfilePropTypes = {
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    gender: PropTypes.string,
    disabilityType: PropTypes.arrayOf(
      PropTypes.oneOf([
        'visual_impairment',
        'hearing_impairment',
        'mobility_impairment',
        'autism_spectrum',
        'sensory_sensitivity',
        'cognitive_difficulty',
        'other',
      ])
    ).isRequired,
    sensitivityLevel: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    preferredMode: PropTypes.oneOf(['walking', 'bicycle', 'car', 'public_transport']).isRequired,
    avoidPreferences: PropTypes.arrayOf(
      PropTypes.oneOf([
        'noisy_areas',
        'crowded_areas',
        'poor_lighting',
        'stairs',
        'unsafe_crossings',
        'narrow_sidewalks',
      ])
    ).isRequired,
  }),
};

// Location PropTypes
export const LocationPropTypes = {
  location: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    name: PropTypes.string,
    address: PropTypes.string,
  }),
};

// Navigation PropTypes
export const NavigationPropTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.object,
  }),
};

// Button PropTypes
export const ButtonPropTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.string,
};

// Score Badge PropTypes
export const ScoreBadgePropTypes = {
  score: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

// Route Card PropTypes
export const RouteCardPropTypes = {
  route: RoutePropTypes.route.isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

// Input PropTypes
export const InputPropTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
};
