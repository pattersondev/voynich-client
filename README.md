# Voynich - Secure Ephemeral Messaging

Voynich is a private, secure, and ephemeral messaging application built with [Next.js](https://nextjs.org). It allows users to create temporary, encrypted chat rooms that automatically delete all data after a set period.

## Features

- **Secure Encryption**: All chat contents are securely encrypted, ensuring privacy and confidentiality.
- **Ephemeral Chats**: Users can set a specific time period for the chat to remain active before all data is permanently deleted.
- **Link-Based Access**: Chat rooms are accessible only through unique, generated links.
- **Time-Limited Access**: Once the set time period expires, the chat and all its contents become inaccessible.

## How It Works

1. Users generate a secure chat link with a specified expiration time (e.g., 1 hour, 24 hours, 1 week, or 1 month).
2. The generated link can be shared with intended participants.
3. Participants can join the chat using the link while it's active.
4. All messages and file attachments in the chat are end-to-end encrypted.
5. Once the set time period expires, the chat and all its data are permanently deleted from the server.

## Security

- The contents of the chat are impossible to access without the chat link while it is live.
- Even with server access, the encrypted nature of the messages ensures that they remain unreadable.
- After expiration, all data is securely wiped from the system.

## Backend Code and Security Verification

To verify the security implementation and review the backend code, please visit our backend repository:

[https://github.com/pattersondev/voynich-backend](https://github.com/pattersondev/voynich-backend)

We encourage users and security researchers to review our backend code to ensure transparency and validate our security measures.

## Getting Started

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
