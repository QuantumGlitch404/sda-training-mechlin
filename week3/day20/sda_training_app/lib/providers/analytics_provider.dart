import 'package:flutter/foundation.dart';

import '../models/analytics.dart';

class AnalyticsProvider extends ChangeNotifier {
  AnalyticsData? _analyticsData;
  bool _isLoading = false;
  String? _error;
  String _selectedTimeRange = '30d';

  AnalyticsData? get analyticsData => _analyticsData;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get selectedTimeRange => _selectedTimeRange;

  Future<void> fetchAnalytics({String? timeRange}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final selectedRange = timeRange ?? _selectedTimeRange;

      await Future<void>.delayed(const Duration(milliseconds: 500));

      _analyticsData = const AnalyticsData(
        totalUsers: 128,
        activeUsers: 96,
        completedTasks: 74,
        completionRate: 78.5,
      );

      _selectedTimeRange = selectedRange;
    } catch (error) {
      _error = error.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void setTimeRange(String timeRange) {
    _selectedTimeRange = timeRange;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
