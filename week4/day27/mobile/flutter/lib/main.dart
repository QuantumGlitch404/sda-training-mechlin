import 'package:flutter/material.dart';

void main() {
  runApp(const CapstoneApp());
}

class CapstoneApp extends StatelessWidget {
  const CapstoneApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'SDA Capstone',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF050505),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF9D91FF),
        ),
        useMaterial3: true,
      ),
      home: const DashboardScreen(),
    );
  }
}

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'MECHLIN',
                        style: TextStyle(
                          color: Color(0xFFF2F2F2),
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 1.2,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        'SDA CAPSTONE',
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 10,
                          letterSpacing: 1,
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        decoration: const BoxDecoration(
                          color: Color(0xFF6BB78F),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 7),
                      Text(
                        'Development',
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 22),

              // Divider
              Container(
                height: 1,
                color: const Color(0xFF222222),
              ),

              const SizedBox(height: 34),

              // Page heading
              Text(
                'OVERVIEW',
                style: TextStyle(
                  color: Colors.grey.shade600,
                  fontSize: 10,
                  letterSpacing: 1.2,
                ),
              ),

              const SizedBox(height: 10),

              const Text(
                'Project Dashboard',
                style: TextStyle(
                  color: Color(0xFFF2F2F2),
                  fontSize: 30,
                  fontWeight: FontWeight.w600,
                  letterSpacing: -0.5,
                ),
              ),

              const SizedBox(height: 10),

              Text(
                'Track tasks, project activity and development progress.',
                style: TextStyle(
                  color: Colors.grey.shade600,
                  fontSize: 14,
                  height: 1.5,
                ),
              ),

              const SizedBox(height: 30),

              // Statistics
              Row(
                children: [
                  Expanded(
                    child: _Stat(
                      label: 'OPEN TASKS',
                      value: '2',
                    ),
                  ),
                  Expanded(
                    child: _Stat(
                      label: 'COMPLETED',
                      value: '0',
                    ),
                  ),
                  Expanded(
                    child: _Stat(
                      label: 'HIGH PRIORITY',
                      value: '1',
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 30),

              // Current tasks
              _Section(
                title: 'Current tasks',
                description:
                    'Work currently recorded in the capstone project.',
                children: [
                  _Task(
                    title: 'Complete Day 27',
                    description:
                        'Build and validate the capstone project.',
                    status: 'IN PROGRESS',
                    statusColor: const Color(0xFF9D91FF),
                  ),
                  _Task(
                    title: 'Project documentation',
                    description:
                        'Complete technical documentation.',
                    status: 'PENDING',
                    statusColor: const Color(0xFF777777),
                  ),
                ],
              ),

              const SizedBox(height: 30),

              // Mobile workspace
              _Section(
                title: 'Mobile workspace',
                description:
                    'Flutter client for the SDA Training Capstone.',
                children: [
                  Padding(
                    padding: const EdgeInsets.all(18),
                    child: SizedBox(
                      width: double.infinity,
                      height: 44,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEFEFEF),
                          foregroundColor: const Color(0xFF111111),
                          elevation: 0,
                          shape: const RoundedRectangleBorder(
                            borderRadius: BorderRadius.zero,
                          ),
                        ),
                        onPressed: () {},
                        child: const Text(
                          'View tasks',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  final String label;
  final String value;

  const _Stat({
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        vertical: 20,
        horizontal: 12,
      ),
      decoration: const BoxDecoration(
        border: Border(
          top: BorderSide(
            color: Color(0xFF222222),
          ),
          bottom: BorderSide(
            color: Color(0xFF222222),
          ),
          right: BorderSide(
            color: Color(0xFF222222),
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF707070),
              fontSize: 9,
              letterSpacing: 0.8,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              color: Color(0xFFF2F2F2),
              fontSize: 26,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _Section extends StatelessWidget {
  final String title;
  final String description;
  final List<Widget> children;

  const _Section({
    required this.title,
    required this.description,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF0A0A0A),
        border: Border.all(
          color: const Color(0xFF222222),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(
              18,
              18,
              18,
              0,
            ),
            child: Text(
              title,
              style: const TextStyle(
                color: Color(0xFFEEEEEE),
                fontSize: 15,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(
              18,
              5,
              18,
              14,
            ),
            child: Text(
              description,
              style: const TextStyle(
                color: Color(0xFF707070),
                fontSize: 11,
              ),
            ),
          ),
          ...children,
        ],
      ),
    );
  }
}

class _Task extends StatelessWidget {
  final String title;
  final String description;
  final String status;
  final Color statusColor;

  const _Task({
    required this.title,
    required this.description,
    required this.status,
    required this.statusColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: const BoxDecoration(
        border: Border(
          top: BorderSide(
            color: Color(0xFF222222),
          ),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Color(0xFFEEEEEE),
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  description,
                  style: const TextStyle(
                    color: Color(0xFF666666),
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          Text(
            status,
            style: TextStyle(
              color: statusColor,
              fontSize: 9,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}