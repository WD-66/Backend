# Travel Journal Gen AI Integration

## Setup

- use template repo to make a repo under your GitHub account
- Clone into your computer
- `npm i` to install dependencies (all 4 directories)
- create a `.env.development.local` for each directory:

### spa

- The results of the React Chatbot w/ streaming have been integrated, and related components can be found in `src/components/Chat`
- `ChatBtn` is being rendered in `RootLayout`, has a boolean state to toggle whether the chat is open
- `ChatWindow` contains most of the code that was found in `App.tsx` when the chatbot was a stand-alone project. Some styling has been changed to make it look (slightly) better in it's new context

```yaml
VITE_APP_TRAVEL_JOURNAL_API_URL=http://localhost:8000
VITE_APP_AUTH_SERVER_URL=http://localhost:3000/auth
VITE_AI_SERVER_URL=http://localhost:5050
```

### auth-server

```yaml
MONGO_URI=<same_mongodb_connection_string_for_all_servers>
DB_NAME=travel-journal
ACCESS_JWT_SECRET=<same_secret_for_all_servers>
CLIENT_BASE_URL=http://localhost:5173
```

### api

```yaml
MONGO_URI=<same_mongodb_connection_string_for_all_servers>
ACCESS_JWT_SECRET=<same_secret_for_all_servers>
CLIENT_BASE_URL=http://localhost:5173
```

### ai-server

- `cors` has been updated so we can send cookies in our request

```yaml
AI_API_KEY=<your_api_key>
AI_MODEL=gemini-2.0-flash # if using gemini
# AI_MODEL=llama3.1:8b # if using local LLM
AI_URL=https://generativelanguage.googleapis.com/v1beta/openai/ # if using gemini
MONGO_URI=<same_mongodb_connection_string_for_all_servers>
ACCESS_JWT_SECRET=<same_secret_for_all_servers>
CLIENT_BASE_URL=http://localhost:5173
```

## Instructions

- Your task is to finish integrating the Gen AI Chatbot for the Travel Journal. Currently, the chat behaves the same, whether or not a user is logged in. When a user logs in, we want to hit the new endpoint that we made for tool calling to get personalized results. You will need to:

### Create fetch request function to our new `/agent` endpoint

- Inside of `src/data/ai.ts` create 2 new functions
  - `fetchPersonalChat`
  - `createPersonalChat`
    that will make a fetch request to the `/agent` endpoint. Use `fetchChat` and `createChat` as a reference

### Make requests to the `/agent` endpoint when a user is signed in

- Inside of `src/components/Chat/ChatForm.tsx`, you will need to import your new functions
- You will then need to check if a user is `signedIn` (hint: you will get this by consuming the `AuthContext`)
- Inside of handle submit if `signedIn` is `true` save the response from calling `fetchPersonalChat` (if `isStream` is `true`) or `createPersonalChat` (if `isStream` is `false`).
- If `signedIn` is false, save the response from `fetchChat` and `createChat` respectively

### Filter out `assistant` messages without content

- Inside of `Chat.tsx`, we are currently filtering messages to only include role of `assistant` and `user`. Some `assistant` messages initiate tool calls, and don't have any content. Filter those messages out as well

### Final polishes

- Test the endpoint both signed in/ signed out, and with streaming true/false. Double check everything is working, and see if you can refine the system prompts for better results. (You can have an AI Chatbot write some dummy posts to see if the recommendations are working)
