import 'package:flutter/material.dart';

class MainScreen extends StatefulWidget {
  final VoidCallback onLogout;

  const MainScreen({super.key, required this.onLogout});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int selectedIndex = 0;

  final List<String> pageTitles = [
    'Dashboard',
    'Analytics',
    'Profile',
    'Settings',
  ];

  Widget buildPage() {
    switch (selectedIndex) {
      case 0:
        return const DashboardPage();
      case 1:
        return const AnalyticsPage();
      case 2:
        return const ProfilePage();
      case 3:
        return SettingsPage(onLogout: null);
      default:
        return const DashboardPage();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(pageTitles[selectedIndex]), centerTitle: true),
      body: buildPage(),
      bottomNavigationBar: NavigationBar(
        selectedIndex: selectedIndex,
        onDestinationSelected: (index) {
          setState(() {
            selectedIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.analytics_outlined),
            selectedIcon: Icon(Icons.analytics),
            label: 'Analytics',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Welcome back!',
          style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 20),
        Card(
          child: ListTile(
            leading: const Icon(Icons.task_alt, size: 40),
            title: const Text('Completed Tasks'),
            subtitle: const Text('12 tasks completed'),
            trailing: const Text(
              '12',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.cloud_done, size: 40),
            title: const Text('Sync Status'),
            subtitle: const Text('All data is synchronized'),
            trailing: const Icon(Icons.check_circle, color: Colors.green),
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.wifi, size: 40),
            title: const Text('Connection'),
            subtitle: const Text('Online mode'),
            trailing: const Icon(Icons.wifi),
          ),
        ),
      ],
    );
  }
}

class AnalyticsPage extends StatelessWidget {
  const AnalyticsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Analytics Overview',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 20),
        Card(
          child: ListTile(
            leading: const Icon(Icons.bar_chart),
            title: const Text('Total Activities'),
            subtitle: const Text('150 activities recorded'),
          ),
        ),
        Card(
          child: ListTile(
            leading: const Icon(Icons.trending_up),
            title: const Text('Performance'),
            subtitle: const Text('Performance increased by 15%'),
          ),
        ),
      ],
    );
  }
}

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircleAvatar(radius: 50, child: Icon(Icons.person, size: 60)),
          SizedBox(height: 16),
          Text(
            'Demo User',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          Text('demo@example.com'),
        ],
      ),
    );
  }
}

class SettingsPage extends StatelessWidget {
  final VoidCallback? onLogout;

  const SettingsPage({super.key, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        const ListTile(
          leading: Icon(Icons.notifications),
          title: Text('Notifications'),
          subtitle: Text('Manage notifications'),
        ),
        const ListTile(
          leading: Icon(Icons.language),
          title: Text('Language'),
          subtitle: Text('English'),
        ),
        ListTile(
          leading: const Icon(Icons.logout),
          title: const Text('Logout'),
          onTap: onLogout,
        ),
      ],
    );
  }
}
