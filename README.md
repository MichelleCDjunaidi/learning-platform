## **How to Setup and Run**

The project was developed on Windows.

### Pre-Requisites

- Node.js ≥ 18
- npm or yarn
- PostgreSQL installed and running
- Youtube API key (for security reasons I am not providing this in the repo)

### How to Setup the Backend

```
// ensure you are in learning-platform (aka the root folder)
cd backend
npm install
```

Create a .env file based on .env.example (please provide your own jwt secret and API key):

```
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/learning_app
JWT_SECRET=your_jwt_secret
YOUTUBE_API_KEY=your_youtube_api_key
```

Initialize the database locally:

```
CREATE DATABASE learning_app;
```

Then run

```
psql -U username -d learning_app -f ./db/schema.sql
```

Start the backend

```
npm run dev
```

Unless PORT on env is changed, backend will run on http://localhost:5000.

### How to Setup the Frontend

```
// ensure you are in learning-platform (aka the root folder)
cd frontend
npm install
```

Create a .env file based on .env.example:

```
VITE_API_URL=http://localhost:5000
```

Start the frontend

```
npm run dev
```

Frontend will run on http://localhost:5173.

## **Architecture Overview**

The learning platform is built as a Single Page Application (SPA) with a React frontend and Node.js + Express backend, connected to a PostgreSQL database. The system is designed to allow students to search for learning resources on Youtube, save them to their profile, and track their progress.

### Key Design Decisions

1. Backend (Node.js + Express)

RESTful API design for clear separation of resources and actions. Endpoints are named after their uses e.g. /api/auth, /api/external, /api/users with some API developed for future development. Authentication uses JWT with stateless session management for scalability.

2. Database (PostgreSQL)

Relational schema supports users, resources, and saved_resources.

3. Frontend (React + Vite)

Axios handles API requests and JWT-based authentication headers. State is managed locally with React hooks for search results, saved resources, and user session.

### System Flow

1. User Authentication

User registers or logs in via `/api/auth` endpoints. Server returns a JWT; frontend stores it in localStorage.

![screenshot](README_img/login.png)
![screenshot](README_img/login_success.png)

User can then go to dashboard.

2. Resource Discovery & Search

Users search external resources (in this case, YouTube) via /api/external/youtube. Backend fetches from YouTube, formats results, and returns JSON.

![screenshot](README_img/YT_search.png)

Users can also see current resources via /api/resources which queries the database.

![screenshot](README_img/list.png)

3. Saving Resources

If user finds a video they like, they can save it, triggering a POST request. Backend inserts the resource into the global resources table (if not already present) and links it to the user in saved_resources.

![screenshot](README_img/save_0.png)
![screenshot](README_img/save_1.png)

Users can also manually add content by putting in title and URL to the bar and clicking Create Resource, which allows other users to see the content.

## **Technology Choice**

Node.js + Express was used because full-stack JavaScript enables consistent language across frontend and backend. Express provides lightweight REST API routing and middleware support for authentication, logging, and CORS. Considered Flask but decided to go with PERN for simplicity.

PostgreSQL was used because it is scalable for future work and has relational structure fits well for users, resources, and saved_resources. MongoDB was considered as an alternative due to flexibility but ultimately it's harder to enforce relational constraints.

React (with Vite) was used due to maturity of ecosystem compared to Vue, with large ecosystem and community support for libraries like React Router and Axios. Future work can use components to simplify and standardize visual language, and can also pivot to Typescript for easier bug checks.

Youtube API was chosen as the external API to integrate due to prevalence of everyone using Youtube to learn nowadays, and the API's good documentation.

## **Integration Strategy with Youtube**

The user has to be logged in with a non-expired token to even search Youtube videos. If user login has expired, the user will be redirected to the login page. If the fetching fails e.g. due to quota limits, it will show an error to the user.

## **Critical Analysis**

The frontend works for core functionality like search for learning resources on Youtube, save them to their profile, and track content they like. The token allows users to keep their session for a determined amount of time. Hash is employed for user passwords so it's not stored in plaintext.

Database currently doesn't save YouTube thumbnails to cut down on storage costs and improve speed. As a result, the saved resources shows title and url but not thumbnail. However this is a tradeoff as a lot of students are visual learners, an improvement UX wise might be to store thumbnails.

List Resources currently shows crowdsourced resources e.g. what other students find useful will also be shown to current user.

Some APIs like the progress API is currently not utilized in the frontend, reserved for future development. Password currently has no validation or requirement imposed on it.

Error handling is currently implemented with try catch blocks. All implemented backend API has been tested with Postman even if not utilized in frontend e.g. the progress upsert.

![screenshot](README_img/postman.png)

Improvement would involve allowing students to be able to mark which content they have finished, and having a separate my content page leveraging the currently underutilized saved resources table. Also designing a more visually appealing frontend. The REST API to fetch resources currently uses ids; in the future, having a query mode to check titles would be more useful to frontend users. ChatGPT was used for development, and further leveraging LLMs for development would also be an improvement.
