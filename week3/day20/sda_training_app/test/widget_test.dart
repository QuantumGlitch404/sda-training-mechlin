import 'package:flutter_test/flutter_test.dart';
import 'package:sda_training_app/main.dart';

void main() {
  testWidgets('SDA Training App loads successfully', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(const SDATrainingApp());

    expect(find.text('SDA Training App'), findsOneWidget);
    expect(find.text('Sign in to continue'), findsOneWidget);
  });
}
