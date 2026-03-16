# 🎫 AI-Powered Ticketing System

> **Intelligent, Semantic, and Automated Ticket Routing.** 🚀

A modern support platform that uses **Google Gemini AI** and **Vector Search** to automatically categorize tickets and assign them to the best-matched expert based on their specific skills.

---

## ✨ Key Features

- **🤖 AI Ticket Classification**: Automatically determines department (Billing, Tech, Features) and priority levels via semantic analysis.
- **🎯 Semantic Expertise Matching**: Matches the *meaning* of a user's problem to the *meaning* of an agent's expertise using `pgvector` similarity search.
- **⚡ Heuristic Fallback**: A robust, zero-latency keyword engine ensures tickets are always categorized, even during AI quota limits.
- **📊 Mission Control Dashboard**: Real-time stats, ticket feeds, and expertise settings for support agents.
- **🔐 Enterprise-Grade Security**: Secure server-to-server communication using Supabase Service Role keys.

---

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

---

## 🧠 The Intelligent Workflow

The system uses a **Hybrid Automation Engine** to manage tickets. This ensures tickets are never lost, even if AI services are hitting quota limits.

### 1. The Heuristic Router (Instant & Free)
When a ticket is created, it's first processed by a local regex-based engine. This handles:
- **Keyword Detection**: Automatically maps terms like "refund" or "invoice" to the **Billing** department.
- **Urgency Scoring**: Detects power words (e.g., "ASAP", "Emergency") to set the **Priority** to `urgent`.

### 2. Semantic Embedding (Google Gemini)
The ticket description is vectorized into a **768-dimensional space**. This captures the *intent* beyond just keywords.
- **Model**: `gemini-embedding-001`
- **Why?**: This allows the system to realize that *"My login is failing"* (the ticket) matches an agent expert in *"Authentication and JWT protocols"* (the profile).

### 3. Vector Similarity Matching (PostgreSQL + pgvector)
We use the **Cosine Similarity** algorithm inside Supabase to find the best expert.
```sql
-- The logic behind the match:
1 - (agent_embedding <=> ticket_embedding) AS similarity
```
The system filters by the identified department first, then picks the agent with the highest similarity score and the lowest current ticket load.

---

## 🏗️ Technical Architecture

### Data Flow
1.  **User Submission**: Form triggers a server action.
2.  **Edge Function Trigger**: `assign-ticket` is called.
3.  **Local Heuristics**: Department/Priority identified.
4.  **AI Generation**: Semantic embedding generated via Gemini REST API.
5.  **Database RPC**: `match_agents` is called to perform vector search.
6.  **Real-time Update**: Ticket is assigned; status changes to `open`.

### Project Structure
- `📁 app/dashboard`: Next.js pages and server actions.
- `📁 supabase/functions`: Deno-based serverless functions for AI tasks.
- `📁 utils/supabase`: Optimized clients (Client, Server, and Service-Role).
- `📄 migration_ai_assignment.sql`: Database schema and vector math functions.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed and linked.
- [Node.js 18+](https://nodejs.org/).
- A Google Cloud API Key with **Generative Language API** enabled.

### 2. Environment Setup
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
```

### 3. Database & Functions
Run the migrations and deploy the logic:
```bash
# Apply SQL changes
# (Run migration_ai_assignment.sql in Supabase SQL Editor)

# Set Gemini Secrets
supabase secrets set GEMINI_API_KEY=your_key

# Deploy Workers
supabase functions deploy assign-ticket
supabase functions deploy embed-agent
```

### 5. Start Development
```bash
npm install
npm run dev
```

---

## 📄 Documentation
For a deep dive into the technical details, see the [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md).

---

*Built with ❤️ for a smarter support experience.*
