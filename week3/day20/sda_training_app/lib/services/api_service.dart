import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/analytics.dart';
import '../models/user.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:3000/api/v1';

  late final Dio _dio;

  ApiService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final preferences = await SharedPreferences.getInstance();
          final token = preferences.getString('auth_token');

          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }

          handler.next(options);
        },
      ),
    );
  }

  Future<void> saveToken(String token) async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString('auth_token', token);
  }

  Future<void> removeToken() async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.remove('auth_token');
  }

  Future<User> login(String email, String password) async {
    // Demo login for local testing.
    // Replace this section with a real API request later.
    await Future<void>.delayed(const Duration(milliseconds: 700));

    if (email.isEmpty || password.isEmpty) {
      throw Exception('Email and password are required.');
    }

    await saveToken('demo-token');

    return const User(
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'user',
    );
  }

  Future<void> logout() async {
    try {
      await _dio.post('/auth/logout');
    } catch (_) {
      // Local logout should still work if the server is unavailable.
    }

    await removeToken();
  }

  Future<User?> getCurrentUser() async {
    final preferences = await SharedPreferences.getInstance();
    final token = preferences.getString('auth_token');

    if (token == null || token.isEmpty) {
      return null;
    }

    return const User(
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'user',
    );
  }

  Future<List<User>> getUsers() async {
    final response = await _dio.get('/users');

    final users = response.data['data']['users'] as List<dynamic>;

    return users
        .map((user) => User.fromJson(Map<String, dynamic>.from(user)))
        .toList();
  }

  Future<AnalyticsData> getAnalytics(String timeRange) async {
    final response = await _dio.get(
      '/analytics',
      queryParameters: {'timeRange': timeRange},
    );

    return AnalyticsData.fromJson(
      Map<String, dynamic>.from(response.data['data']),
    );
  }
}
