# 📚 Google Docs Idle Game

An incremental idle game disguised as Google Docs! Type to generate words, unlock secret features hidden in the toolbar menus, and watch your productivity soar.

## 🎮 Game Features

### Core Gameplay
- **Type to Earn**: Click in the document or press Space/Enter to generate words
- **Idle Production**: Purchase upgrades that automatically generate words for you
- **Secret Features**: Hidden upgrades in File, Edit, View, Format, and Tools menus
- **Progressive Multipliers**: Stack multiple bonuses to exponentially increase word production

### Stealth Mode
The game looks **exactly like Google Docs**, making it perfect for:
- 🏫 Playing at school (looks like you're doing homework!)
- 💼 Playing at work (looks like you're writing a document!)
- 👀 Stealth gaming anywhere

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Play

### 1. Generate Words
- Click anywhere in the white document area
- Or press **Space** or **Enter** while typing
- Watch your word count increase!

### 2. Buy Upgrades
- Click **File** → **New Assignment**
- Purchase upgrades to automate word production:
  - **Auto-Type**: 1 word/second (10 words)
  - **Faster Typing**: +1 word per click (25 words)
  - **Spell Check**: 5 words/second (100 words)
  - **Grammar Assistant**: 20 words/second (500 words)
  - **Thesaurus Pro**: 100 words/second (2.5K words)

### 3. Unlock Secret Features
Explore the menu buttons to discover hidden upgrades!

#### File Menu 📁
- **Export Feature** (1,500 words): Gain 10% of total words as instant bonus
- **Page Setup Pro** (3,000 words): 2x word production multiplier

#### Edit Menu ✏️
- **Find & Replace** (50 words): Doubles all word production

#### View Menu 👁️
- **Dark Mode** (500 words): 2x production multiplier

#### Format Menu 🎨
- **Advanced Formatting** (800 words): Each word is worth 3x more

#### Tools Menu 🔧
- **Word Count Stats** (200 words): View detailed statistics
- **Voice Typing** (1,000 words): Auto-generates 50 words/second

### 4. Idle Progress
Leave the page open and watch your words accumulate automatically! The game continues running even when you're not clicking.

## 🎯 Tips & Strategies

1. **Start by clicking** to get your first 50 words
2. **Unlock Find & Replace first** (50 words) - it doubles everything!
3. **Buy Auto-Type** (10 words) to start idle production
4. **Stack multipliers** - they all work together!
5. **Check the floating counter** to see your words/second rate

## 🛠️ Technical Details

### Built With
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **React Context API** - State management
- **localStorage** - Persistent saves

### Game Mechanics
- **Tick Rate**: 100ms (10 updates per second)
- **Save System**: Automatic localStorage persistence
- **Multiplier Stacking**: All multipliers multiply together
- **Idle Production**: Calculated in real-time based on upgrades

## 🌐 Online Deployment

Deploy to Vercel (recommended):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or deploy to:
- Netlify
- Render
- Any Node.js hosting service

## 📱 Browser Support

Works on all modern browsers:
- ✅ Chrome / Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 🎨 Customization

### Change Assignment Prompts
Edit the `ESSAY_PROMPTS` array in `app/context/DocsGameContext.tsx`:
```typescript
const ESSAY_PROMPTS = [
  "Your custom prompt here...",
  // Add more prompts
];
```

### Add New Upgrades
Add to the `INITIAL_UPGRADES` object in `DocsGameContext.tsx`:
```typescript
newUpgrade: {
  id: 'newUpgrade',
  name: 'Upgrade Name',
  description: 'What it does',
  baseCost: 100,
  costMultiplier: 1.15,
  effect: 10,
  level: 0,
  unlocked: true,
}
```

### Add New Secret Features
Add to the `INITIAL_SECRETS` object in `DocsGameContext.tsx`:
```typescript
newSecret: {
  id: 'newSecret',
  menuName: 'Tools', // Which menu it appears in
  name: 'Secret Name',
  description: 'What it does',
  unlockCost: 500,
  unlocked: false,
  effect: 'multiplier', // or 'production' or 'bonus'
  multiplier: 2,
}
```

## 📝 Game Progression

### Early Game (0-100 words)
- Click to generate words
- Unlock Find & Replace (50 words)
- Buy Auto-Type (10 words)

### Mid Game (100-1000 words)
- Unlock Word Count Stats (200 words)
- Unlock Dark Mode (500 words)
- Buy Spell Check (100 words)
- Unlock Advanced Formatting (800 words)

### Late Game (1000+ words)
- Unlock Voice Typing (1,000 words)
- Unlock Export Feature (1,500 words)
- Unlock Page Setup Pro (3,000 words)
- Buy Grammar Assistant (500 words)
- Buy Thesaurus Pro (2,500 words)

## 🎓 Educational Value

While disguised as a game, this project teaches:
- **Incremental growth** and compound interest
- **Resource management** and optimization
- **Planning and strategy** for long-term goals
- **Delayed gratification** (saving for expensive upgrades)

## 🤝 Contributing

This is a fun project! Feel free to:
- Add more secret features
- Create new upgrade types
- Improve the UI/UX
- Add achievements
- Create different themes (Google Sheets, Slides, etc.)

## 📄 License

This project is for educational and entertainment purposes.

## 🎉 Have Fun!

Enjoy your "productive" time writing essays! 😉

---

**Remember**: This game is meant to look like Google Docs for fun, but always respect your school/work policies regarding appropriate computer use!
