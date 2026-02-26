# Knowledge Sharing Platform - Frontend

## Approach
### Architecture Overview
- **ReactJS (Vite)**: Fast development and build tool.
- **React-Bootstrap**: Responsive UI components using the Bootstrap 5 framework.
- **React Router**: Client-side routing for seamless navigation.
- **React Context API**: Centralized state management for user authentication.

### Folder Structure
- `src/components`: Reusable UI elements (Navbar, ArticleCards).
- `src/context`: AuthContext for global session state.
- `src/pages`: Main application views (Home, Login, Signup, Editor, Dashboard).
- `src/services`: API client using Axios with request interceptors.

### Key Design Decisions
- **Rich Text Editor**: Integrated `react-quill` for professional article formatting.
- **Real-Time AI Suite**: Fully functional AI tools for "Polish", "Concise", "Grammar", and "Suggest Title" powered by the backend AI service.
- **Dynamic Search & Analytics**: Live search filtering and real-time article view statistics on the user dashboard.

## AI Usage
### Tools Used
- **Cursor AI / Antigravity Agent**: Assisted in UI component design, Axios interceptor setup, and routing configuration.

### Impact Areas
- **UI Ideas**: Suggested using Lucide-React icons for better visual cues in the editor.
- **Code Generation**: Scaffolding the React-Quill editor integration and Search logic.
- **Troubleshooting**: Fixed Vite initialization issues during development.

### Manual Corrections
- Fine-tuned Bootstrap layout spacing and color themes.
- Verified local storage sync in AuthContext.

## Setup Instructions
### Prerequisites
- Node.js installed.

### Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Access at `http://localhost:5173`
