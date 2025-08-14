# Overview

This is a YouTube Comments Analyzer web application that fetches comments from YouTube videos and categorizes them into questions, jokes, and discussions. The application provides analytics, search functionality, and data visualization features to help users understand comment patterns and engagement on YouTube videos.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript using Vite as the build tool. It follows a component-based architecture with:
- **UI Framework**: Radix UI components with shadcn/ui for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite with TypeScript support

## Backend Architecture
The server is built with Express.js and follows a service-oriented architecture:
- **Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL schema definitions
- **Storage**: Currently uses in-memory storage (MemStorage) with interface for future database integration
- **Services**: Modular services for YouTube API integration, comment analysis, and search functionality
- **Data Structures**: Trie data structure for fast comment search capabilities

## Data Processing Pipeline
1. **Video Analysis**: Accepts YouTube URLs and extracts video IDs
2. **Comment Fetching**: Integrates with YouTube Data API to retrieve comments
3. **Comment Categorization**: Uses keyword-based analysis to classify comments as questions, jokes, or discussions
4. **Text Analysis**: Generates word frequency analysis and removes stop words
5. **Search Indexing**: Builds Trie structures for fast prefix-based comment search

## Database Schema
- **Videos Table**: Stores video metadata (title, channel, views, etc.)
- **Comments Table**: Stores individual comments with categorization
- **Analyses Table**: Stores aggregated analytics data per video

## API Design
RESTful API with endpoints for:
- `/api/analyze` - Analyzes YouTube videos and returns categorized comments
- `/api/search` - Searches comments with filtering and pagination

# External Dependencies

## Core Technologies
- **Neon Database**: PostgreSQL database provider configured via DATABASE_URL
- **YouTube Data API**: For fetching video metadata and comments (service implemented but API key configuration needed)
- **Radix UI**: Comprehensive component library for accessible UI elements
- **TanStack Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL dialect

## Development Tools
- **Vite**: Build tool with React plugin and development server
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework
- **Replit Integration**: Development environment plugins for runtime error handling and cartographer

## Third-Party Services
- **Replit Hosting**: Configured for Replit deployment environment
- **Font Integration**: Google Fonts (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)

## Data Processing Libraries
- **Zod**: Schema validation for API requests and responses
- **Date-fns**: Date manipulation utilities
- **Class Variance Authority**: Component variant management
- **Recharts**: Chart and visualization library