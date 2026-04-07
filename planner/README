# DayAgent — AI-Powered Daily Planner

A daily planning application powered by an AI agent that manages your tasks and sends Gmail briefings — all secured through Auth0 Token Vault.

## What it does

DayAgent lets you log in securely with Google via Auth0 and interact with an AI agent that can:

- **Add tasks to your list** — just tell the agent what to add and it appears instantly
- **Send daily briefing emails** — the agent composes and delivers a personalized summary to your Gmail
- **Suggest tasks and habits** — get AI-powered planning recommendations based on your day
- **Manage your task list** — check off, delete, and organize tasks manually or via the agent

## How Auth0 Token Vault is used

Auth0 Token Vault is the core security layer that allows the AI agent to act on the user's behalf without ever exposing raw credentials. When a user authenticates with Google via Auth0, Token Vault securely manages the OAuth tokens required to call the Gmail API. The agent only gains access to the specific scopes it needs (`gmail.send`) — nothing more. This demonstrates the principle of least privilege for AI agents operating on behalf of users.

## Tech stack

- **Frontend:** React
- **Authentication:** Auth0 (Google OAuth2 via Token Vault)
- **AI Agent:** Groq (Llama 3.3 70B)
- **Email:** Gmail API via Auth0 Token Vault 

## Running locally

### 1. Clone the repo and install dependencies

```bash
git clone <your-repo-url>
cd planner
npm install
```

### 2. Set up environment variables

Create a `.env` file in the `planner/` directory:

```
REACT_APP_AUTH0_DOMAIN=dev-2gdq7mp53jmaw3oh.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=q4slfgFT9lMgKwuT5gRgfbDFsD6lXtVs
REACT_APP_TOKEN_VAULT_CONNECTION=google-oauth2
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

Get a free Groq API key at: https://console.groq.com

### 3. Auth0 setup

In your Auth0 dashboard under your application settings, add the following URLs:

- **Allowed Callback URLs:** `http://localhost:3000`
- **Allowed Logout URLs:** `http://localhost:3000`
- **Allowed Web Origins:** `http://localhost:3000`

Make sure Google is enabled as a social connection under **Authentication → Social** with the `https://www.googleapis.com/auth/gmail.send` scope.

### 4. Run the app

```bash
npm start
```

App runs at `http://localhost:3000`. Sign in with Google to enable Gmail features.

## Usage

Once logged in:

- Type tasks manually in the task input or ask the agent to add them
- Click the quick action buttons in the agent panel to send a briefing or get suggestions
- Ask the agent anything — "add a task: review my notes", "send me a summary", "suggest 3 things I should do today" 
- Agent-added tasks appear with a green `· agent` badge 

## Project structure

```
planner/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AgentPanel.js   # ai chat bot 
│   │   ├── LoginPage.js    # login with Auth0
│   │   ├── Planner.js      # Main dashboard + shared task state
│   │   └── TaskList.js     # Task manager UI
│   ├── App.js              # Auth routing
│   ├── index.css           # Global styles
│   └── index.js            # Auth0Provider setup
├── .env                    # secrets (not committed)
├── .gitignore
└── package.json
```

