# Mini Chat Interface

A mini chat interface using the Mistral API. Built with Next.js, shadcn, and Tailwind CSS for the frontend, and using Next.js route handlers for the backend.

#### You can access it on [https://chat.okankoca.dev](https://chat.okankoca.dev)

---

## **Project Structure**

```
src/
├── app/                 # Main application logic
│   ├── api/             # Backend API routes (Next.js route handlers)
├── components/          # Components
│   ├── chat/            # Chat-specific components
│   ├── ui/              # ShadcnUI components
│   └── utils/           # Providers and shared logic
├── lib/                 # Utility functions and state management
├── public/              # Static assets
```

---

## Tech Stack and Frameworks

- **Frontend:**
  - Next.js
  - shadcn
  - Tailwind CSS
  - Zod
  - React Markdown
  - Jotai

- **Backend:**
  - Next.js API routes

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/nyzss/mistral-chat.git
    cd mini-chat-interface
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Add your mistral API key to a `.env` file:
    ```bash
    MISTRAL_API_KEY=your-api-key
    ```

4. Run the development server:
    ```bash
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000)
