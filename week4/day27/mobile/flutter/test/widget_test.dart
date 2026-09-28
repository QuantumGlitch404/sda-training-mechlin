import 'package:flutter_test/flutter_test.dart';
import 'package:sda_training_capstone/main.dart';

void main() {
  testWidgets('Capstone app loads', (WidgetTester tester) async {
    await tester.pumpWidget(const CapstoneApp());

    expect(find.text('MECHLIN'), findsOneWidget);
    expect(find.text('SDA CAPSTONE'), findsOneWidget);
    expect(find.text('Project Dashboard'), findsOneWidget);
    expect(find.text('Current tasks'), findsOneWidget);
  });
}