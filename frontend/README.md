# Frontend - Algorithm Visualization

Pure React visualization layer. **Zero algorithm logic** - just displays traces from backend.

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Runs on `http://localhost:3000`

## Architecture

- **App.jsx** - Main component, fetches trace from backend and controls playback
- **Components** - Reusable visualization components (Timeline, Details, etc.)

## Key Principle

Frontend does **ZERO computation**:
- No algorithm logic
- No state management of algorithm
- Just displays what backend sends

```javascript
// This is all the frontend does:
const step = trace.steps[currentStep];
return <TimelineView data={step} />;
```

## Backend Dependency

Frontend requires backend running on `http://localhost:5000`

If backend is down, frontend shows error with setup instructions.