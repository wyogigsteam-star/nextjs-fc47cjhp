# 🚧 Asphalt Empire 🚧

A mobile-first idle/incremental game where you build and manage an asphalt paving business empire. Start with a simple hand shovel and work your way up to owning a massive paving operation with advanced equipment, hired workers, and lucrative highway contracts!

![Asphalt Empire Banner](https://github.com/user-attachments/assets/269799f4-7efc-4633-a778-05e25e78d5f0)

## 🎮 Game Features

### Core Gameplay
- **Idle Mechanics**: Earn money automatically from your paving operations
- **Offline Progress**: Continue earning for up to 1 hour while away
- **Progressive Unlocks**: Unlock new job types and equipment as you grow
- **Persistent Saves**: Your progress is automatically saved to local storage

### Equipment System
Upgrade through 8 tiers of equipment:
- 🔨 Hand Shovel → 🛒 Wheelbarrow → 🚜 Mini Paver
- 🚚 Asphalt Truck → 🏗️ Paver Machine → 🚧 Road Roller
- 🏭 Asphalt Plant → 👷 Highway Crew

### Worker System
Hire workers to multiply your revenue:
- 👤 First Worker (1.5× multiplier)
- 👥 Second Worker (2× multiplier)
- 👨‍💼 Foreman (3× multiplier)
- 👨‍🔬 Civil Engineer (5× multiplier)

### Achievement System
Unlock achievements for permanent bonuses:
- 💵 First Dollar - 10% bonus
- 💰 Six Figures - 25% bonus
- 🏆 Equipment Master - 50% bonus
- 👥 Full Crew - 100% bonus

### Job Types
Progress through different paving projects:
- 🕳️ Pothole Repair
- 🏠 Driveway Paving
- 🅿️ Parking Lot
- 🛣️ City Road
- 🛤️ Highway Project

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/wyogigsteam-star/nextjs-fc47cjhp.git
cd nextjs-fc47cjhp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📱 Mobile Optimization

This game is designed with mobile-first principles:
- **Touch-Friendly**: Large buttons and intuitive tap controls
- **Responsive Layout**: Adapts to any screen size
- **Battery Efficient**: Optimized update frequency (2 Hz)
- **Portrait Mode**: Best played in portrait orientation
- **No Keyboard Needed**: Pure touch interface

## 🎯 Game Balance

- **Cost Scaling**: Equipment costs increase by 15% with each purchase
- **Worker Multipliers**: Stack multiplicatively for exponential growth
- **Offline Cap**: Maximum 1 hour of offline earnings
- **Achievement Bonuses**: Permanent multipliers for reaching milestones

## 🔧 Technical Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Persistence**: localStorage
- **Build Tool**: Next.js compiler

## 📂 Project Structure

```
app/
├── context/
│   └── PavingGameContext.js    # Game state management
├── engines/
│   └── PavingLogic.js           # Core game logic
├── layout.tsx                    # Root layout
├── page.tsx                      # Main game UI
└── globals.css                   # Global styles
```

## 🎨 Screenshots

| Welcome Screen | Main Game |
|:---:|:---:|
| ![Intro](https://github.com/user-attachments/assets/e765de1d-e26e-49d0-94a9-8962518516fb) | ![Game](https://github.com/user-attachments/assets/269799f4-7efc-4633-a778-05e25e78d5f0) |

| Equipment Shop | Worker Hiring |
|:---:|:---:|
| ![Equipment](https://github.com/user-attachments/assets/2f00162e-e1ef-4816-95d6-5a7bc2e5f8f3) | ![Workers](https://github.com/user-attachments/assets/e2c09583-90ce-476a-acca-89dac297fc8d) |

## 🔒 Security

- ✅ No security vulnerabilities detected
- ✅ CodeQL analysis passed
- ✅ All dependencies up to date
- ✅ Client-side only (no server-side data storage)

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own use!

## 📄 License

This project is open source and available under the MIT License.

## 🎮 How to Play

1. **Start Small**: Begin with your hand shovel earning $1/second
2. **Buy Equipment**: Purchase new equipment to increase your revenue
3. **Hire Workers**: Multiply your income with skilled workers
4. **Unlock Jobs**: Progress through different paving projects
5. **Earn Achievements**: Get permanent bonuses for milestones
6. **Build Your Empire**: Scale up to a massive paving operation!

## ⚡ Tips for Success

- Buy equipment early and often - the compound interest effect is powerful
- Workers provide multiplicative bonuses - prioritize them when possible
- Check back regularly to take advantage of your earnings
- Achievements provide permanent bonuses - aim to unlock them all!

## 🚀 Future Enhancements

Potential features for future versions:
- Territory expansion system
- Weather events affecting operations
- Contract bidding mechanics
- Crew management with individual workers
- Visual paving animations
- Sound effects and music
- Online leaderboards
- Daily challenges and rewards

---

Built with ❤️ using Next.js and React
