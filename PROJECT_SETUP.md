# noviMov - Movie Search & Collections

A modern Angular application for searching, displaying, and organizing movies into custom collections using the TMDB API.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- TMDB API Key (free account at https://www.themoviedb.org/settings/api)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. **Configure TMDB API Key:**
   
   Open `src/environments/environment.development.ts` and replace `YOUR_TMDB_API_KEY_HERE` with your actual TMDB API key:
   
   ```typescript
   export const environment = {
     production: false,
     tmdb: {
       apiKey: 'your_actual_api_key_here',
       baseUrl: 'https://api.themoviedb.org/3',
       imageBaseUrl: 'https://image.tmdb.org/t/p'
     }
   };
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser at `http://localhost:4200`

## 📋 Features Implemented

### ✅ Search Page (Home Page)

- **Search Input with Custom Validation**
  - Minimum 3 characters required
  - Only alphanumeric characters and spaces allowed
  - Custom Angular directive for validation (`AlphanumericDirective`)
  - Real-time validation feedback

- **Movie Results Display**
  - Paginated results
  - Each movie card shows:
    - Poster image
    - Title
    - Vote average (rating)
  - Clickable cards to navigate to movie details
  - Checkbox selection for adding to collections

- **Features**
  - Debounced search (500ms) to reduce API calls
  - Responsive grid layout
  - Loading states
  - Error handling
  - Smart pagination with ellipsis
  - Multi-select movies for collection management

## 🏗️ Project Structure

```
src/app/
├── components/
│   └── movie-card/              # Reusable movie card component
├── directives/
│   └── alphanumeric.directive.ts # Custom validation directive
├── models/
│   └── movie.model.ts            # TypeScript types
├── pages/
│   └── search-page/              # Search page component
├── services/
│   └── movie.service.ts          # TMDB API service
└── environments/                 # Environment configuration
```

## 🔧 Technologies Used

- **Angular 20** (Standalone Components)
- **Angular Material** (UI Components & Theming)
- **TypeScript** (Strict mode)
- **RxJS** (Reactive programming)
- **Signals** (State management)
- **SCSS** (Styling)
- **TMDB API** (Movie data)

## 🎨 UI Components

The application uses Angular Material components for a modern, consistent UI:

- **Form Fields & Input** - Material form controls with validation
- **Buttons** - Raised and flat Material buttons
- **Cards** - Movie cards with Material card component
- **Checkboxes** - Material checkboxes for movie selection
- **Icons** - Material Design icons
- **Progress Spinner** - Loading indicators
- **Chips** - Selection count display

### Material Theme

The app uses a custom Material theme with:
- Primary color: Indigo
- Accent color: Pink
- Pre-built Material typography
- Responsive Material components

## 📝 Development Approach

- ✅ Standalone components (no NgModules)
- ✅ Signal-based state management
- ✅ OnPush change detection strategy
- ✅ Type-safe API calls
- ✅ Reactive forms with custom directives
- ✅ Lazy loading routes
- ✅ Modern Angular practices (input/output functions, computed signals)

## 🎯 Next Steps

The following features are planned for future development:

1. **Movie Details Page**
   - Modal/popup display
   - Detailed movie information
   - User rating functionality
   - Guest session management

2. **Collections Management**
   - Create/edit/delete collections
   - Add movies to collections
   - View collection contents
   - Local storage persistence

## 📄 License

This project is for educational purposes.
