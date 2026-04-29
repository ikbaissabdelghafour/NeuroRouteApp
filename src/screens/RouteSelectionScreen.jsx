// Route Selection Screen
// Shows route options with scores and metrics

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE } from '../constants/theme';
import { getRoutes } from '../services/routeService';
import { getProfile } from '../services/storageService';
import { ROUTES } from '../navigation/routes';
import { MOCK_ROUTES } from '../data/mockRoutes';
import RouteCard from '../components/RouteCard';
import Card from '../components/Card';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RouteSelectionScreen = ({ navigation, route }) => {
  const { origin, destination, preferredType } = route.params || {};
  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setIsLoading(true);
    try {
      // Get user profile for personalized scoring
      const profile = await getProfile();
      setUserProfile(profile);

      // Get routes with personalized scores
      const routeOptions = await getRoutes(
        origin,
        { latitude: 40.7128, longitude: -74.006 },
        destination,
        { latitude: 40.7175, longitude: -74.0115 },
        profile
      );

      // Filter by preferred type if specified
      let filteredRoutes = routeOptions;
      if (preferredType) {
        filteredRoutes = routeOptions.filter(r => r.type === preferredType);
        // If no routes match, show all
        if (filteredRoutes.length === 0) {
          filteredRoutes = routeOptions;
        }
      }

      setRoutes(filteredRoutes.slice(0, 4)); // Show top 4 routes
    } catch (error) {
      console.error('Error loading routes:', error);
      // Use mock data as fallback
      setRoutes(MOCK_ROUTES.slice(0, 4));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
  };

  const handleContinue = () => {
    if (selectedRoute) {
      navigation.navigate(ROUTES.MAP, {
        route: selectedRoute,
        origin,
        destination,
      });
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'walking':
        return 'walk';
      case 'bicycle':
        return 'bicycle';
      case 'car':
        return 'car';
      case 'public_transport':
        return 'bus';
      default:
        return 'walk';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Finding the best routes for you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Route Info Header */}
      <Card style={styles.headerCard} shadow="small">
        <View style={styles.routeInfo}>
          <View style={styles.locationItem}>
            <Icon name="map-marker" size={20} color={COLORS.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {origin || 'Current Location'}
            </Text>
          </View>
          <Icon name="arrow-down" size={20} color={COLORS.textLight} style={styles.arrow} />
          <View style={styles.locationItem}>
            <Icon name="map-marker" size={20} color={COLORS.error} />
            <Text style={styles.locationText} numberOfLines={1}>
              {destination || 'Destination'}
            </Text>
          </View>
        </View>
      </Card>

      {/* Routes List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Choose Your Route</Text>
        <Text style={styles.sectionSubtitle}>
          Based on your profile preferences
        </Text>

        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            onSelect={handleSelectRoute}
            isSelected={selectedRoute?.id === route.id}
          />
        ))}

        {/* Empty space at bottom for button */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Continue Button */}
      {selectedRoute && (
        <View style={styles.buttonContainer}>
          <Button
            title="View on Map"
            onPress={handleContinue}
            variant="primary"
            size="large"
            icon="map"
          />
        </View>
      )}
    </View>
  );
};

RouteSelectionScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      origin: PropTypes.string,
      destination: PropTypes.string,
      preferredType: PropTypes.string,
    }),
  }),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
  },
  headerCard: {
    margin: SPACING.lg,
    marginBottom: 0,
  },
  routeInfo: {
    padding: SPACING.sm,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  locationText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  arrow: {
    alignSelf: 'center',
    marginVertical: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  bottomSpace: {
    height: 100,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
});

export default RouteSelectionScreen;
