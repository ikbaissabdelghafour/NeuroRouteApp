// Home Screen
// Main dashboard with search and quick route cards

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/colors';
import { SPACING, FONT_SIZE, SHADOWS } from '../constants/theme';
import { useAuth } from '../navigation/AuthContext';
import { getProfile } from '../services/storageService';
import { ROUTES } from '../navigation/routes';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const QUICK_ROUTES = [
  { id: 'calm', title: 'Calm Route', icon: 'leaf', color: COLORS.secondary, description: 'Low noise & crowd' },
  { id: 'shortest', title: 'Shortest Route', icon: 'ray-start-arrow', color: COLORS.info, description: 'Fastest path' },
  { id: 'accessible', title: 'Accessible Route', icon: 'wheelchair-accessibility', color: COLORS.primary, description: 'Wheelchair friendly' },
  { id: 'safe', title: 'Safe Route', icon: 'shield-check', color: COLORS.warning, description: 'Well-lit & secure' },
];

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadProfile();
    setGreeting(getGreeting());
  }, []);

  const loadProfile = async () => {
    const userProfile = await getProfile();
    if (userProfile) {
      setProfile(userProfile);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleFindRoute = () => {
    if (!origin.trim() || !destination.trim()) {
      // For demo, use default locations
      navigation.navigate(ROUTES.ROUTE_SELECTION, {
        origin: origin.trim() || 'Current Location',
        destination: destination.trim() || 'Central Park',
      });
    } else {
      navigation.navigate(ROUTES.ROUTE_SELECTION, {
        origin: origin.trim(),
        destination: destination.trim(),
      });
    }
  };

  const handleQuickRoute = (routeType) => {
    navigation.navigate(ROUTES.ROUTE_SELECTION, {
      origin: 'Current Location',
      destination: 'Central Park',
      preferredType: routeType,
    });
  };

  const userName = profile?.name || user?.name || 'Friend';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.userName}>{userName}!</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate(ROUTES.PROFILE)}
          accessibilityLabel="Go to profile"
        >
          <Icon name="account-circle" size={48} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <Card style={styles.searchCard} shadow="large">
        <Text style={styles.searchTitle}>Where would you like to go?</Text>
        
        <Input
          label="From"
          value={origin}
          onChangeText={setOrigin}
          placeholder="Enter starting point"
          icon="map-marker"
        />

        <View style={styles.swapButton}>
          <TouchableOpacity
            onPress={() => {
              const temp = origin;
              setOrigin(destination);
              setDestination(temp);
            }}
            accessibilityLabel="Swap origin and destination"
          >
            <Icon name="swap-vertical" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <Input
          label="To"
          value={destination}
          onChangeText={setDestination}
          placeholder="Enter destination"
          icon="map-marker"
        />

        <Button
          title="Find Best Route"
          onPress={handleFindRoute}
          variant="primary"
          size="large"
          icon="routes"
          style={styles.findButton}
        />
      </Card>

      {/* Quick Route Cards */}
      <Text style={styles.sectionTitle}>Quick Options</Text>
      <View style={styles.quickRoutesGrid}>
        {QUICK_ROUTES.map((route) => (
          <TouchableOpacity
            key={route.id}
            style={styles.quickRouteCard}
            onPress={() => handleQuickRoute(route.id)}
            accessibilityLabel={`${route.title}: ${route.description}`}
          >
            <Card
              style={[styles.quickCard, { borderLeftColor: route.color }]}
              shadow="small"
              padding="medium"
            >
              <Icon name={route.icon} size={32} color={route.color} />
              <Text style={styles.quickCardTitle}>{route.title}</Text>
              <Text style={styles.quickCardDesc}>{route.description}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings Button */}
      <Button
        title="Settings"
        onPress={() => navigation.navigate(ROUTES.SETTINGS)}
        variant="ghost"
        size="medium"
        icon="cog"
        style={styles.settingsButton}
      />
    </ScrollView>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  greeting: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.textLight,
  },
  userName: {
    fontSize: FONT_SIZE.xlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  profileButton: {
    padding: SPACING.xs,
  },
  searchCard: {
    margin: SPACING.lg,
    marginTop: 0,
  },
  searchTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  swapButton: {
    alignItems: 'center',
    marginVertical: -SPACING.sm,
    zIndex: 1,
  },
  findButton: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  quickRoutesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg - SPACING.xs,
  },
  quickRouteCard: {
    width: '50%',
    padding: SPACING.xs,
  },
  quickCard: {
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  quickCardTitle: {
    fontSize: FONT_SIZE.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  quickCardDesc: {
    fontSize: FONT_SIZE.small,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  settingsButton: {
    margin: SPACING.lg,
    alignSelf: 'center',
  },
});

export default HomeScreen;
