import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      <Text>Users: 120</Text>
      <Text>Orders: 48</Text>
      <Text>Revenue: ₹25,000</Text>
      <Text>Active Users: 72</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});