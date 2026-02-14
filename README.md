# 🤖 Violet WhatsApp Bot by Kynx

A feature-rich WhatsApp bot built with Baileys and Firebase.

## 📋 Features

- ✅ Pairing Code Authentication
- ✅ Firebase Database Integration
- ✅ 100+ Commands
- ✅ Admin Management
- ✅ Economy System
- ✅ Card Collection Game
- ✅ Gambling Games
- ✅ Profile System
- ✅ Auto Welcome/Goodbye
- ✅ Antilink Protection
- ✅ And much more!

## 🚀 Installation

### 1. Clone or Extract

Extract the zip file or clone this repository.

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. Open `firebase.js` and replace the `serviceAccount` object with your Firebase credentials

### 4. Start the Bot

```bash
npm start
```

### 5. Pair Your WhatsApp

When the bot starts, it will ask for your WhatsApp number:
- Enter your number with country code (no +)
- Example: 2349049460676
- A pairing code will be displayed
- Open WhatsApp > Linked Devices > Link a Device > Link with Phone Number
- Enter the pairing code

## 📱 Bot Commands

### Main Menu
- `.menu` - Display full menu
- `.ping` - Check bot speed
- `.alive` - Check bot status
- `.help` - Get help

### Profile
- `.register` - Register your profile
- `.profile` - View profile
- `.leaderboard` - Top users

### Admin (Group Admins Only)
- `.promote` - Make user admin
- `.demote` - Remove admin
- `.kick` - Remove user
- `.ban` - Ban user
- `.tagall` - Tag all members
- `.welcome on/off` - Toggle welcome
- `.antilink on/off` - Toggle antilink

### Cards
- `.mycards` - Your cards
- `.rollcard` - Get random card
- `.givecard` - Gift a card

### Economy
- `.balance` - Check money
- `.daily` - Daily reward
- `.work` - Earn money
- `.rob` - Rob others

### Gambling
- `.gamble` - Gamble money
- `.slots` - Slot machine
- `.coinflip` - Flip a coin

### Fun
- `.match` - Love calculator
- `.ship` - Ship two users
- `.joke` - Random joke

### Owner Only
- `.mode public/private` - Change bot mode
- `.broadcast` - Send to all groups
- `.addprem` - Add premium user

## 🔧 Configuration

### Owner Number
The bot creator number is: **2349049460676**

This number has full access to all owner commands.

### Bot Modes
- **Public Mode**: Everyone can use commands (default)
- **Private Mode**: Only owner can use commands

Use `.mode private` or `.mode public` to switch.

## 🎴 Card System

When someone uploads an image with the message in a group where cards are enabled (`.cards on`), the card will spawn and can be collected!

## 🔥 Firebase Structure

```
users/
  {userId}/
    balance: number
    bank: number
    level: number
    exp: number
    cards: array
    premium: boolean

groups/
  {groupId}/
    welcome: boolean
    goodbye: boolean
    antilink: boolean
    cards: boolean
    muted: {}
    banned: {}

botSettings/
  mode: "public" | "private"
```

## ⚠️ Important Notes

1. **Network Errors**: If you see connection errors in Replit console, they're suppressed automatically. The bot will still work.

2. **Old Messages**: Bot won't respond to commands sent while it was offline (prevents spam on restart).

3. **Group Mode**: In groups, bot only responds when commands are used (no spam).

4. **Auto Admin**: If a WhatsApp number is admin in a group and the bot is admin, the bot can perform admin functions.

## 📦 Project Structure

```
violet-bot/
├── index.js                 # Main bot file
├── firebase.js              # Firebase configuration
├── package.json             # Dependencies
├── handlers/
│   └── messageHandler.js    # Message processing
├── commands/
│   ├── index.js            # Command registry
│   ├── main/               # Main commands
│   ├── profile/            # Profile commands
│   ├── admin/              # Admin commands
│   ├── cards/              # Card commands
│   ├── economy/            # Economy commands
│   ├── gambling/           # Gambling commands
│   ├── search/             # Search commands
│   ├── fun/                # Fun commands
│   └── owner/              # Owner commands
└── utils/
    └── permissions.js       # Permission checks
```

## 🆘 Troubleshooting

### Bot Not Responding
- Check if Firebase credentials are correct
- Ensure bot has admin rights (for admin commands)
- Verify command starts with correct prefix (.)

### Pairing Code Not Working
- Make sure you entered the number correctly (with country code)
- Wait 3 seconds after starting the bot
- Try restarting the bot

### Firebase Errors
- Check if Firebase Realtime Database is enabled
- Verify database URL in firebase.js
- Ensure service account has correct permissions

## 📄 License

MIT License - Feel free to modify and use!

## 👑 Credits

**Created by Kynx**
**Bot Name: Violet**

---

💜 **Violet By Kynx** 💜
