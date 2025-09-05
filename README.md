# YouTube Comments Analyzer 🚀

A beautiful, comprehensive web application that fetches comments from YouTube videos and categorizes them into Questions, Jokes, and Discussions with advanced analytics and search capabilities. Features a stunning YouTube-themed design with gradients and modern UI elements.

## ✨ Features

- **Real-time Comment Analysis**: Fetch comments directly from YouTube videos using the YouTube Data API
- **Smart Categorization**: Automatically categorize comments into Questions, Jokes, and Discussions
- **Advanced Search**: Fast prefix-based search using Trie data structure implementation
- **Word Analytics**: Top word extraction with frequency analysis
- **Interactive Data Visualization**: Beautiful charts with YouTube-themed colors showing comment distribution and trends
- **Modern YouTube-Themed UI**: Stunning gradients, animations, and responsive design inspired by YouTube's brand
- **Real-time Progress**: Live progress indicators with smooth animations
- **Export Functionality**: Export analysis results for further use
- **Dark Mode Support**: Seamless dark/light theme switching

## 🎨 Design Features

- **YouTube Brand Colors**: Authentic red gradients (#FF0000) throughout the interface
- **Gradient Backgrounds**: Beautiful card gradients and animated elements
- **Glassmorphism Effects**: Modern frosted glass effects and backdrop blur
- **Micro-interactions**: Smooth hover effects, button animations, and loading states
- **Responsive Layout**: Perfect on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Radix UI** components for professional UI
- **TanStack Query** for state management
- **Wouter** for client-side routing

### Backend
- **Express.js** with TypeScript
- **YouTube Data API v3** integration
- **Zod** for data validation
- **In-memory storage** for fast data access

### Data Structures
- **Trie**: Fast prefix-based comment search
- **Hash Maps**: Word frequency counting
- **Arrays**: Comment storage and categorization

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- YouTube Data API v3 key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/youtube-comments-analyzer.git
cd youtube-comments-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```
YOUTUBE_API_KEY=your_youtube_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

1. **Enter YouTube URL**: Paste any YouTube video URL into the input field
2. **Start Analysis**: Click "Analyze Comments" to begin fetching and processing
3. **View Results**: 
   - See categorized comments (Questions, Jokes, Discussions)
   - View analytics charts and statistics
   - Browse top words and their frequencies
4. **Search Comments**: Use the search bar for fast prefix-based comment lookup
5. **Filter & Sort**: Apply filters and sorting options to refine results

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Express backend
│   ├── services/          # Business logic services
│   │   ├── youtube.ts     # YouTube API integration
│   │   ├── analyzer.ts    # Comment analysis logic
│   │   └── trie.ts        # Trie data structure implementation
│   ├── routes.ts          # API route definitions
│   └── storage.ts         # Data storage interface
├── shared/                # Shared types and schemas
└── package.json
```

## API Endpoints

- `POST /api/analyze` - Analyze YouTube video comments
- `GET /api/search` - Search comments with filters

## Data Structures Implementation

### Trie Search
- **Purpose**: Fast prefix-based comment search
- **Performance**: O(m) search time where m is the length of the search term
- **Features**: Case-insensitive search, partial word matching

### Comment Categorization
- **Questions**: Detected using question words and punctuation patterns
- **Jokes**: Identified through humor indicators and emotional expressions
- **Discussions**: General conversation and opinion-based comments

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- YouTube Data API v3 for comment data
- React and Express.js communities
- All open-source libraries used in this project