# COS 498 MidTerm Forum

A modern web forum application built with Node.js, Express, Handlebars, and styled with custom CSS. The application is containerized using Docker and served through an Nginx reverse proxy.

## Features

- **User Authentication**: Login and registration system with session management
- **Forum Posts**: Create, view, and manage forum discussions
- **Responsive Design**: Mobile-friendly interface with modern styling
- **Categories**: Organize posts by different categories
- **Real-time Updates**: View recent activity and discussions
- **Containerized**: Docker-based deployment for easy setup

## Tech Stack

- **Backend**: Node.js with Express.js framework
- **Templating**: Handlebars (HBS) for server-side rendering
- **Styling**: Custom CSS with responsive design
- **Session Management**: Express-session with cookie-parser
- **Reverse Proxy**: Nginx for load balancing and static file serving
- **Containerization**: Docker and Docker Compose

## Project Structure

```
COS_498_MidTerm_Forum/
├── docker-compose.yml          # Docker services configuration
├── nginx/
│   ├── Dockerfile             # Nginx container setup
│   ├── default.conf           # Nginx configuration
│   └── public/
│       └── index.html         # Static landing page
├── nodejs/
│   ├── Dockerfile             # Node.js container setup
│   ├── package.json           # Node.js dependencies
│   ├── server.js              # Main application server
│   ├── public/
│   │   └── style.css          # Main stylesheet
│   └── views/
│       ├── home.hbs           # Homepage template
│       ├── login.hbs          # Login page template
│       ├── register.hbs       # Registration page template
│       ├── comments.hbs       # Forum posts listing
│       ├── new-comment.hbs    # New post creation form
│       └── partials/
│           ├── header.hbs     # Navigation header
│           └── footer.hbs     # Footer component
└── README.md                  # This file
```

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/R-Cotroneo/COS_498_MidTerm_Forum.git
   cd COS_498_MidTerm_Forum
   ```

2. **Start the application:**
   ```bash
   docker compose up --build -d
   ```

   This command will:
   - Build the Docker images for both services
   - Start the Node.js backend server
   - Start the Nginx reverse proxy
   - Set up the internal network communication

3. **Access the application:**
   
   Open your web browser and navigate to:
   ```
   https://raistcotroneo.com
   ```

   The forum should now be accessible and fully functional!

## Usage

### Navigation

- **Home Page** (`/`): Welcome page with recent activity
- **All Posts** (`/comments`): View all forum discussions
- **Login** (`/login`): User authentication
- **Register** (`/register`): Create new user account
- **New Post** (`/new-comment`): Create forum posts (requires login)

### User Features

1. **Registration**: Create an account with username, email, and password
2. **Login**: Authenticate with username/email and password
3. **Post Creation**: Write new forum posts with titles and content
4. **Browse Posts**: View all discussions with sorting options
5. **Categories**: Organize posts by topic categories

## Configuration

### Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: Set to `production` in containers
- `PORT`: Internal port for Node.js server (default: 74)

### Ports

- **External Access**: Port 80 (HTTP)
- **Internal Node.js**: Port 74
- **Nginx**: Port 80 (container)

## Docker Services

### Backend (Node.js)
- **Container**: `backend-nodejs`
- **Build Context**: `./nodejs`
- **Internal Port**: 74
- **Features**: Express server, Handlebars templating, session management

### Frontend Proxy (Nginx)
- **Container**: `my-nginx-proxy`
- **Build Context**: `./nginx`
- **External Port**: 80
- **Features**: Reverse proxy, static file serving, load balancing

## Styling

The application uses custom CSS with:
- Modern, clean design
- Responsive layout for mobile and desktop
- Professional color scheme (blue and dark gray theme)
- Form styling and interactive elements
- Consistent typography and spacing

## Session Management

The application implements session-based authentication:
- Sessions stored in memory (development)
- Secure cookie handling
- Automatic session cleanup on logout
- Session persistence across page visits

## API Endpoints

- `GET /` - Homepage
- `GET /login` - Login page
- `POST /login` - Process login
- `GET /register` - Registration page  
- `POST /register` - Process registration
- `GET /comments` - Forum posts listing
- `GET /new-comment` - New post form
- `POST /new-comment` - Create new post
- `GET /logout` - User logout
- `GET /health` - Health check endpoint

## Dependencies

### Node.js Dependencies
- `express`: Web framework
- `hbs`: Handlebars templating engine
- `express-session`: Session management
- `cookie-parser`: Cookie parsing middleware

### System Dependencies
- Docker
- Docker Compose
- Nginx (containerized)
- Node.js 18+ (containerized)
