# PollApp - Modern Polling Application

A modern, responsive polling application built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn UI components. Create polls, vote, and see real-time results with a beautiful user interface.

## 🚀 Features

### Core Functionality
- **Create Polls**: Build polls with multiple options, descriptions, and expiration dates
- **Vote System**: Single or multiple vote support with real-time updates
- **Poll Management**: View, edit, and delete polls
- **Search & Filter**: Find polls by title, description, or status
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Authentication & Security
- **Supabase Authentication**: Secure user registration and login
- **Protected Routes**: Middleware-based route protection
- **User Sessions**: Persistent authentication state
- **Email Verification**: Secure email confirmation for new accounts

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
- **Supabase**: Backend-as-a-Service for authentication and database

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
│   └── page.tsx                # Landing page (redirects to /polls)
├── components/                  # Reusable components
│   ├── ui/                     # Shadcn UI components
│   │   ├── button.tsx         # Button component
│   │   ├── card.tsx           # Card component
│   │   ├── input.tsx          # Input component
│   │   └── textarea.tsx       # Textarea component
│   ├── layout/                 # Layout components
│   │   └── navbar.tsx         # Navigation bar
│   └── auth/                   # Authentication components
│       └── protected-route.tsx # Protected route wrapper
├── contexts/                   # React contexts
│   └── auth-context.tsx       # Authentication context
├── lib/                        # Utility libraries
│   ├── auth.ts                # Authentication utilities
│   ├── supabase.ts            # Supabase client configuration
│   └── utils.ts               # General utilities (cn function)
├── types/                      # TypeScript type definitions
│   └── poll.ts                # Poll-related types
├── middleware.ts              # Next.js middleware for route protection
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
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: React hooks + Context API
- **API**: Next.js API Routes
- **Middleware**: Next.js Middleware for route protection

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Supabase Setup

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Configure Authentication**
   - In your Supabase dashboard, go to Authentication > Settings
   - Configure your site URL (e.g., `http://localhost:3000`)
   - Set up email templates if desired

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Supabase Service Role Key (for server-side operations)
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Installation

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

## 🔐 Authentication Features

### User Registration
- Email and password registration
- Email verification required
- User profile with name and email
- Secure password validation

### User Login
- Email/password authentication
- Persistent sessions
- Automatic redirect after login
- Remember redirect destination

### Protected Routes
- Middleware-based route protection
- Client-side route protection
- Automatic redirect to login
- Loading states during authentication

### User Management
- Sign out functionality
- User profile display
- Session management
- Secure token handling

## 📋 Features Roadmap

### Phase 1: Core Functionality ✅
- [x] Basic poll creation and voting
- [x] Poll listing and search
- [x] Responsive UI with Shadcn components
- [x] API routes for CRUD operations
- [x] Supabase authentication
- [x] Protected routes

### Phase 2: Enhanced Features
- [ ] User profiles and dashboard
- [ ] Poll ownership and permissions
- [ ] Vote history and analytics
- [ ] Real-time updates with WebSockets

### Phase 3: Advanced Features
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

### Supabase Configuration
The app uses Supabase for authentication and database. Key configuration points:

- **Authentication**: Email/password with email verification
- **Session Management**: Automatic session refresh
- **Route Protection**: Middleware and client-side protection
- **User Data**: Stored in Supabase auth.users table

### Environment Variables
Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
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
- [Supabase](https://supabase.com/) for authentication and database
- [Lucide](https://lucide.dev/) for the icon library

---

Built with ❤️ using Next.js, Supabase, and Shadcn UI
