// Import all command modules
import menu from './main/menu.js';
import ping from './main/ping.js';
import alive from './main/alive.js';
import help from './main/help.js';
import register from './profile/register.js';
import profile from './profile/profile.js';
import leaderboard from './profile/leaderboard.js';
import promote from './admin/promote.js';
import demote from './admin/demote.js';
import kick from './admin/kick.js';
import tagall from './admin/tagall.js';
import hidetag from './admin/hidetag.js';
import add from './admin/add.js';
import mute from './admin/mute.js';
import unmute from './admin/unmute.js';
import warn from './admin/warn.js';
import ban from './admin/ban.js';
import unban from './admin/unban.js';
import groupinfo from './admin/groupinfo.js';
import welcome from './admin/welcome.js';
import goodbye from './admin/goodbye.js';
import antilink from './admin/antilink.js';
import deleteMsg from './admin/delete.js';
import open from './admin/open.js';
import close from './admin/close.js';
import setppgc from './admin/setppgc.js';
import setname from './admin/setname.js';
import setdesc from './admin/setdesc.js';
import grouplink from './admin/grouplink.js';
import revoke from './admin/revoke.js';
import mods from './admin/mods.js';
import mycards from './cards/mycards.js';
import deck from './cards/deck.js';
import givecardCmd from './cards/givecard.js';
import rollcard from './cards/rollcard.js';
import cards from './cards/cards.js';
import balance from './economy/balance.js';
import daily from './economy/daily.js';
import work from './economy/work.js';
import rob from './economy/rob.js';
import gamble from './gambling/gamble.js';
import slots from './gambling/slots.js';
import coinflip from './gambling/coinflip.js';
import sticker from './image/sticker.js';
import gpt from './search/gpt.js';
import google from './search/google.js';
import image from './search/image.js';
import match from './fun/match.js';
import ship from './fun/ship.js';
import joke from './fun/joke.js';
import mode from './owner/mode.js';
import broadcast from './owner/broadcast.js';
import addprem from './owner/addprem.js';
import delprem from './owner/delprem.js';

export const commands = {
    // Main commands
    menu,
    ping,
    alive,
    help,
    
    // Profile commands
    register,
    reg: register,
    profile,
    p: profile,
    leaderboard,
    lb: leaderboard,
    
    // Admin commands
    promote,
    demote,
    kick,
    tagall,
    hidetag,
    add,
    mute,
    unmute,
    warn,
    ban,
    unban,
    groupinfo,
    welcome,
    goodbye,
    antilink,
    delete: deleteMsg,
    open,
    close,
    setppgc,
    setname,
    setdesc,
    grouplink,
    revoke,
    mods,
    
    // Cards commands
    mycards,
    deck,
    givecard: givecardCmd,
    rollcard,
    cards,
    
    // Economy commands
    balance,
    accbal: balance,
    daily,
    work,
    rob,
    
    // Gambling commands
    gamble,
    slots,
    coinflip,
    
    // Image commands
    sticker,
    
    // Search commands
    gpt,
    ai: gpt,
    google,
    image,
    
    // Fun commands
    match,
    ship,
    joke,
    
    // Owner commands
    mode,
    broadcast,
    addprem,
    delprem
};
