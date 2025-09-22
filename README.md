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
