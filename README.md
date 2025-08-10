# BottleCRM: Free and Open Source Customer Relationship Management

<div align="center">
  <h3>Powerful, Modern Multi-Tenant CRM for Everyone</h3>
</div>

BottleCRM is a free, open-source Customer Relationship Management solution designed to help small and medium businesses effectively manage their customer relationships. Built with modern technologies and enterprise-grade multi-tenancy, it offers a comprehensive set of features without the enterprise price tag.

## ✨ Key Highlights

- **Multi-Tenant Architecture**: Secure organization-based data isolation
- **Role-Based Access Control**: Granular permissions for users and admins
- **Modern Technology Stack**: Built with SvelteKit 2.x, Svelte 5.x, and PostgreSQL
- **Mobile-First Design**: Responsive interface optimized for all devices

## 🚀 Core Features

### Sales & Lead Management

- **Lead Management**: Track and nurture leads from initial contact to conversion
- **Account Management**: Maintain detailed records of customer accounts and organizations
- **Contact Management**: Store and organize all your customer contact information
- **Opportunity Management**: Track deals through your sales pipeline with customizable stages

### Customer Support

- **Case Management**: Handle customer support cases and track resolution
- **Solution Knowledge Base**: Maintain searchable solutions for common issues
- **Multi-Channel Support**: Handle cases from various origins (email, web, phone)

### Productivity & Collaboration

- **Task Management**: Never miss a follow-up with built-in task tracking
- **Event Management**: Schedule and manage meetings and activities
- **Board Management**: Trello-like kanban boards for project tracking
- **Comment System**: Collaborate with team members on records

### Sales Tools

- **Quote Management**: Generate professional quotes with line items
- **Product Catalog**: Maintain product inventory with pricing
- **Sales Pipeline**: Visual opportunity tracking with probability scoring

### Administrative Features

- **User Management**: Add team members with appropriate role assignments
- **Organization Management**: Multi-tenant structure with data isolation
- **Audit Logging**: Complete activity tracking for compliance
- **Super Admin Panel**: Platform-wide management for system administrators

## 🔮 Coming Soon

- **Invoice Management**: Create, send, and track invoices (in development)
- **Email Integration**: Connect your email accounts for seamless communication
- **Analytics Dashboard**: Make data-driven decisions with powerful reporting tools
- **API Integration**: REST API for third-party integrations

## 🖥️ Technology Stack

- **Frontend**: SvelteKit 2.x, Svelte 5.x, TailwindCSS 4.x
- **Backend**: Node.js (API), Drizzle ORM/Drizzle Kit (queries, schema, migrations)
- **Database**: PostgreSQL (recommended) with multi-tenant schema
- **Authentication**: Session-based authentication with organization membership
- **Icons**: Lucide Svelte icon library
- **Validation**: Zod for type-safe form validation

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v22.13.0 (use nvm for version management)
- **Package Manager**: pnpm (recommended)
- **Database**: PostgreSQL (required for multi-tenancy features)

### Installation (Monorepo)

1. **Clone the repository:**

```bash
git clone https://github.com/micropyramid/svelte-crm.git
cd svelte-crm
```

2. **Set up Node.js version:**

```bash
nvm use 22.13.0
```

3. **Install dependencies (monorepo):**

```bash
pnpm install
```

4. **Configure environment variables (Wrangler + .dev.vars):**

For local development (recommended), create a `.dev.vars` file inside the app that needs the vars (e.g., `apps/web/.dev.vars`). Example:

```bash
# apps/web/.dev.vars
DATABASE_URL="postgresql://postgres:password@localhost:5432/bottlecrm?schema=public"
JWT_SECRET="<your-generated-secret>"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

To define variables for preview/production with Cloudflare Wrangler, add them to `wrangler.jsonc` under `vars` (e.g., `apps/web/wrangler.jsonc`):

```jsonc
{
	// ...existing config
	"vars": {
		"DATABASE_URL": "postgresql://...",
		"JWT_SECRET": "<your-generated-secret>",
		"GOOGLE_CLIENT_ID": "",
		"GOOGLE_CLIENT_SECRET": ""
	}
}
```

For production, best practice is to use Cloudflare's Secrets Store and Hyperdrive.

Notes

- `.dev.vars` is not committed and is used by `wrangler dev` for local runs.
- For non-Cloudflare processes (e.g., Node API), export env vars via your shell or a process manager as needed.

5. **Set up the database (shared/database/ Drizzle):**

```bash
# Generate SQL and types
pnpm --filter @opensource-startup-crm/database db:generate

# Run database migrations (dev)
pnpm --filter @opensource-startup-crm/database db:migrate:local


```

6. **Start development servers:**

```bash
# Web (SvelteKit)
pnpm --filter @opensource-startup-crm/web dev

# API (Node/Express)
pnpm --filter @opensource-startup-crm/api dev
```

### Development Workflow

Before committing code, ensure quality checks pass:

```bash
# Type checking
pnpm run check

# Linting and formatting
pnpm run lint

# Build verification
pnpm run build
```

### Production Deployment (Monorepo + Drizzle)

```bash
# Set Node.js version
nvm use 22.13.0

# Generate SQL and types
pnpm --filter @opensource-startup-crm/database db:generate

# Run production migrations
pnpm --filter @opensource-startup-crm/database db:migrate:prod

# Build applications
pnpm --filter @opensource-startup-crm/web build
pnpm --filter @opensource-startup-crm/api build

# Preview web
pnpm --filter @opensource-startup-crm/web preview
```

## 🏗️ Architecture & Security

### Multi-Tenant Design

- **Organization Isolation**: Complete data separation between organizations
- **Role-Based Access**: Users can have different roles across organizations
- **Session Management**: Secure cookie-based authentication with organization context

### User Roles

- **User**: Standard access to organization data
- **Admin**: Organization-level administrative privileges
- **Super Admin**: Platform-wide access (requires @micropyramid.com email)

### Data Security

- All database queries are organization-scoped
- Strict permission validation on all routes
- Audit logging for compliance and tracking

## 📁 Project Structure

```
src/
├── routes/
│   ├── (site)/          # Public marketing pages
│   ├── (no-layout)/     # Authentication pages
│   ├── (app)/           # Main CRM application
│   └── (admin)/         # Super admin panel
├── lib/
│   ├── stores/          # Svelte stores for state management
│   ├── data/            # Static data and configurations
│   └── utils/           # Utility functions
└── hooks.server.js      # Authentication and route protection
```

## 💬 Community and Feedback

We love to hear from our users! Please share your feedback, report bugs, or suggest new features:

- **Issues**: Open an issue on GitHub for bugs and feature requests
- **Discussions**: Join community discussions for general questions
- **Pull Requests**: Contribute code improvements and new features

## 🤝 Contributing

We welcome contributions of all kinds! See our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

### Development Guidelines

- Follow existing code patterns and conventions
- Ensure all forms have proper accessibility (labels associated with controls)
- Never use `$app` imports from SvelteKit (see packaging best practices)
- Always filter database queries by organization membership
- Add appropriate error handling and validation

## 📄 License

BottleCRM is open source software [licensed as MIT](LICENSE).

---

_Built with ❤️ for small businesses everywhere. We believe quality CRM software should be accessible to everyone._
