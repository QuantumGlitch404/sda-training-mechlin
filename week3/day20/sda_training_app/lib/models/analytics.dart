class AnalyticsData {
  final int totalUsers;
  final int activeUsers;
  final int completedTasks;
  final double completionRate;

  const AnalyticsData({
    required this.totalUsers,
    required this.activeUsers,
    required this.completedTasks,
    required this.completionRate,
  });

  factory AnalyticsData.fromJson(Map<String, dynamic> json) {
    return AnalyticsData(
      totalUsers: json['totalUsers'] as int? ?? 0,
      activeUsers: json['activeUsers'] as int? ?? 0,
      completedTasks: json['completedTasks'] as int? ?? 0,
      completionRate: (json['completionRate'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
