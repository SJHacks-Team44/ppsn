# Predictive Personal Safety Network (PPSN)

A community-powered and AI-driven web platform that predicts when and where you might be unsafe before it happens, and guides you in real time to avoid danger.

## Project Overview

Our PPSN aims to revolutionize personal safety by:

- Creating predictive danger zones based on various data sources
- Suggesting personalized safety routing
- Automating safety check-ins with family and friends
- Providing real-time incident pre-alerts
- Enabling anonymous crowd reporting
- Future extension: Augmented Reality navigation mode

## Tech Stack

- **Frontend**: React.js + Mapbox + Web Push Notifications
- **Backend**: Express.js + MongoDB
- **Real-time Data**: Firebase or WebSocket

## Project Timeline

We have ~13 hours to implement a basic version of this system. This is how we'll break it down:

## Team Workload Distribution

### Team Member 1: Frontend & Map Integration

- Setup React project scaffold and core components (2 hours)
- Implement map visualization with Mapbox (3 hours)
- Create safety routing UI components (2 hours)
- Implement user profile and preferences UI (2 hours)
- Integration with backend APIs (3 hours)
- Testing & bug fixes (1 hour)

**Key deliverables:**

- Working map interface
- Route visualization
- User settings page
- Danger zone visualization

### Team Member 2: Backend & API Development

- Set up Express server and project structure (1 hour)
- Create MongoDB models and database connections (2 hours)
- Implement user authentication (2 hours)
- Develop API endpoints for safety data (3 hours)
- Create route calculation logic (3 hours)
- Testing & documentation (2 hours)

**Key deliverables:**

- Working REST API
- User authentication system
- Database models
- Route calculation algorithms

### Team Member 3: AI & Prediction Logic, Real-time Features

- Develop basic prediction algorithm (3 hours)
- Implement real-time notification system (2 hours)
- Create check-in automation logic (2 hours)
- Set up anonymous reporting functionality (2 hours)
- Integrate external data sources (crime APIs, etc.) (2 hours)
- Testing & optimization (2 hours)

**Key deliverables:**

- Prediction algorithm
- Real-time notification system
- Check-in automation
- Anonymous reporting system

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Mapbox API key
- Firebase account (optional, for real-time features)

### Installation

1. Clone this repository

```bash
git clone https://github.com/your-username/ppsn-project.git
cd ppsn-project
```

2. Set up frontend

```bash
cd frontend
npm install
cp .env.example .env  # Update with your API keys
npm start
```

3. Set up backend

```bash
cd backend
npm install
cp .env.example .env  # Update with your database credentials
npm start
```

## Project Structure

```
ppsn-project/
│
├── frontend/                # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   └── package.json
│
├── backend/                 # Express backend application
│   ├── api/                 # API routes
│   ├── models/              # Data models
│   ├── utils/               # Utility functions
│   ├── server.js            # Server entry point
│   └── package.json
│
└── README.md                # Project documentation
```

## MVP Features (13-Hour Goal)

For our limited time, we'll focus on implementing:

1. Basic map visualization with dummy "danger zones"
2. Simple route calculation (safest, not fastest)
3. User profiles with mock safety preferences
4. Rudimentary prediction algorithm based on time of day and location
5. Basic anonymous reporting system

## Stretch Goals (If Time Permits)

1. Real-time notifications
2. Check-in automation
3. Integration with a real crime data API
4. Basic mobile responsiveness

## Communication & Collaboration

- Use GitHub for version control and issue tracking
- Regular check-ins every 3 hours to assess progress
- Use Discord for real-time communication
- Share API documentation as we develop endpoints

## Next Steps (Beyond 13 Hours)

- Improving prediction algorithms with machine learning
- Adding the AR mode feature
- Improving mobile experience
- Adding real-time data from more sources
- User testing and feedback cycles

---

Built with ❤️ by Team 44
