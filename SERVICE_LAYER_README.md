# JLPT Practice Application - Service Layer Documentation

## Overview

This document describes the architecture and usage of the Service Layer for the JLPT Practice Application. The Service Layer follows a clean architecture pattern with strict type safety and flexible data source management.

## Architecture

### Type Definitions (`src/types/index.ts`)

Comprehensive TypeScript interfaces covering all entities:

- **Core Entities**: `ITest`, `ISection`, `IPart`, `IPassage`, `IQuestion`, `IOption`, `IUser`, `ISectionAttempt`, `IUserAnswer`
- **Composite Types**: `ITestDetail`, `ISectionWithParts`, `IPartWithQuestions`, `IQuestionWithOptions`
- **DTOs**: `TestFilter`, `ISubmission`, `IResult`, `IAttempt`, `IAuthResponse`
- **UI State Types**: `IAnswerState`, `ISectionProgress`

**Key Features:**
- HTML support for `title`, `content`, and `explanation` fields (including `<ruby>` tags for Furigana)
- Clear interface naming with `I` prefix
- Optional timestamp fields for flexibility

### Service Interface (`src/services/IDataService.ts`)

Defines the contract for all data operations:

```typescript
interface IDataService {
  // Test Management
  getTests(filter?: TestFilter): Promise<ITest[]>;
  getTestDetail(id: number): Promise<ITestDetail>;
  
  // Section Attempt Management
  startSectionAttempt(userId: number, sectionId: number): Promise<ISectionAttempt>;
  resumeSectionAttempt(attemptId: number): Promise<ISectionAttempt>;
  saveProgress(attemptId: number, timeRemaining: number): Promise<ISectionAttempt>;
  submitAttempt(data: ISubmission): Promise<IResult>;
  
  // User History
  getHistory(userId: number): Promise<IAttempt[]>;
  getAttemptResult(attemptId: number): Promise<IResult>;
  
  // Authentication
  login(credentials: ILoginCredentials): Promise<IAuthResponse>;
  register(data: IRegisterData): Promise<IAuthResponse>;
  getCurrentUser(): Promise<IUser>;
  logout(): Promise<void>;
}
```

### Mock Data Service (`src/services/MockDataService.ts`)

**Purpose:** Development and testing without backend dependency

**Features:**
- Complete JLPT N3 test with realistic data
- Ruby tags for Furigana rendering: `<ruby>漢字<rt>かんじ</rt></ruby>`
- In-memory state management
- Simulated network delays (200-500ms)
- Auto-grading logic
- Mock authentication (test@example.com / password123)

**Included Mock Data:**
- 2 N3 Tests (2023年7月, 2023年12月)
- Full test detail with 3 sections:
  - Section 1: 言語知識（文字・語彙）- 30 minutes, 6 questions
  - Section 2: 言語知識（文法）・読解 - 70 minutes, 4 questions + reading passage
  - Section 3: 聴解 - 40 minutes, 2 listening questions

### API Data Service (`src/services/ApiDataService.ts`)

**Purpose:** Production API integration using Axios

**Features:**
- Configurable base URL via environment variable
- Automatic JWT token management (localStorage)
- Request/response interceptors
- 401 auto-logout and redirect
- Comprehensive error handling
- Type-safe API calls

**Environment Configuration:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Service Factory (`src/services/index.ts`)

**Purpose:** Singleton pattern with automatic implementation selection

**Configuration (`src/services/config.ts`):**
```typescript
export const USE_MOCK_DATA = true; // Toggle here!
export const API_BASE_URL = 'http://localhost:3000/api';
```

**Usage:**
```typescript
import { dataService } from './services';

// Automatically uses MockDataService or ApiDataService based on USE_MOCK_DATA
const tests = await dataService.getTests();
```

## Usage Examples

### 1. Get Filtered Tests

```typescript
import { dataService } from './services';

const n3Tests = await dataService.getTests({ 
  level: 'N3', 
  is_active: true 
});
```

### 2. Start Test Attempt

```typescript
const attempt = await dataService.startSectionAttempt(userId, sectionId);
console.log(`Time limit: ${attempt.time_remaining} seconds`);
```

### 3. Submit Answers

```typescript
const submission = {
  section_attempt_id: attemptId,
  answers: [
    { question_id: 1, selected_option_id: 2, is_marked: false },
    { question_id: 2, selected_option_id: 5, is_marked: true },
  ],
  time_remaining: 1200,
};

const result = await dataService.submitAttempt(submission);
console.log(`Score: ${result.score}% (${result.correct_count}/${result.total_questions})`);
```

### 4. React Component Integration

```tsx
import { useEffect, useState } from 'react';
import { dataService, type ITest } from './services';

function TestList() {
  const [tests, setTests] = useState<ITest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService.getTests({ level: 'N3' })
      .then(setTests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {tests.map(test => (
        <div key={test.id}>
          {/* dangerouslySetInnerHTML for ruby tags */}
          <h2 dangerouslySetInnerHTML={{ __html: test.title }} />
          <p>Level: {test.level}, Year: {test.year}</p>
        </div>
      ))}
    </div>
  );
}
```

## Rendering HTML Content (Ruby Tags)

Many fields support HTML, especially for Furigana:

```html
<ruby>日本語<rt>にほんご</rt></ruby>能力<ruby>試験<rt>しけん</rt></ruby>
```

**Rendering in React:**

```tsx
<div dangerouslySetInnerHTML={{ __html: question.content }} />
```

**Security Note:** Since this content comes from your controlled backend/mock data, `dangerouslySetInnerHTML` is safe. For user-generated content, use sanitization libraries like DOMPurify.

## Switching Between Mock and API

**Step 1:** Edit `src/services/config.ts`

```typescript
// Development with mock data
export const USE_MOCK_DATA = true;

// Production with real API
export const USE_MOCK_DATA = false;
```

**Step 2:** (Optional) Set environment variable

```env
VITE_API_BASE_URL=https://api.production.com
```

**Step 3:** Restart dev server

```bash
npm run dev
```

## API Endpoints (for backend implementation)

### Tests
- `GET /api/tests?level=N3&year=2023&is_active=true` - List tests
- `GET /api/tests/:id` - Get test detail with nested sections/parts/questions

### Section Attempts
- `POST /api/section-attempts` - Start new attempt
  ```json
  { "user_id": 1, "section_id": 1 }
  ```
- `PATCH /api/section-attempts/:id/resume` - Resume paused attempt
- `PATCH /api/section-attempts/:id/progress` - Save progress
  ```json
  { "time_remaining": 1200 }
  ```
- `POST /api/section-attempts/:id/submit` - Submit answers
  ```json
  {
    "section_attempt_id": 1,
    "answers": [
      { "question_id": 1, "selected_option_id": 2, "is_marked": false }
    ],
    "time_remaining": 1200
  }
  ```

### User History
- `GET /api/users/:userId/attempts` - Get user history
- `GET /api/section-attempts/:id/result` - Get detailed result

### Authentication
- `POST /api/auth/login` - Login
  ```json
  { "email": "user@example.com", "password": "password" }
  ```
- `POST /api/auth/register` - Register
  ```json
  { "email": "user@example.com", "password": "password", "full_name": "Name" }
  ```
- `GET /api/auth/me` - Get current user (requires Bearer token)
- `POST /api/auth/logout` - Logout

## Testing Mock Service

```bash
# Run development server
npm run dev

# Open browser console and test
```

```javascript
// In browser console
import { dataService } from './services';

// Test login
const auth = await dataService.login({
  email: 'test@example.com',
  password: 'password123'
});

// Test get tests
const tests = await dataService.getTests();

// Test get detail
const detail = await dataService.getTestDetail(1);
```

## Benefits

✅ **Type Safety**: Full TypeScript coverage with strict types  
✅ **Flexibility**: Easy toggle between mock and real API  
✅ **Testability**: Mock service for unit/integration tests  
✅ **Maintainability**: Single interface, multiple implementations  
✅ **Developer Experience**: Work without backend dependency  
✅ **Production Ready**: API service with error handling and auth  

## Next Steps

1. **UI Components**: Build React components using the service layer
2. **State Management**: Consider Context API or Zustand for global state
3. **Error Handling**: Add toast notifications for errors
4. **Loading States**: Implement skeleton screens
5. **Caching**: Add React Query for caching and optimistic updates
6. **Testing**: Write unit tests for services and components

## File Structure

```
src/
├── types/
│   └── index.ts                 # All TypeScript interfaces
├── services/
│   ├── IDataService.ts          # Service interface
│   ├── MockDataService.ts       # Mock implementation
│   ├── ApiDataService.ts        # API implementation
│   ├── config.ts                # Configuration (toggle here!)
│   └── index.ts                 # Factory & exports
└── example-usage.ts             # Usage examples
```

## License

MIT
