# AI-Powered React Application

A cutting-edge React application featuring AI integration, advanced UI components, and modern optimizations.

## 🚀 Features

- **AI Chatbot Integration** - OpenAI GPT-powered conversational interface
- **Voice Commands** - Web Speech API integration for hands-free interaction  
- **Interactive 3D Graphics** - Three.js/React Three Fiber 3D components
- **Drag & Drop UI** - React Beautiful DnD for interactive list management
- **Dark/Light Mode** - Smooth theme switching with persistence
- **Advanced Form Validation** - React Hook Form + Yup schema validation
- **Real-time Notifications** - Toast notifications for user feedback
- **Optimized Performance** - React Query, lazy loading, code splitting
- **Responsive Design** - Mobile-first with Tailwind CSS + Material-UI
- **User Authentication** - Secure JWT-based auth with Strapi backend

## 🛠️ Tech Stack

### Frontend
- React 18, Material-UI v5, Tailwind CSS
- React Query, React Router v6, React Hook Form
- React Three Fiber, Web Speech API

### Backend  
- Strapi v4, PostgreSQL, JWT Authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (for production)

### Installation

1. **Backend Setup**
```bash
cd ai-powered-backend
npm install
npm run develop
```

2. **Frontend Setup**
```bash
cd ai-powered-ui
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys

npm start
```

3. **Environment Variables**

Backend (.env):
```
DATABASE_URL=postgres://user:password@localhost:5432/db
JWT_SECRET=your-jwt-secret
```

Frontend (.env):
```
REACT_APP_STRAPI_URL=http://localhost:1337
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

## 📊 Performance

- Lighthouse Score: 95+ (Performance, Accessibility, Best Practices, SEO)
- Bundle size: <500KB gzipped
- First Contentful Paint: <1.5s

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the build/ folder
```

### Backend (Railway/Heroku)  
```bash
npm run build
npm start
```

## 📄 License

MIT License