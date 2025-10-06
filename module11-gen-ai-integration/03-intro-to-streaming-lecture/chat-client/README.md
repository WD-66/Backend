# AI Chatbot with OpenAI (chat completions) and React

## Goal

Create a React project with a chat-like interface that can preserve a chat's history by saving the unique `_id` in local storage.

## Requirements

- Submitting the form sends a `POST` request to the `ai/chat` endpoint of the AI simple server
- a `messages` state keeps track of the chat history, and renders chat UI
  - message UI should reflect if it's from the user or AI assistant
  - `messages` should be an array of objects that matches the structure that OpenAI stores the chat history
- a `chatId` state that defaults to the value of a local storage item named `chatId`
  - on page load, if `chatId` is a non-empty string, a `GET` request should be made to the `ai/history/:id` endpoint to get the full chat history, and update the `messages` state
  - submitting the form should set the `chatId` to local storage, and update the `chatId` state

## Instructions

### Set Up Your React Project

- Fork and clone this repo
- Create a `.env.local` file

  - set `VITE_AI_SERVER_URL` to `http://localhost:5050`

- Install dependencies by running `npm i`

- Familiarize yourself with the project starting point

### Chat UI Components

- conditionally render within the `ChatBubble` component based on if it was a user or AI message
- messages from AI should be on the left, and a different color, and the text should have Markdown formatting

### Handle Message sending

- add needed fetching logic to functions found in `data/ai.ts`, and import those functions where needed to call our AI server

### Manage Chat History

- update your `messages` state with every message sent and received from the AI assistant
- use an effect to fetch the chat history on page load if a `chatId` is found in local storage

### Test Your Application

- Ensure that sending messages works as expected.
