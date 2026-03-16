# AI-Enhanced Ticketing System: Technical Architecture & Workflow

This document provides a deep dive into the architecture, logic, and AI integration of the Ticketing System.

---

## 🚀 High-Level Architecture

The system is a modern full-stack application built for scalability and intelligent automation.

- **Frontend**: [Next.js](https://nextjs.org/) (App Router) - Provides a high-performance, reactive UI.
- **Backend-as-a-Service**: [Supabase](https://supabase.com/) - Handles authentication, real-time database, and serverless Edge Functions.
- **AI Infrastructure**: [Google Gemini](https://ai.google.dev/) - Powers the semantic search and classification engine.
- **Database Search**: [pgvector](https://github.com/pgvector/pgvector) - A PostgreSQL extension used to store and query high-dimensional vector embeddings.

---

## 🧠 The AI matching Workflow

The most critical part of this project is the **Hybrid AI Assignment Logic**. We moved away from simple "Round Robin" to a "Skills-to-Needs" matching system.

### 1. Agent Expertise Vectorization
When an agent describes their skills (e.g., *"I can fix broken Stripe webhooks"*), the `embed-agent` Edge Function:
1.  Takes the text.
2.  Calls Gemini's `gemini-embedding-001` model.
3.  Receives a **768-dimensional vector** (a numeric representation of the *meaning* of that text).
4.  Stores this vector in the `profiles.expertise_embedding` column.

### 2. Automated Ticket Lifecycle
When a customer submits a ticket with just a **Title** and **Description**, the `assign-ticket` Edge Function kicks in:

#### **Stage A: Heuristic Classification (The "Speed" Layer)**
To avoid hitting AI quota limits and ensure maximum reliability, we use a local **Heuristic Engine**:
- **Department Detection**: Uses regex to instantly categorize tickets (e.g., "refund" -> *Billing*, "bug" -> *Technical Support*).
- **Priority Detection**: Scans for urgency markers (e.g., "ASAP", "Urgent", "Critical").
- **Result**: The ticket is categorized in **0ms** without any external API calls.

#### **Stage B: Semantic Embedding**
The ticket content is vectorized by Gemini. This gives us a mathematical representation of the user's *intent*.

#### **Stage C: Vector Similarity Search**
The system executes a custom PostgreSQL function: `match_agents`. This function:
1.  Filters agents by the **Department** identified in Stage A.
2.  Calculates the **Cosine Distance** between the Ticket's vector and the Agent's Expertise vector.
3.  Factors in **Current Workload** (assigns to the agent with fewer open tickets if similarities are tied).
4.  **Result**: The ticket is assigned to the "Closest" expert.

---

## 🔐 Security & Communication

### Service Role Client
To allow the Next.js server to trigger administrative actions (like Edge Functions) without being blocked by user permissions, we implemented a **Service Role Client** ([service-role.ts](file:///d:/ticketing-system/utils/supabase/service-role.ts)). This ensures:
- The server has "God Mode" permissions for internal logic.
- Sensitive keys are never exposed to the frontend browser.

### Robust Error Handling
The system is built to be "Self-Healing":
- If the AI Embedding service is down, the system **falls back** to a basic department-based assignment.
- Tickets are **never** left unassigned or lost in the ether.

---

## 📊 Database Schema Highlights

### `profiles` Table
- `role`: Distinguishes between `customer`, `agent`, and `admin`.
- `expertise`: The raw text of the agent's skills.
- `expertise_embedding`: The `vector(768)` used for search.
- `department`: Links agents to their specific domain.

### `tickets` Table
- `semantic_embedding`: The `vector(768)` representng the problem.
- `assigned_to`: Foreign key to the agent profile.
- `status` & `priority`: Track the lifecycle of the issue.

---

## 🛠️ Summary of Recent Technical Pivots
- **Stabilization**: Switched from `text-embedding-004` to `gemini-embedding-001` to match stable Gemini standards.
- **Quota Management**: Moved Department/Priority classification from AI to Heuristics to avoid `RESOURCE_EXHAUSTED` errors.
- **Performance**: Standardized all AI communication to the stable `v1` and `v1beta` REST endpoints.
