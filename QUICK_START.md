# 🚀 Quick Start Guide - JLPT Practice App

## ✅ What's Ready

Your JLPT practice application foundation is **complete** with:

- ✅ **22 TypeScript interfaces** (strict type safety)
- ✅ **Service Layer** (Mock + API implementations)
- ✅ **Realistic N3 mock data** (12 questions, 3 sections)
- ✅ **Furigana support** (HTML with `<ruby>` tags)
- ✅ **Authentication** (JWT token management)
- ✅ **Auto-grading** (scoring and feedback)

---

## 📁 Project Structure

```
fe_jlpt/
├── src/
│   ├── types/
│   │   └── index.ts              # All TypeScript interfaces
│   ├── services/
│   │   ├── IDataService.ts       # Service interface
│   │   ├── MockDataService.ts    # Mock implementation ⚡ ACTIVE
│   │   ├── ApiDataService.ts     # API implementation
│   │   ├── config.ts             # USE_MOCK_DATA = true
│   │   └── index.ts              # Factory (exports dataService)
│   ├── example-usage.ts          # Usage examples
│   └── test-services.ts          # Test script
├── SERVICE_LAYER_README.md       # Detailed docs
├── PROJECT_SUMMARY.md            # This project overview
└── .env.example                  # Environment template
```

---

## 🎯 Step 1: Test the Service Layer

### Option A: Browser Console (Recommended)

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open browser console (F12)

3. Test the service:
   ```javascript
   // Import and test
   import('./src/services').then(({ dataService }) => {
     dataService.getTests().then(tests => {
       console.log('Tests:', tests);
     });
   });
   ```

### Option B: Create a Test Component

Create `src/TestComponent.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { dataService, type ITest } from './services';

export function TestComponent() {
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
      <h1>JLPT Tests</h1>
      {tests.map(test => (
        <div key={test.id}>
          <h2 dangerouslySetInnerHTML={{ __html: test.title }} />
          <p>Level: {test.level}, Year: {test.year}</p>
        </div>
      ))}
    </div>
  );
}
```

Then use it in `App.tsx`:
```tsx
import { TestComponent } from './TestComponent';

function App() {
  return <TestComponent />;
}

export default App;
```

---

## 🎯 Step 2: Build Your First Feature

### Example: Test List Page

1. **Create component**: `src/components/TestList.tsx`
2. **Import service**: `import { dataService } from '../services'`
3. **Fetch data**: Use `useEffect` + `useState`
4. **Render HTML**: Use `dangerouslySetInnerHTML` for ruby tags

### Example: Test Taking Page

1. **Get test detail**: `dataService.getTestDetail(id)`
2. **Start attempt**: `dataService.startSectionAttempt(userId, sectionId)`
3. **Track answers**: Local state with `IAnswerState` type
4. **Submit**: `dataService.submitAttempt(submission)`
5. **Show results**: Display `IResult` with feedback

---

## 🔄 Step 3: Switch to Real API (Later)

When your backend is ready:

1. **Edit config**: `src/services/config.ts`
   ```typescript
   export const USE_MOCK_DATA = false; // Changed from true
   ```

2. **Set API URL**: Create `.env`
   ```env
   VITE_API_BASE_URL=https://your-api.com/api
   ```

3. **Restart**: `npm run dev`

That's it! Your app now uses real API. **No code changes needed!**

---

## 📝 Common Tasks

### Get Tests (with Filter)
```typescript
const tests = await dataService.getTests({ 
  level: 'N3', 
  is_active: true 
});
```

### Get Test Detail (Full Data)
```typescript
const detail = await dataService.getTestDetail(1);
// Access: detail.sections[0].parts[0].questions[0]
```

### Start Taking Test
```typescript
const attempt = await dataService.startSectionAttempt(userId, sectionId);
// Store attemptId: attempt.id
```

### Submit Answers
```typescript
const result = await dataService.submitAttempt({
  section_attempt_id: attemptId,
  answers: [
    { question_id: 1, selected_option_id: 2, is_marked: false }
  ],
  time_remaining: 1200
});
// result.score, result.correct_count, result.questions
```

### Show History
```typescript
const history = await dataService.getHistory(userId);
// Array of past attempts with scores
```

---

## 🎨 UI Recommendations

### For Furigana Rendering
```tsx
<div 
  className="question-content"
  dangerouslySetInnerHTML={{ __html: question.content }} 
/>
```

CSS for ruby tags:
```css
ruby {
  ruby-position: over;
}
rt {
  font-size: 0.6em;
}
```

### Component Libraries (Optional)
- **Material-UI**: Rich components, good for admin dashboards
- **Ant Design**: Enterprise-grade, excellent form handling
- **Tailwind CSS**: Utility-first, highly customizable

### State Management (Optional)
- **Context API**: Built-in, good for simple apps
- **Zustand**: Lightweight, easy to learn
- **React Query**: Data fetching + caching (highly recommended!)

---

## 🧪 Testing Guide

### Test Login (Mock)
```typescript
const auth = await dataService.login({
  email: 'test@example.com',
  password: 'password123'
});
// auth.token, auth.user
```

### Test Full Workflow
See `src/test-services.ts` for complete example.

---

## 📚 Documentation

- **Detailed Docs**: `SERVICE_LAYER_README.md`
- **API Endpoints**: See README for backend team
- **Usage Examples**: `src/example-usage.ts`
- **Type Definitions**: `src/types/index.ts`

---

## 🐛 Troubleshooting

### TypeScript Errors
```bash
npm run build
```

### Check Service Status
```typescript
import { USE_MOCK_DATA } from './services/config';
console.log('Using mock data:', USE_MOCK_DATA);
```

### Test Mock Service
Open browser console and run:
```javascript
import('./src/services').then(({ dataService }) => {
  dataService.getTests().then(console.log);
});
```

---

## 🎓 Learning Path

1. ✅ **Understand types** (`src/types/index.ts`)
2. ✅ **Review mock data** (`src/services/MockDataService.ts`)
3. 🔨 **Build TestList component** (fetch and display tests)
4. 🔨 **Build TestDetail component** (show sections/questions)
5. 🔨 **Build TestTaking component** (attempt + submit)
6. 🔨 **Build Results component** (show score + feedback)
7. 🔨 **Build History component** (past attempts)
8. 🎨 **Add styling and UX polish**
9. 🔌 **Connect to real API** (when ready)

---

## 💡 Pro Tips

1. **Use TypeScript**: Don't use `any`, let types guide you
2. **Import types**: `import type { ITest } from './services'`
3. **Handle errors**: Wrap service calls in try-catch
4. **Show loading states**: UX best practice
5. **Test with mock first**: Work without backend dependency
6. **Ruby tags**: Remember `dangerouslySetInnerHTML` for Furigana
7. **Time management**: Use `time_remaining` in seconds
8. **Mark questions**: Use `is_marked` for review flag

---

## 🚀 Deploy Checklist (Later)

- [ ] Set `USE_MOCK_DATA = false`
- [ ] Configure `VITE_API_BASE_URL`
- [ ] Test all endpoints with real API
- [ ] Build: `npm run build`
- [ ] Deploy `dist/` folder

---

## 📞 Need Help?

1. Check `SERVICE_LAYER_README.md` for detailed docs
2. Review `src/example-usage.ts` for patterns
3. Run `src/test-services.ts` to verify setup
4. Check types in `src/types/index.ts`

---

## ✨ You're Ready!

Your foundation is **solid**. Time to build an amazing JLPT practice app! 🎉

**Start with:** Create a simple TestList component that displays all N3 tests.

Good luck! 頑張ってください！ 🇯🇵
