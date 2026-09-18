class OfflineAction {
  final String id;
  final String endpoint;
  final String method;
  final Map<String, dynamic> data;
  final DateTime timestamp;

  const OfflineAction({
    required this.id,
    required this.endpoint,
    required this.method,
    required this.data,
    required this.timestamp,
  });

  factory OfflineAction.fromJson(Map<String, dynamic> json) {
    return OfflineAction(
      id: json['id']?.toString() ?? '',
      endpoint: json['endpoint']?.toString() ?? '',
      method: json['method']?.toString() ?? 'POST',
      data: Map<String, dynamic>.from(json['data'] ?? {}),
      timestamp:
          DateTime.tryParse(json['timestamp']?.toString() ?? '') ??
          DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'endpoint': endpoint,
      'method': method,
      'data': data,
      'timestamp': timestamp.toIso8601String(),
    };
  }
}
