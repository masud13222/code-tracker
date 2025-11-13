# Code Tracker 🚀

A modern, collaborative code tracking platform for teams to organize problems, track progress, share solutions, and compete on leaderboards.

## ✨ Features

### 🎯 Topic-Based Organization
- Create topics/categories (Basics, Data Structures, Graph Theory, etc.)
- 10 modern programming-related icons
- Progress tracking per topic
- Visual progress bars with percentages

### 💻 Problem Management
- Add problems with external links (Codeforces, Vjudge)
- Difficulty levels (Easy, Medium, Hard)
- Ordering and recommended badges
- Tags for categorization
- Checkbox-based completion tracking

### 📝 Code Submission
- Submit solutions in multiple languages (C++, Python, Java, JavaScript, C)
- Add notes to your submissions
- **Edit your own submissions anytime** ✨ NEW
- View all team solutions in dedicated page

### 🏆 Leaderboard
- Real-time rankings by problems solved
- Completion percentages
- Visual progress indicators
- User highlighting

### 👤 User Profiles
- Personal statistics
- Activity history
- Difficulty breakdown
- Recent completions

### 🎨 Modern UI/UX
- Beautiful dark theme
- Green highlighting for completed problems
- Blue highlighting for your submissions
- Smooth animations
- Mobile-responsive design
- Professional shadcn/ui components

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database

### Installation

1. **Navigate to project**
```bash
cd code-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment variables**

The `.env.local` file is already configured:
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:3000
```

---

## 📖 How to Use

### Create Account
1. Visit http://localhost:3000
2. Click "Sign up"
3. Enter username and password
4. Start tracking!

### Create a Topic
1. Go to "Topics" page
2. Click "Create Topic"
3. Select an icon (Code2, Database, GitBranch, etc.)
4. Enter name and description
5. Click "Create Topic"

### Add Problems
1. Open a topic
2. Click "Add Problem"
3. Fill in:
   - Name (required)
   - Description (optional)
   - Difficulty (required)
   - External link (required)
   - Order number (optional)
   - Tags (optional)
   - Recommended checkbox
4. Click "Add Problem"

### Submit Code
1. Click "Submit Code" on any problem
2. Select language
3. Paste your code
4. Add notes (optional)
5. Click "Submit Code"

### View Solutions
1. Click "View Solutions" button OR click problem name
2. See all team submissions with:
   - Username
   - Code
   - Language
   - Completion status
   - Notes

### Mark Complete
1. Check the checkbox on any problem
2. Problem card turns green! 🟢
3. Progress updates automatically

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (httpOnly cookies)
- **Icons**: Lucide React

---

## 📁 Project Structure

```
code-tracker/
├── app/
│   ├── (auth)/              # Login & Register pages
│   ├── (dashboard)/         # Main app pages
│   │   ├── page.tsx         # Dashboard
│   │   ├── problems/        # Topics list
│   │   │   └── [id]/        # Submissions page
│   │   ├── topics/[id]/     # Topic problems
│   │   ├── leaderboard/     # Rankings
│   │   └── profile/         # User profile
│   └── api/                 # API routes
│       ├── auth/            # Authentication
│       ├── topics/          # Topics & Problems
│       ├── submissions/     # Code submissions
│       ├── completions/     # Completion tracking
│       ├── leaderboard/     # Rankings data
│       └── stats/           # User statistics
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── app-sidebar.tsx      # Navigation
│   ├── topic-card.tsx       # Topic display
│   ├── problem-card.tsx     # Problem display + actions
│   ├── create-topic-dialog.tsx
│   └── stats-card.tsx
├── lib/
│   ├── mongodb.ts           # Database connection
│   ├── auth.ts              # JWT utilities
│   └── models/              # Mongoose schemas
│       ├── User.ts
│       ├── Topic.ts
│       ├── Problem.ts
│       ├── Completion.ts
│       └── Submission.ts
├── proxy.ts                 # Route protection (Next.js 16)
└── README.md               # This file
```

---

## 🗄 Database Schema

### Collections

**Users**
```typescript
{
  username: string (unique),
  password: string (hashed),
  createdAt: Date
}
```

**Topics**
```typescript
{
  name: string,
  description: string,
  icon: string,
  createdBy: ObjectId,
  createdAt: Date
}
```

**Problems**
```typescript
{
  name: string,
  description: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  tags: string[],
  externalLink: string,
  topicId: ObjectId,
  order: number,
  isRecommended: boolean,
  createdBy: ObjectId,
  createdAt: Date
}
```

**Completions**
```typescript
{
  userId: ObjectId,
  problemId: ObjectId,
  completedAt: Date
}
```

**Submissions**
```typescript
{
  userId: ObjectId,
  problemId: ObjectId,
  code: string,
  language: string,
  notes: string,
  submittedAt: Date
}
```

---

## 🎨 Design System

### Colors
- Background: `zinc-950`
- Cards: `zinc-900`
- Borders: `zinc-800`
- Primary: Blue-Purple gradient
- Success: `green-500`
- Warning: `yellow-500`
- Error: `red-500`

### Icons (Lucide)
- Code2 - Basics
- Database - Data Structures
- GitBranch - Graph Theory
- Binary - Number Theory
- Brain - Algorithms
- Layers - Combinatorics
- Network - Networks
- Cpu - Dynamic Programming
- Blocks - Strings
- Repeat - Recursion

---

## 🔧 Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

---

## 🌟 Key Features Explained

### Green Completion Visual
- Completed problems have green border and background
- Problem name turns green
- Checkmark (✓) icon appears
- Easy to identify at a glance

### Code Submission System
- Submit code without marking complete
- Update submissions anytime
- View everyone's solutions
- Learn from teammates

### Dedicated Submissions Page
- Full-screen code viewing
- No modal popups
- Better code readability
- Professional layout

### Mobile Responsive
- Works on all devices
- Touch-friendly interactions
- Responsive grids
- Icon-only buttons on mobile

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=strong-random-secret-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🤝 Contributing

This is a collaborative tool - all users have equal permissions!
- Anyone can create topics
- Anyone can add problems
- Everyone tracks their own progress
- Compete on shared leaderboard

---

## 📝 License

MIT License

---

## 🎯 Perfect For

- Study groups (4-5 members)
- Competitive programming teams
- Coding bootcamp cohorts
- Interview preparation groups
- Algorithm study circles

---

## ✨ Why Code Tracker?

✅ **Organized**: Topic-based problem organization
✅ **Collaborative**: Share solutions with team
✅ **Motivating**: Leaderboard competition
✅ **Visual**: Green completion highlighting
✅ **Modern**: Beautiful dark UI
✅ **Mobile-Friendly**: Works anywhere
✅ **Simple**: No complicated setup
✅ **Equal Access**: No admin roles needed

---

## 🐛 Troubleshooting

### Server won't start
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Database connection issues
- Check MongoDB URI in `.env.local`
- Verify IP whitelist in MongoDB Atlas
- Ensure database credentials are correct

### Authentication problems
- Clear browser cookies
- Check JWT_SECRET is set
- Verify token expiration (7 days default)

---

## 🚀 Deployment

### Deploy to Vercel

This project is optimized for Vercel deployment. See **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** for:
- Complete step-by-step deployment guide
- Environment variables setup
- Custom domain configuration
- Troubleshooting tips
- Performance optimization

**Quick Deploy**: 
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy! ✅

---

## 📞 Support

For issues or questions, check the codebase or create an issue.

---

**Built with ❤️ using Next.js, shadcn/ui, and MongoDB**

**Happy Coding! 🚀**
