# YOLO Travel Planning Application

## Overview

YOLO is a comprehensive travel planning web application built with React (frontend) and Express.js (backend). The application provides AI-powered travel recommendations, budget management, user reviews, and customer support features. It's designed as a full-stack TypeScript application with a modern UI built using shadcn/ui components and Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful APIs with JSON responses
- **Schema Validation**: Zod for runtime type checking
- **Development**: Hot reload with tsx

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions and configurations
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data access layer
│   └── db.ts              # Database configuration
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts          # Database schema and validation
└── attached_assets/        # Static HTML mockups
```

## Key Components

### Frontend Components
1. **Travel Style Selector**: Interactive component for choosing travel preferences (healing, food, adventure, culture, nature, shopping)
2. **Budget Calculator**: Real-time budget planning with category breakdown and visual progress indicators
3. **Review System**: User review display and submission with star ratings
4. **FAQ Accordion**: Expandable FAQ sections with category filtering
5. **Hero Section**: Landing page with travel style selection and call-to-action

### Backend Services
1. **Trip Management**: CRUD operations for travel plans with AI-generated itineraries
2. **Budget Management**: Financial planning and tracking capabilities
3. **Review System**: User-generated content management
4. **FAQ System**: Knowledge base management
5. **Inquiry System**: Customer support ticket management

### Database Schema
- **Users**: User authentication and profiles
- **Trips**: Travel plans with destinations, dates, and preferences
- **Budgets**: Financial planning linked to trips
- **Reviews**: User feedback and ratings
- **FAQs**: Frequently asked questions with categories
- **Inquiries**: Customer support requests

## Data Flow

1. **User Input**: Users interact with forms and selectors to input travel preferences
2. **Validation**: Client-side validation using Zod schemas, server-side validation on API endpoints
3. **API Communication**: TanStack Query manages API calls with automatic caching and error handling
4. **Database Operations**: Drizzle ORM handles database queries with type safety
5. **UI Updates**: React components automatically re-render based on query state changes

## External Dependencies

### Frontend Dependencies
- **UI Components**: Extensive Radix UI component library for accessibility
- **State Management**: TanStack Query for server state synchronization
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx and tailwind-merge for conditional styling

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL with connection pooling
- **ORM**: Drizzle with schema validation and migrations
- **Validation**: Zod for runtime type checking and API validation
- **Development**: tsx for TypeScript execution and hot reload

### Development Tools
- **TypeScript**: Full type safety across the entire stack
- **ESBuild**: Fast bundling for production builds
- **Replit Integration**: Development environment with runtime error overlay
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## Deployment Strategy

### Development
- Frontend served by Vite development server with HMR
- Backend runs with tsx for TypeScript execution and automatic restarts
- Database migrations handled by Drizzle Kit
- Environment variables for database connections

### Production
- Frontend built with Vite and served as static files
- Backend bundled with ESBuild for optimized Node.js execution
- Database schema managed through Drizzle migrations
- Environment-based configuration for different deployment stages

### Build Process
1. Frontend: `vite build` creates optimized static assets
2. Backend: `esbuild` bundles server code for production
3. Database: `drizzle-kit push` applies schema changes
4. The application serves frontend assets from the Express server in production

## Changelog
- June 28, 2025. Initial setup
- June 28, 2025. GitHub Pages 배포용 정적 버전 변환 완료
  - 백엔드 의존성 제거, localStorage 기반 데이터 저장
  - 자동 배포 GitHub Actions 워크플로 추가
  - 압축 파일 및 배포 가이드 제공

## User Preferences

Preferred communication style: Simple, everyday language.