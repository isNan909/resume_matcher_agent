# Free AI Resume Agent MVP

A simple, powerful, and zero-LLM-cost **AI Resume Agent MVP** built with **Flue**, **TypeScript**, **Node.js**, **Hono**, and **OpenRouter** (`openrouter/free`).

The agent evaluates a candidate's resume against a target job description, performs a detailed requirements and skill match analysis, identifies gaps without fabricating candidate experience, provides actionable recommendations, and outputs an ATS-optimized resume.

---

## Key Features

- **Zero LLM Cost**: Configured to run using free OpenRouter models (`openrouter/free`).
- **Strict Fact Verification & No Fabrication**: Never invents skills, companies, job titles, years of experience, or metrics. Missing requirements are clearly flagged as gaps rather than falsely added.
- **Unslop & Direct Writing**: Enforces an Unslop skill to eliminate AI clichés, buzzwords ("delve", "testament", "tapestry", "cutting-edge"), filler words, and dramatic tropes.
- **Flue Framework Architecture**: Powered by durable Flue agent function conventions and skill primitives.
- **ATS Resume Optimization**: Highlights relevant candidate facts aligning with target job keywords.
- **Clean HTTP API**: Simple `POST /resume-agent` endpoint returning structured markdown analysis.

---

## Architecture

```text
Client (cURL / HTTP Request)
  ↓
Node.js Hono Server (src/app.ts)
  ↓
Flue Resume Agent (src/agents/resume-agent.ts)
  ├── Resume Writing Skill (skills/resume-writing/SKILL.md)
  └── Unslop Skill (skills/unslop/SKILL.md)
  ↓
OpenRouter Provider (@earendil-works/pi-ai)
  ↓
openrouter/free (Zero Cost Model)
  ↓
Markdown Result (# Resume Analysis)
```

---

## Project Structure

```text
resume-agent/
│
├── agents/ (or src/agents/)
│   └── resume-agent.ts          # Durable Flue Resume Agent module
│
├── skills/
│   ├── resume-writing/
│   │   └── SKILL.md             # Resume writing guidelines & skill instructions
│   └── unslop/
│       └── SKILL.md             # Unslop guidelines eliminating AI clichés & buzzwords
│
├── src/
│   ├── agents/
│   │   └── resume-agent.ts      # Agent definition
│   ├── app.ts                   # Hono HTTP routes & API endpoints
│   ├── index.ts                 # Application entry point
│   └── db.ts                    # Flue SQLite persistence adapter
│
├── .env.example                 # Environment variables template
├── .env                         # Local environment configuration
├── .gitignore                   # Git ignore settings
├── flue.config.js               # Flue framework configuration
├── package.json                 # Node.js dependencies & scripts
├── tsconfig.json                # TypeScript compiler options
├── vite.config.ts               # Vite & Flue plugin configuration
└── README.md                    # Project documentation
```

---

## Environment Setup

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openrouter/free
PORT=3000
```

> **Note**: Never hard-code your API keys in source code. `OPENROUTER_MODEL` can be changed to any supported OpenRouter model without modifying the codebase.

---

## Installation & Setup

1. Install dependencies using `pnpm` (or `npm`):

```bash
pnpm install
```

2. Verify TypeScript types:

```bash
pnpm check:types
```

3. Build the application bundle:

```bash
pnpm build
```

---

## Running the Project

### Development Server

Start the local development server on `http://localhost:3000`:

```bash
pnpm dev
```

### Production Server

Build and start the production server:

```bash
pnpm build
pnpm start
```

### Flue CLI Local Agent Execution

You can also run the agent directly from the command line using the Flue CLI without starting an HTTP server:

```bash
npx flue run src/agents/resume-agent.ts --message "Candidate Resume: Senior Backend Engineer with 6 years experience... Job Description: Looking for Node.js developer..."
```

---

## API Documentation

### `POST /resume-agent`

Processes a resume and target job description and returns a structured analysis.

#### Request Body

```json
{
  "resume": "Candidate resume text...",
  "jobDescription": "Job description text..."
}
```

#### Successful Response (`200 OK`)

```json
{
  "success": true,
  "result": "# Resume Analysis\n\n## 1. Job Requirements\n..."
}
```

#### Error Responses

- `400 Bad Request`: Missing resume or job description or invalid JSON format.
  ```json
  {
    "success": false,
    "error": "Resume is required"
  }
  ```
- `500 Internal Server Error`: OpenRouter API error or processing failure.
  ```json
  {
    "success": false,
    "error": "Unable to process resume"
  }
  ```

---

## Example Request & Verification Test

Run the dev server (`pnpm dev`) and execute this `curl` command:

```bash
curl -X POST http://localhost:3000/resume-agent \
  -H "Content-Type: application/json" \
  -d '{
    "resume": "John Doe\n\nBackend Engineer\n\n6 years of experience building web applications and APIs.\n\nExperience:\n\nSenior Backend Engineer\nABC Technologies\n2022 - Present\n- Built REST APIs using Node.js.\n- Developed backend services using TypeScript.\n- Worked with MongoDB.\n- Deployed applications using AWS.\n- Built Docker-based development environments.\n\nBackend Engineer\nXYZ Technologies\n2019 - 2022\n- Developed Node.js applications.\n- Built REST APIs.\n- Worked with PostgreSQL.\n\nSkills:\nNode.js\nTypeScript\nMongoDB\nPostgreSQL\nAWS\nDocker\nREST APIs",
    "jobDescription": "Senior Backend Engineer\n\nRequirements:\n- 5+ years backend development\n- Node.js\n- TypeScript\n- PostgreSQL\n- AWS\n- REST APIs\n- Microservices\n- Docker\n\nResponsibilities:\n- Build scalable backend services.\n- Design REST APIs.\n- Work with databases.\n- Deploy services to AWS.\n- Improve system performance and reliability."
  }'
```

---

## Future Extensions Roadmap

- **Phase 2**: PDF resume upload support
- **Phase 3**: DOCX resume upload support
- **Phase 4**: Generate downloadable DOCX/PDF optimized resumes
- **Phase 5**: Tailored cover letter generation
- **Phase 6**: Job description web scraping & research
- **Phase 7**: Automated job matching score
- **Phase 8**: Resume version history tracking
- **Phase 9**: User accounts & authentication
- **Phase 10**: Persistent relational database integration
# resume_matcher_agent
