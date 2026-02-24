/// ✅ FIX: Correct Flutter Implementation for Assignment Submit

// 1️⃣ SETUP DIO PROPERLY - assignment_service.dart

import 'package:dio/dio.dart';

class AssignmentService {
  late final Dio _dio;
  final String baseUrl;
  final String token;

  AssignmentService({
    required this.baseUrl,
    required this.token,
  }) {
    // ✅ CONFIGURE DIO CORRECTLY
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      contentType: Headers.jsonContentType, // ✅ IMPORTANT: Set to JSON
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json', // ✅ IMPORTANT: Explicit JSON header
        'Accept': 'application/json',
      },
    ));
  }

  /// Submit assignment - CORRECT IMPLEMENTATION
  Future<SubmissionResult> submitAssignment({
    required String assignmentId,
    required List<Map<String, String>> answers,
  }) async {
    try {
      // ✅ Log what we're sending (for debugging)
      print('📤 Sending assignment submission...');
      print('URL: $baseUrl/assignments/$assignmentId/submit');
      print('Body: ${jsonEncode({'answers': answers})}');
      print('Headers: ${_dio.options.headers}');

      // ✅ CORRECT WAY: Use data parameter with proper JSON encoding
      final response = await _dio.post(
        '/assignments/$assignmentId/submit',
        data: jsonEncode({'answers': answers}), // ✅ Explicitly encode to JSON string
        options: Options(
          method: 'POST',
          contentType: 'application/json',
          responseType: ResponseType.json,
        ),
      );

      return SubmissionResult.fromJson(response.data);
    } on DioException catch (e) {
      print('❌ DIO Error: ${e.message}');
      print('Response: ${e.response?.data}');
      throw Exception('Failed to submit assignment: ${e.message}');
    } catch (e) {
      print('❌ Error: $e');
      throw Exception('Failed to submit assignment: $e');
    }
  }
}

// ──────────────────────────────────────────────────────────────

// 2️⃣ USAGE IN PROVIDER - assignment_provider.dart

import 'dart:convert';

Future<bool> submitAssignment(String assignmentId) async {
  if (currentAssignment == null) return false;

  isSubmitting = true;
  errorMessage = null;
  notifyListeners();

  try {
    // ✅ Prepare answers in correct format
    final List<Map<String, String>> submissionAnswers = answers.entries
        .map((e) => {
          'questionId': e.key,
          'userAnswer': e.value,
        })
        .toList();

    print('📝 Submitting answers:');
    for (var answer in submissionAnswers) {
      print('  Q: ${answer['questionId']} → A: ${answer['userAnswer']}');
    }

    // ✅ Call service with proper data
    final result = await service.submitAssignment(
      assignmentId: assignmentId,
      answers: submissionAnswers,
    );

    lastSubmissionResult = result;

    if (result.passed) {
      errorMessage =
          '🎉 Passed! Score: ${result.percentageScore}%\nCertificate: ${result.certificateId}';
    } else {
      if (eligibilityStatus!.remainingAttempts > 0) {
        errorMessage =
            '❌ Failed! Score: ${result.percentageScore}%\nAttempts remaining: ${eligibilityStatus!.remainingAttempts}';
      } else {
        errorMessage = '❌ Attempts exhausted! Final score: ${result.percentageScore}%';
      }
    }

    return result.passed;
  } catch (e) {
    errorMessage = 'Failed to submit: $e';
    return false;
  } finally {
    isSubmitting = false;
    notifyListeners();
  }
}

// ──────────────────────────────────────────────────────────────

// 3️⃣ ALTERNATIVE: If above doesn't work, use this simpler method

class AssignmentServiceV2 {
  final Dio _dio;

  AssignmentServiceV2({required Dio dio}) : _dio = dio;

  Future<SubmissionResult> submitAssignment({
    required String assignmentId,
    required List<Map<String, String>> answers,
  }) async {
    try {
      // ✅ Create proper request body
      Map<String, dynamic> requestBody = {
        'answers': answers.map((a) => {
          'questionId': a['questionId'],
          'userAnswer': a['userAnswer'],
        }).toList(),
      };

      print('Request Body: $requestBody');

      final response = await _dio.post(
        'https://tree-campus.onrender.com/api/assignments/$assignmentId/submit',
        data: requestBody,
        options: Options(
          method: 'POST',
          contentType: ContentType.json,
          responseType: ResponseType.json,
          headers: {
            'Content-Type': 'application/json',
          },
        ),
      );

      if (response.statusCode == 200) {
        return SubmissionResult.fromJson(response.data);
      } else {
        throw Exception('Server error: ${response.statusCode}');
      }
    } on DioException catch (e) {
      print('DIO Exception: ${e.message}');
      print('Response Data: ${e.response?.data}');
      throw Exception(e.response?.data['message'] ?? e.message);
    }
  }
}

// ──────────────────────────────────────────────────────────────

// 4️⃣ COMPLETE WORKING EXAMPLE - main.dart

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // ✅ Setup Dio with correct configuration
    final dio = Dio(BaseOptions(
      baseUrl: 'https://tree-campus.onrender.com/api',
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      contentType: Headers.jsonContentType,
      validateStatus: (status) {
        return status != null && status < 500;
      },
    ));

    // ✅ Add interceptor for debugging
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          print('➡️ REQUEST: ${options.method} ${options.uri}');
          print('Headers: ${options.headers}');
          print('Body: ${options.data}');
          return handler.next(options);
        },
        onResponse: (response, handler) {
          print('⬅️ RESPONSE: ${response.statusCode}');
          print('Data: ${response.data}');
          return handler.next(response);
        },
        onError: (DioException e, handler) {
          print('❌ ERROR: ${e.message}');
          print('Response: ${e.response?.data}');
          return handler.next(e);
        },
      ),
    );

    return MaterialApp(
      home: ChangeNotifierProvider(
        create: (_) => AssignmentProvider(
          service: AssignmentService(
            baseUrl: 'https://tree-campus.onrender.com/api',
            token: 'YOUR_JWT_TOKEN_HERE',
          ),
        ),
        child: const AssignmentTestScreen(
          assignmentId: '699d44fbe6cbffb8ccd8af0b',
          courseId: 'course_123',
        ),
      ),
    );
  }
}

// ──────────────────────────────────────────────────────────────

// 5️⃣ CHECKLIST FOR DEBUGGING

/*
❌ PROBLEMS & SOLUTIONS:

1. "Cannot destructure property 'answers' of 'req.body' as it is undefined"
   ✅ FIX: 
      - Set Header: 'Content-Type': 'application/json'
      - Use: data: jsonEncode({'answers': answers})
      - Or: data: {'answers': answers} (Dio auto-encodes)

2. Empty / Null req.body in Node.js
   ✅ FIX:
      - Ensure express.json() middleware is set up
      - Check Content-Type header is application/json
      - Verify Dio is sending data parameter correctly

3. Data format mismatch
   ✅ FIX:
      Backend expects:
      {
        "answers": [
          {"questionId": "q1", "userAnswer": "Option A"},
          {"questionId": "q2", "userAnswer": "Option B"}
        ]
      }
      
      Flutter should send EXACTLY this format

4. Token/Auth Issues
   ✅ FIX:
      - Ensure token is valid
      - Check Authorization header format: "Bearer TOKEN"
      - Verify token hasn't expired

TESTING TIPS:
- Use Postman to test the API first
- Enable Dio interceptors to see exactly what's being sent
- Check Network tab in Flutter DevTools
- Print request body before sending
*/
