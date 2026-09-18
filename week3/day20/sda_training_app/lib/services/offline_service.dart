import 'dart:convert';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';

class OfflineService {
  static const String _queueKey = 'offline_action_queue';

  final Connectivity _connectivity = Connectivity();

  Future<bool> isOnline() async {
    final List<ConnectivityResult> results = await _connectivity
        .checkConnectivity();

    return results.any((result) => result != ConnectivityResult.none);
  }

  Future<void> queueAction(Map<String, dynamic> action) async {
    final SharedPreferences preferences = await SharedPreferences.getInstance();

    final List<String> existingQueue =
        preferences.getStringList(_queueKey) ?? <String>[];

    existingQueue.add(jsonEncode(action));

    await preferences.setStringList(_queueKey, existingQueue);
  }

  Future<List<Map<String, dynamic>>> getQueuedActions() async {
    final SharedPreferences preferences = await SharedPreferences.getInstance();

    final List<String> queuedActions =
        preferences.getStringList(_queueKey) ?? <String>[];

    return queuedActions
        .map(
          (String action) =>
              Map<String, dynamic>.from(jsonDecode(action) as Map),
        )
        .toList();
  }

  Future<void> clearQueue() async {
    final SharedPreferences preferences = await SharedPreferences.getInstance();

    await preferences.remove(_queueKey);
  }
}
