# Zoho EOD App

Zoho EOD App is a NestJS service for managing Zoho Projects time logs, creating tasks, and generating/sending status emails through Gmail.

It exposes a small REST API under `api/v1` and publishes Swagger docs for the available endpoints.

## Features

- Fetch Zoho Projects time logs for a portal, project, and date range.
- Create time logs against tasks.
- Create tasks in Zoho Projects.
- Generate HTML status emails from a Handlebars template.
- Send email through Gmail using a service account OAuth flow.

## Tech Stack

- NestJS
- TypeScript
- Zoho Projects API
- Google APIs / Nodemailer
- Handlebars
- Swagger

## Requirements

- Node.js 18+
- npm
- Access to Zoho Projects API credentials
- Access to Gmail OAuth / service account credentials

## Setup

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root with the values required by the app:

```env
PORT=3000
NODE_ENV=DEV
ZOHO_CLIENT_ID=YOUR_ZOHO_CLIENT_ID
ZOHO_CLIENT_SECRET=YOUR_ZOHO_CLIENT_SECRET
ZOHO_REFRESH_TOKEN=YOUR_ZOHO_REFRESH_TOKEN
ZOHO_AUTH_URL=https://accounts.zoho.in
ZOHO_PROJECT_API_BASE_URL=https://projectsapi.zoho.in/api/v3/
GOOGLE_EMAIL=YOUR_GOOGLE_EMAIL
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN=YOUR_GOOGLE_REFRESH_TOKEN
GOOGLE_OAUTH_API=https://developers.google.com/oauthplayground
```


## Run

```bash
# development
npm run start:dev

# production build
npm run build
npm run start:prod
```

## API

The application listens under the global prefix `api/v1`.

Swagger UI is available at:

```text
/api/doc
```

### Track endpoints

Base path: `/api/v1/track`

- `POST /task/time-log` - create task time logs in Zoho Projects
- `GET /task/time-log` - fetch project time logs by user and date range
- `POST /send-status-mail` - generate and send a status email
- `POST /task` - create tasks in Zoho Projects
- `GET /log-send` - fetch logs and send the generated email

## Template Rendering

Status emails are rendered from the Handlebars template at:

```text
src/utils/templates/status-update.hbs
```

The template is copied into `dist/utils/templates` during build so the compiled app can load it at runtime.

## Build

```bash
npm run build
```

## Tests

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Notes

- Responses are wrapped by a global interceptor.
- Validation is enabled globally with Nest's `ValidationPipe`.
- The app uses cached Zoho access tokens and refreshes them when needed.
