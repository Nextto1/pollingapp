# PollApp - Modern Polling Application

A modern, responsive polling application built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn UI components. Create polls, vote, and see real-time results with a beautiful user interface.

## 🚀 Features

### Core Functionality
- **Create Polls**: Build polls with multiple options, descriptions, and expiration dates
- **Vote System**: Single or multiple vote support with real-time updates
- **Poll Management**: View, edit, and delete polls
- **Search & Filter**: Find polls by title, description, or status
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### User Experience
- **Modern UI**: Clean, accessible interface using Shadcn UI components
- **Real-time Results**: Live vote counting and percentage calculations
- **Status Indicators**: Clear visual feedback for active/closed polls
- **Navigation**: Intuitive navigation with breadcrumbs and clear CTAs

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Next.js 15**: Latest App Router with server components
- **Tailwind CSS**: Utility-first styling with custom design system
- **Shadcn UI**: High-quality, accessible component library
- **API Routes**: RESTful API endpoints for all CRUD operations

## 📁 Project Structure

```
alx-polly/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── polls/               # Poll-related API endpoints
│   │       ├── route.ts         # GET /api/polls, POST /api/polls
│   │       ├── [id]/            # Individual poll operations
│   │       │   ├── route.ts     # GET, PUT, DELETE /api/polls/[id]
│   │       │   └── vote/        # Voting functionality
│   │       │       └── route.ts # POST /api/polls/[id]/vote
│   ├── auth/                    # Authentication pages
│   │   ├── signin/             # Sign in page
│   │   │   └── page.tsx
│   │   └── signup/             # Sign up page
│   │       └── page.tsx
│   ├── polls/                   # Poll-related pages
│   │   ├── page.tsx            # Polls listing page
│   │   ├── create/             # Create new poll
│   │   │   └── page.tsx
│   │   └── [id]/               # Individual poll view
│   │       └── page.tsx
│   ├── globals.css             # Global styles with Shadcn variables
│   ├── layout.tsx              # Root layout with navigation
│   └── page.tsx                # Landing page
├── components/                  # Reusable components
│   ├── ui/                     # Shadcn UI components
│   │   ├── button.tsx         # Button component
│   │   ├── card.tsx           # Card component
│   │   ├── input.tsx          # Input component
│   │   └── textarea.tsx       # Textarea component
│   └── layout/                 # Layout components
│       └── navbar.tsx         # Navigation bar
├── lib/                        # Utility libraries
│   ├── auth.ts                # Authentication utilities
│   └── utils.ts               # General utilities (cn function)
├── types/                      # TypeScript type definitions
│   └── poll.ts                # Poll-related types
├── components.json            # Shadcn configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)
- **API**: Next.js API Routes
- **Authentication**: Placeholder (ready for NextAuth.js, Clerk, etc.)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alx-polly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📋 Features Roadmap

### Phase 1: Core Functionality ✅
- [x] Basic poll creation and voting
- [x] Poll listing and search
- [x] Responsive UI with Shadcn components
- [x] API routes for CRUD operations

### Phase 2: Authentication & User Management
- [ ] User registration and login
- [ ] User profiles and dashboard
- [ ] Poll ownership and permissions
- [ ] Vote history and analytics

### Phase 3: Advanced Features
- [ ] Real-time updates with WebSockets
- [ ] Poll categories and tags
- [ ] Advanced analytics and charts
- [ ] Poll sharing and embedding
- [ ] Email notifications

### Phase 4: Enterprise Features
- [ ] Team collaboration
- [ ] Advanced permissions
- [ ] API rate limiting
- [ ] Data export and reporting

## 🎨 Design System

The application uses a consistent design system built on:

- **Colors**: HSL-based color system with dark mode support
- **Typography**: Geist Sans and Geist Mono fonts
- **Spacing**: Consistent spacing scale (4px base unit)
- **Components**: Reusable Shadcn UI components
- **Icons**: Lucide React icon library

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
# Database (when implementing)
DATABASE_URL=your_database_url

# Authentication (when implementing)
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# API Keys (if needed)
API_KEY=your_api_key
```

### Shadcn UI
The project is configured with Shadcn UI. To add new components:

```bash
npx shadcn@latest add [component-name]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Lucide](https://lucide.dev/) for the icon library

---

Built with ❤️ using Next.js and Shadcn UI
