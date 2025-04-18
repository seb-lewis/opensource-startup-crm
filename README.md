# BottleCRM: Free and Open Source Customer Relationship Management

<div align="center">
  <h3>Powerful, Modern CRM for Everyone</h3>
</div>

BottleCRM is a free, open-source Customer Relationship Management solution designed to help small and medium businesses effectively manage their customer relationships. Built with modern technologies, it offers a comprehensive set of features without the enterprise price tag.

## 🚀 Features

- **Lead Management**: Track and nurture leads from initial contact to conversion
- **Account Management**: Maintain detailed records of customer accounts and organizations
- **Contact Management**: Store and organize all your customer contact information
- **Case Management**: Handle customer support cases and track resolution
- **Task Management**: Never miss a follow-up with built-in task tracking
- **Opportunity Management**: Track deals through your sales pipeline
- **Mobile Friendly**: Access your CRM data on any device
- **Modern UI**: Clean, intuitive interface built with Svelte and TailwindCSS

## 🔮 Coming Soon

- **Invoice Management**: Create, send, and track invoices (in development)
- **Email Integration**: Connect your email accounts for seamless communication
- **Analytics Dashboard**: Make data-driven decisions with powerful reporting tools

## 🖥️ Technologies

- **Frontend**: SvelteKit, Flowbite-Svelte, TailwindCSS
- **Backend**: Prisma ORM with your choice of database
- **Authentication**: Built-in authentication system

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm, pnpm, or yarn package manager
- A database (PostgreSQL recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bottlecrm.git
cd bottlecrm
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn
```

3. Configure your environment variables (see `.env.example`)

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
# or
npm run dev -- --open
```

## 🔧 Building for Production

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## 💬 Community and Feedback

We love to hear from our users! Please share your feedback, report bugs, or suggest new features:

- Open an issue on GitHub
- Join our community forum
- Contribute code via pull requests

## 🤝 Contributing

We welcome contributions of all kinds! See our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## 📄 License

BottleCRM is open source software [licensed as MIT](LICENSE).

---

*Built with ❤️ for small businesses everywhere. We believe quality CRM software should be accessible to everyone.*
