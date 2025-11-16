/**
 * Example Usage of the Data Service
 * This file demonstrates how to use the data service in your React components
 */

import { dataService } from './services';
import type { TestFilter } from './services';

// ============================================================================
// Example 1: Get all tests
// ============================================================================

export async function exampleGetTests() {
  try {
    const tests = await dataService.getTests();
    console.log('All tests:', tests);
    return tests;
  } catch (error) {
    console.error('Error fetching tests:', error);
    throw error;
  }
}

// ============================================================================
// Example 2: Get filtered tests (N3 level only)
// ============================================================================

export async function exampleGetN3Tests() {
  try {
    const filter: TestFilter = { level: 'N3', is_active: true };
    const tests = await dataService.getTests(filter);
    console.log('N3 tests:', tests);
    return tests;
  } catch (error) {
    console.error('Error fetching N3 tests:', error);
    throw error;
  }
}

// ============================================================================
// Example 3: Get test detail with all sections and questions
// ============================================================================

export async function exampleGetTestDetail(testId: number) {
  try {
    const testDetail = await dataService.getTestDetail(testId);
    console.log('Test detail:', testDetail);
    
    // Access nested data
    testDetail.sections.forEach((section) => {
      console.log(`Section: ${section.name}`);
      console.log(`Time limit: ${section.time_limit} minutes`);
      
      section.parts.forEach((part) => {
        console.log(`  Part ${part.part_number}: ${part.title}`);
        console.log(`  Questions: ${part.questions.length}`);
        
        // Example: Check if this part has a passage (reading comprehension)
        if (part.passage) {
          console.log(`  Passage: ${part.passage.title}`);
        }
      });
    });
    
    return testDetail;
  } catch (error) {
    console.error('Error fetching test detail:', error);
    throw error;
  }
}

// ============================================================================
// Example 4: Start a section attempt
// ============================================================================

export async function exampleStartAttempt(userId: number, sectionId: number) {
  try {
    const attempt = await dataService.startSectionAttempt(userId, sectionId);
    console.log('Started attempt:', attempt);
    console.log(`Time remaining: ${attempt.time_remaining} seconds`);
    return attempt;
  } catch (error) {
    console.error('Error starting attempt:', error);
    throw error;
  }
}

// ============================================================================
// Example 5: Submit answers
// ============================================================================

export async function exampleSubmitAttempt(attemptId: number) {
  try {
    // Example: User answered questions 1, 2, 3
    const submission = {
      section_attempt_id: attemptId,
      answers: [
        { question_id: 1, selected_option_id: 2, is_marked: false }, // Correct answer
        { question_id: 2, selected_option_id: 5, is_marked: false }, // Correct answer
        { question_id: 3, selected_option_id: 10, is_marked: true }, // Wrong answer, marked for review
      ],
      time_remaining: 1200, // 20 minutes remaining
    };
    
    const result = await dataService.submitAttempt(submission);
    console.log('Result:', result);
    console.log(`Score: ${result.score}%`);
    console.log(`Correct: ${result.correct_count}/${result.total_questions}`);
    
    // Show detailed feedback
    result.questions.forEach((q) => {
      console.log(`Question ${q.question_number}:`);
      console.log(`  Correct: ${q.is_correct ? '✓' : '✗'}`);
      if (q.explanation) {
        console.log(`  Explanation: ${q.explanation}`);
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error submitting attempt:', error);
    throw error;
  }
}

// ============================================================================
// Example 6: Get user history
// ============================================================================

export async function exampleGetHistory(userId: number) {
  try {
    const history = await dataService.getHistory(userId);
    console.log('User history:', history);
    
    history.forEach((attempt) => {
      console.log(`Test: ${attempt.test_title}`);
      console.log(`Status: ${attempt.is_completed ? 'Completed' : 'In Progress'}`);
      if (attempt.total_score !== null) {
        console.log(`Score: ${attempt.total_score}%`);
      }
      console.log(`Started: ${attempt.started_at}`);
    });
    
    return history;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
}

// ============================================================================
// Example 7: Login
// ============================================================================

export async function exampleLogin() {
  try {
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    };
    
    const authResponse = await dataService.login(credentials);
    console.log('Logged in:', authResponse.user);
    console.log('Token:', authResponse.token);
    
    return authResponse;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// ============================================================================
// Example 8: React Component Usage
// ============================================================================

/*
import { useEffect, useState } from 'react';
import { dataService, ITest } from './services';

function TestListComponent() {
  const [tests, setTests] = useState<ITest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const data = await dataService.getTests({ level: 'N3', is_active: true });
        setTests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>JLPT Tests</h1>
      {tests.map((test) => (
        <div key={test.id}>
          <h2 dangerouslySetInnerHTML={{ __html: test.title }} />
          <p>Level: {test.level}</p>
          <p>Year: {test.year}, Month: {test.month}</p>
        </div>
      ))}
    </div>
  );
}
*/
