// Map Screen
// Displays selected route on map with warnings and info

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, SHADOWS, BORDER_RADIUS } from '../constants/theme';
import { ROUTES } from '../navigation/routes';
import { getRouteWarnings } from '../services/routeService';
import Button from '../components/Button';
import Card from '../components/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen = ({ navigation, route }) => {
  const { route: selectedRoute, origin, destination } = route.params || {};
  const [warnings, setWarnings] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    if (selectedRoute) {
      loadWarnings();
      setupMapRegion();
    }
  }, [selectedRoute]);

  const loadWarnings = async () => {
    try {
      const routeWarnings = await getRouteWarnings(selectedRoute.id);
      setWarnings(routeWarnings);
    } catch (error) {
      console.error('Error loading warnings:', error);
      setWarnings([]);
    }
  };

  const setupMapRegion = () => {
    if (selectedRoute?.coordinates?.length > 0) {
      const coords = selectedRoute.coordinates;
      const firstCoord = coords[0];
      const lastCoord = coords[coords.length - 1];
      
      // Calculate center
      const midLat = (firstCoord.latitude + lastCoord.latitude) / 2;
      const midLng = (firstCoord.longitude + lastCoord.longitude) / 2;
      
      setMapRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: LATITUDE_DELTA * 2,
        longitudeDelta: LONGITUDE_DELTA * 2,
      });
    }
  };

  const getWarningIcon = (type) => {
    switch (type) {
      case 'high_noise':
        return 'volume-high';
      case 'crowded_zone':
        return 'account-group';
      case 'poor_lighting':
        return 'lightbulb-off';
      case 'stairs':
        return 'stairs';
      case 'dangerous_crossing':
        return 'traffic-light';
      case 'narrow_sidewalk':
        return 'arrow-collapse-horizontal';
      default:
        return 'alert';
    }
  };

  const getWarningColor = (severity) => {
    switch (severity) {
      case 'high':
        return COLORS.error;
      case 'medium':
        return COLORS.warning;
      case 'low':
        return COLORS.info;
      default:
        return COLORS.warning;
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const handleStartNavigation = () => {
    navigation.navigate(ROUTES.NAVIGATION_DETAILS, {
      route: selectedRoute,
    });
  };

  if (!selectedRoute || !mapRegion) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
      >
        {/* Start Marker */}
        <Marker
          coordinate={selectedRoute.coordinates[0]}
          title="Start"
          pinColor={COLORS.markerStart}
        >
          <Icon name="map-marker" size={40} color={COLORS.markerStart} />
        </Marker>

        {/* End Marker */}
        <Marker
          coordinate={selectedRoute.coordinates[selectedRoute.coordinates.length - 1]}
          title="Destination"
          pinColor={COLORS.markerEnd}
        >
          <Icon name="map-marker" size={40} color={COLORS.markerEnd} />
        </Marker>

        {/* Warning Markers */}
        {warnings.map((warning, index) => {
          // Place warning markers along the route
          const coordIndex = Math.floor((selectedRoute.coordinates.length / (warnings.length + 1)) * (index + 1));
          const coord = selectedRoute.coordinates[coordIndex] || selectedRoute.coordinates[0];
          
          return (
            <Marker
              key={index}
              coordinate={coord}
              title={warning.message}
            >
              <View style={[styles.warningMarker, { backgroundColor: getWarningColor(warning.severity) }]}>
                <Icon name={getWarningIcon(warning.type)} size={16} color={COLORS.textInverse} />
              </View>
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{warning.message}</Text>
                  <Text style={styles.calloutSubtitle}>Severity: {warning.severity}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}

        {/* Route Line */}
        <Polyline
          coordinates={selectedRoute.coordinates}
          strokeColor={COLORS.routeLine}
          strokeWidth={4}
        />
      </MapView>

      {/* Bottom Info Card */}
      <View style={styles.bottomCard}>
        <Card shadow="large" style={styles.infoCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Route Header */}
            <View style={styles.routeHeader}>
              <View>
                <Text style={styles.routeType}>
                  {selectedRoute.type.charAt(0).toUpperCase() + selectedRoute.type.slice(1)} Route
                </Text>
                <Text style={styles.routeMode}>
                  by {selectedRoute.mode.replace('_', ' ')}
                </Text>
              </View>
              <View style={styles.comfortBadge}>
                <Text style={styles.comfortScore}>{selectedRoute.comfortScore}</Text>
                <Text style={styles.comfortLabel}>Comfort</Text>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="clock-outline" size={20} color={COLORS.primary} />
                <Text style={styles.statValue}>{formatDuration(selectedRoute.duration)}</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="map-marker-distance" size={20} color={COLORS.primary} />
                <Text style={styles.statValue}>{formatDistance(selectedRoute.distance)}</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="shield-check" size={20} color={COLORS.primary} />
                <Text style={styles.statValue}>{selectedRoute.safetyScore}</Text>
                <Text style={styles.statLabel}>Safety</Text>
              </View>
            </View>

            {/* Warnings */}
            {warnings.length > 0 && (
              <View style={styles.warningsSection}>
                <Text style={styles.warningsTitle}>Warnings:</Text>
                {warnings.slice(0, 2).map((warning, index) => (
                  <View key={index} style={styles.warningItem}>
                    <Icon
                      name={getWarningIcon(warning.type)}
                      size={16}
                      color={getWarningColor(warning.severity)}
                    />
                    <Text style={styles.warningText}>{warning.message}</Text>
                  </View>
                ))}
                {warnings.length > 2 && (
                  <Text style={styles.moreWarnings}>
                    +{warnings.length - 2} more warnings
                  </Text>
                )}
              </View>
            )}

            {/* Start Navigation Button */}
            <Button
              title="Start Navigation"
              onPress={handleStartNavigation}
              variant="primary"
              size="large"
              icon="navigation"
              style={styles.startButton}
            />
          </ScrollView>
        </Card>
      </View>
    </View>
  );
};

MapScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      route: PropTypes.object.isRequired,
      origin: PropTypes.string,
      destination: PropTypes.string,
    }),
  }).isRequired,
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
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    bottom: 280, // Leave space for bottom card
  },
  warningMarker: {
    padding: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  callout: {
    padding: SPACING.sm,
    minWidth: 150,
  },
  calloutTitle: {
    fontWeight: '600',
    fontSize: FONT_SIZE.medium,
    marginBottom: SPACING.xs,
  },
  calloutSubtitle: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textLight,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    paddingTop: 0,
  },
  infoCard: {
    maxHeight: 280,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  routeType: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'capitalize',
  },
  routeMode: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
    marginTop: 2,
  },
  comfortBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  comfortScore: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  comfortLabel: {
    fontSize: FONT_SIZE.small,
    color: COLORS.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.textMuted + '40',
  },
  warningsSection: {
    marginBottom: SPACING.md,
  },
  warningsTitle: {
    fontSize: FONT_SIZE.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  warningText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  moreWarnings: {
    fontSize: FONT_SIZE.small,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  startButton: {
    marginTop: SPACING.sm,
  },
});

export default MapScreen;
