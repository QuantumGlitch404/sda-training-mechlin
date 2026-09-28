import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>MECHLIN</Text>
            <Text style={styles.subtitle}>SDA CAPSTONE</Text>
          </View>

          <View style={styles.status}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Development</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.eyebrow}>OVERVIEW</Text>

        <Text style={styles.title}>Project Dashboard</Text>

        <Text style={styles.description}>
          Track tasks, project activity and development progress.
        </Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>OPEN TASKS</Text>
            <Text style={styles.statValue}>2</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statLabel}>COMPLETED</Text>
            <Text style={styles.statValue}>0</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statLabel}>HIGH PRIORITY</Text>
            <Text style={styles.statValue}>1</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current tasks</Text>
          <Text style={styles.sectionDescription}>
            Work currently recorded in the capstone project.
          </Text>

          <View style={styles.task}>
            <View style={styles.taskMain}>
              <Text style={styles.taskTitle}>
                Complete Day 27
              </Text>

              <Text style={styles.taskDescription}>
                Build and validate the capstone project.
              </Text>
            </View>

            <Text style={styles.progress}>IN PROGRESS</Text>
          </View>

          <View style={styles.task}>
            <View style={styles.taskMain}>
              <Text style={styles.taskTitle}>
                Project documentation
              </Text>

              <Text style={styles.taskDescription}>
                Complete technical documentation.
              </Text>
            </View>

            <Text style={styles.pending}>PENDING</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Mobile workspace
          </Text>

          <Text style={styles.sectionDescription}>
            React Native client for the SDA Training Capstone.
          </Text>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>
              View tasks
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },

  content: {
    padding: 24,
    paddingBottom: 48,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    color: "#f2f2f2",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#707070",
    fontSize: 10,
    marginTop: 3,
    letterSpacing: 1,
  },

  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6bb78f",
  },

  statusText: {
    color: "#777",
    fontSize: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#222",
    marginTop: 20,
    marginBottom: 34,
  },

  eyebrow: {
    color: "#777",
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  title: {
    color: "#f2f2f2",
    fontSize: 30,
    fontWeight: "600",
    letterSpacing: -0.8,
  },

  description: {
    color: "#888",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    maxWidth: 500,
  },

  stats: {
    flexDirection: "row",
    marginTop: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#222",
  },

  stat: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderColor: "#222",
  },

  statLabel: {
    color: "#707070",
    fontSize: 9,
    letterSpacing: 0.8,
  },

  statValue: {
    color: "#f2f2f2",
    fontSize: 26,
    fontWeight: "500",
    marginTop: 8,
  },

  section: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#222",
    backgroundColor: "#0a0a0a",
  },

  sectionTitle: {
    color: "#eee",
    fontSize: 15,
    fontWeight: "600",
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  sectionDescription: {
    color: "#707070",
    fontSize: 11,
    paddingHorizontal: 18,
    marginTop: 5,
    marginBottom: 14,
  },

  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderTopWidth: 1,
    borderColor: "#222",
  },

  taskMain: {
    flex: 1,
    paddingRight: 15,
  },

  taskTitle: {
    color: "#eee",
    fontSize: 13,
    fontWeight: "500",
  },

  taskDescription: {
    color: "#666",
    fontSize: 11,
    marginTop: 5,
  },

  progress: {
    color: "#9d91ff",
    fontSize: 9,
    letterSpacing: 0.5,
  },

  pending: {
    color: "#777",
    fontSize: 9,
    letterSpacing: 0.5,
  },

  button: {
    margin: 18,
    marginTop: 5,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eeeeee",
  },

  buttonText: {
    color: "#111",
    fontSize: 12,
    fontWeight: "500",
  },
});