import React from 'react'
import { letters, status, state } from './constants'
import words from './data/words'

import { ReactComponent as Create } from './data/Create.svg'
import { ReactComponent as Info } from './data/Info.svg'
import { ReactComponent as Settings } from './data/Settings.svg'
import { ReactComponent as Share } from './data/Share.svg'

import { InfoModal } from './components/InfoModal'
import { SettingsModal } from './components/SettingsModal'
import { EndGameModal } from './components/EndGameModal'
import { Keyboard } from './components/Keyboard'

// Set the day number of the puzzle to display and show it as the address bar query string
function computeDay() {
  // The default day (today).
  const todaysDate = new Date();
  const date1 = new Date('6/21/21');
  const diffTime = Math.abs(todaysDate - date1);
  const defaultDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const { search } = document.location;
  let day = defaultDay;

  if (search) {
    if (!isNaN(search.slice(1))) {
      day = parseInt(search.slice(1), 10);
    }
  }

  if (day < 1 || day > defaultDay) {
    day = defaultDay;
  }
  window.history.pushState({}, '', '?' + day);

  return day;
};

const wordle_answers = ["rebut", "sissy", "humph", "awake", "blush", "focal", "evade", "naval", "serve", "heath", "dwarf", "model", "karma", "stink", "grade", "quiet", "bench", "abate", "feign", "major", "death", "fresh", "crust", "stool", "colon", "abase", "marry", "react", "batty", "pride", "floss", "helix", "croak", "staff", "paper", "unfed", "whelp", "trawl", "outdo", "adobe", "crazy", "sower", "repay", "digit", "crate", "cluck", "spike", "mimic", "pound", "maxim", "linen", "unmet", "flesh", "booby", "forth", "first", "stand", "belly", "ivory", "seedy", "print", "yearn", "drain", "bribe", "stout", "panel", "crass", "flume", "offal", "agree", "error", "swirl", "argue", "bleed", "delta", "flick", "totem", "wooer", "front", "shrub", "parry", "biome", "lapel", "start", "greet", "goner", "golem", "lusty", "loopy", "round", "audit", "lying", "gamma", "labor", "islet", "civic", "forge", "corny", "moult", "basic", "salad", "agate", "spicy", "spray", "essay", "fjord", "spend", "kebab", "guild", "aback", "motor", "alone", "hatch", "hyper", "thumb", "dowry", "ought", "belch", "dutch", "pilot", "tweed", "comet", "jaunt", "enema", "steed", "abyss", "growl", "fling", "dozen", "boozy", "erode", "world", "gouge", "click", "briar", "great", "altar", "pulpy", "blurt", "coast", "duchy", "groin", "fixer", "group", "rogue", "badly", "smart", "pithy", "gaudy", "chill", "heron", "vodka", "finer", "surer", "radio", "rouge", "perch", "retch", "wrote", "clock", "tilde", "store", "prove", "bring", "solve", "cheat", "grime", "exult", "usher", "epoch", "triad", "break", "rhino", "viral", "conic", "masse", "sonic", "vital", "trace", "using", "peach", "champ", "baton", "brake", "pluck", "craze", "gripe", "weary", "picky", "acute", "ferry", "aside", "tapir", "troll", "unify", "rebus", "boost", "truss", "siege", "tiger", "banal", "slump", "crank", "gorge", "query", "drink", "favor", "abbey", "tangy", "panic", "solar", "shire", "proxy", "point", "robot", "prick", "wince", "crimp", "knoll", "sugar", "whack", "mount", "perky", "could", "wrung", "light", "those", "moist", "shard", "pleat", "aloft", "skill", "elder", "frame", "humor", "pause", "ulcer", "ultra", "robin", "cynic", "aroma", "caulk", "shake", "dodge", "swill", "tacit", "other", "thorn", "trove", "bloke", "vivid", "spill", "chant", "choke", "rupee", "nasty", "mourn", "ahead", "brine", "cloth", "hoard", "sweet", "month", "lapse", "watch", "today", "focus", "smelt", "tease", "cater", "movie", "saute", "allow", "renew", "their", "slosh", "purge", "chest", "depot", "epoxy", "nymph", "found", "shall", "stove", "lowly", "snout", "trope", "fewer", "shawl", "natal", "comma", "foray", "scare", "stair", "black", "squad", "royal", "chunk", "mince", "shame", "cheek", "ample", "flair", "foyer", "cargo", "oxide", "plant", "olive", "inert", "askew", "heist", "shown", "zesty", "trash", "larva", "forgo", "story", "hairy", "train", "homer", "badge", "midst", "canny", "fetus", "butch", "farce", "slung", "tipsy", "metal", "yield", "delve", "being", "scour", "glass", "gamer", "scrap", "money", "hinge", "album", "vouch", "asset", "tiara", "crept", "bayou", "atoll", "manor", "creak", "showy", "phase", "froth", "depth", "gloom", "flood", "trait", "girth", "piety", "goose", "float", "donor", "atone", "primo", "apron", "blown", "cacao", "loser", "input", "gloat", "awful", "brink", "smite", "beady", "rusty", "retro", "droll", "gawky", "hutch", "pinto", "egret", "lilac", "sever", "field", "fluff", "flack", "agape", "voice", "stead", "stalk", "berth", "madam", "night", "bland", "liver", "wedge", "augur", "roomy", "wacky", "flock", "angry", "trite", "aphid", "tryst", "midge", "power", "elope", "cinch", "motto", "stomp", "upset", "bluff", "cramp", "quart", "coyly", "youth", "rhyme", "buggy", "alien", "smear", "unfit", "patty", "cling", "glean", "label", "hunky", "khaki", "poker", "gruel", "twice", "twang", "shrug", "treat", "waste", "merit", "woven", "needy", "clown", "widow", "irony", "ruder", "gauze", "chief", "onset", "prize", "fungi", "charm", "gully", "inter", "whoop", "taunt", "leery", "class", "theme", "lofty", "tibia", "booze", "alpha", "thyme", "doubt", "parer", "chute", "stick", "trice", "alike", "recap", "saint", "glory", "grate", "admit", "brisk", "soggy", "usurp", "scald", "scorn", "leave", "twine", "sting", "bough", "marsh", "sloth", "dandy", "vigor", "howdy", "enjoy"]

function isValidWord(word) {
  return words[word.toLowerCase()];
}

class Board extends React.Component {
  getCellStyles(rowIdx, colIdx, letter) {
    if (rowIdx === this.props.currentRow) {
      if (letter) {
        return [
          'nm-inset-background',
          'dark:nm-inset-background-dark',
          'text-primary',
          'dark:text-primary-dark',
          this.props.submittedInvalidWord ? 'border border-red-800' : '',
        ].join(' ');
      } else {
        return [
          'nm-flat-background',
          'dark:nm-flat-background-dark',
          'text-primary',
          'dark:text-primary-dark',
        ].join(' ');
      }
    }

    switch (this.props.cellStatuses[rowIdx][colIdx]) {
      case status.green:
        if (this.props.colorBlindMode) {
          return [
            'nm-inset-orange-500',
            'text-gray-50',
          ].join(' ');
        } else {
          return [
            'nm-inset-n-green',
            'text-gray-50',
          ].join(' ');
        }

      case status.yellow:
        if (this.props.colorBlindMode) {
          return [
            'nm-inset-blue-300',
            'text-gray-50',
          ].join(' ');
        } else {
          return [
            'nm-inset-yellow-500',
            'text-gray-50',
          ].join(' ');
        }

      case status.gray:
        return [
          'nm-inset-n-gray',
          'text-gray-50',
        ].join(' ');

      default:
        return [
          'nm-flat-background',
          'dark:nm-flat-background-dark',
          'text-primary',
          'dark:text-primary-dark',
        ].join(' ');
    }
  }

  render() {
    return (
      <div className="flex items-center flex-col py-4">
        <div className="grid grid-cols-5 grid-flow-row gap-4">{
          this.props.board.map((row, rowIdx) => (
            row.map((letter, colIdx) => (
              <span
                key={colIdx}
                className={[
                  `${this.getCellStyles(rowIdx, colIdx, letter)}`,
                  'inline-flex items-center font-medium justify-center text-xl',
                  'w-[14vw] h-[14vw] xs:w-14 xs:h-14 sm:w-20 sm:h-20 rounded',
                ].join(' ')}
              >
                {letter}
              </span>
            ))
          ))
        }</div>
      </div>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Don't use Array(6).fill(Array(5).fill('')), because this will result in
    // each row being the same (===) object.  Overwriting a cell of one row
    // would overwrite the cell in the same column in all rows.
    const board = [];
    for (let rowIdx = 0; rowIdx < 6; rowIdx++) {
      board.push(Array(5).fill(''));
    }

    const day = computeDay();

    this.state = {
      day,
      answer: wordle_answers[day].toUpperCase(),
      board,
      submittedInvalidWord: false,

      // Loaded on mount:
      darkMode: false,
      colorBlindMode: false,
      firstTime: true,  // tied to info modal state
      gameState: state.playing,

      // Unsafe initial state is fine, will be replaced by updateStateFromBoard.
      cellStatuses: Array(6).fill(Array(5).fill(status.unguessed)),
      currentRow: 0,
      currentCol: 0,
      letterStatuses: {},
      wins: 0,
      losses: 0,

      // Modal states:
      settingsModalOpen: false,
      endGameModalOpen: false,
      createModalOpen: false,
    };

    this.savedBooleanSettings = [
      'darkMode',
      'colorBlindMode',
      'firstTime',
    ];
  }

  getDebug(newState) {
    const combinedState = {
      ...this.state,
      ...newState,
    };

    const fromColor = (c) => {
      switch (c) {
        case status.green:
          return 'G';
        case status.yellow:
          return 'Y';
        case status.gray:
          return 'X';
        default:
          return ' ';
      }
    };

    const gameState = combinedState.gameState;
    const cellStatuses = combinedState.cellStatuses
        .map(r => r.map(c => fromColor(c)).join('')).join('\n');
    const letterStatuses = letters
        .map(l => fromColor(combinedState.letterStatuses[l])).join('');
    const board = combinedState.board.map(row => row.join('')).join('\n');

    return {
      gameState,
      cellStatuses,
      letterStatuses,
      board,
    };
  }

  componentDidMount() {
    this.loadSettings();
    const newBoard = this.loadBoardState();
    this.computeWinsAndLosses();

    // This will be -1 for an empty board.
    const {lastRow} = this.updateStateFromBoard(newBoard);
    this.setState({
      currentRow: lastRow + 1,
      currentCol: 0,
    });
  }

  updateStateFromBoard(board) {
    let gameState = state.playing;
    let lastRow = -1;
    const cellStatuses = [];
    const letterStatuses = {};
    for (const letter of letters) {
      letterStatuses[letter] = status.unguessed;
    }

    for (let rowIdx = 0; rowIdx < 6; rowIdx++) {
      const rowStatus = [];

      for (let colIdx = 0; colIdx < 5; colIdx++) {
        const letter = board[rowIdx][colIdx];

        if (letter !== '') {
          lastRow = rowIdx;

          if (letter === this.state.answer[colIdx]) {
            rowStatus.push(status.green);
          } else if (this.state.answer.includes(letter)) {
            rowStatus.push(status.yellow);
          } else {
            rowStatus.push(status.gray);
          }
        }
      }

      // Cell/letter status is not revealed unless the row is complete.
      if (rowStatus.length !== 5) {
        cellStatuses.push(Array(5).fill(status.unguessed));
      } else {
        cellStatuses.push(rowStatus);

        for (let colIdx = 0; colIdx < 5; colIdx++) {
          const letter = board[rowIdx][colIdx];
          if (letterStatuses[letter] !== status.green) {
            letterStatuses[letter] = rowStatus[colIdx];
          }
        }

        if (rowStatus.every((cell) => cell === status.green)) {
          gameState = state.won;
        } else if (lastRow === 5) {
          gameState = state.lost;
        }
      }
    }

    // Open end-game modal if the game is over.
    const endGameModalOpen = gameState !== state.playing;

    const stateChanges = {
      gameState,
      cellStatuses,
      letterStatuses,
      endGameModalOpen,
    };
    this.setState(stateChanges);

    return {
      ...stateChanges,
      lastRow,
    };
  }

  computeWinsAndLosses() {
    const savedStateList = JSON.parse(localStorage.getItem('gameStateList'));

    let wins = 0;
    let losses = 0;

    for (const savedState of (savedStateList || [])) {
      switch (savedState && savedState.gameState) {
        case state.won:
          wins++;
          break;
        case state.lost:
          losses++;
          break;
        default:
          break;
      }
    }

    this.setState({
      wins,
      losses,
    });
  }

  loadBoardState() {
    const savedStateList = JSON.parse(localStorage.getItem('gameStateList'));
    const savedState = savedStateList && savedStateList[this.state.day];
    if (savedState) {
      this.setState({
        board: savedState.board,
      });
      return savedState.board;
    }

    // Old state remains.
    return this.state.board;
  }

  saveBoardState() {
    let savedStateList = JSON.parse(localStorage.getItem('gameStateList'));
    if (!savedStateList) {
      savedStateList = [];
    }
    savedStateList[this.state.day] = {
      board: this.state.board,
      gameState: this.state.gameState,
    };
    localStorage.setItem('gameStateList', JSON.stringify(savedStateList));
  }

  loadSettings() {
    const stateChanges = {};
    for (const setting of this.savedBooleanSettings) {
      const savedValue = JSON.parse(localStorage.getItem(setting));
      if (savedValue !== null) {
        stateChanges[setting] = savedValue;
      }
    }

    this.setState(stateChanges);
  }

  disableState(fieldName) {
    if (this.state[fieldName]) {
      this.toggleState(fieldName);
    }
  }

  toggleState(fieldName) {
    const stateChanges = {};
    stateChanges[fieldName] = !this.state[fieldName];
    this.setState(stateChanges);

    if (this.savedBooleanSettings.includes(fieldName)) {
      localStorage.setItem(fieldName, JSON.stringify(stateChanges[fieldName]));
    }
  }

  getHeaderSymbol() {
    switch (this.state.gameState) {
      case state.won:
        return '✔';
      case state.lost:
        return '✘';
      default:
        return '';
    }
  }

  addLetter(letter) {
    document.activeElement.blur();
    if (this.state.currentCol > 4) {
      return;
    }

    const board = [...this.state.board];
    board[this.state.currentRow][this.state.currentCol] = letter;

    this.setState({
      board,
      currentCol: this.state.currentCol + 1,
      submittedInvalidWord: false
    });
  }

  onEnterPress() {
    const word = this.state.board[this.state.currentRow].join('');
    if (this.state.currentRow === 6) {
      return;
    }
    if (!isValidWord(word)) {
      this.setState({submittedInvalidWord: true});
      return;
    }

    this.setState({
      currentRow: this.state.currentRow + 1,
      currentCol: 0,
    });

    const {gameState} = this.updateStateFromBoard(this.state.board);
    this.saveBoardState();
    this.computeWinsAndLosses();
  }

  onDeletePress() {
    this.setState({submittedInvalidWord: false});

    if (this.state.currentCol === 0) {
      return;
    }

    const board = [...this.state.board];
    board[this.state.currentRow][this.state.currentCol - 1] = '';

    this.setState({
      board,
      currentCol: this.state.currentCol - 1,
    });
  }

  getModalStyles() {
    return {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: this.state.darkMode ? 'hsl(231, 16%, 25%)' : 'hsl(231, 16%, 92%)',
      },
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        height: 'calc(100% - 2rem)',
        width: 'calc(100% - 2rem)',
        backgroundColor: this.state.darkMode ? 'hsl(231, 16%, 25%)' : 'hsl(231, 16%, 92%)',
        boxShadow:
          (this.state.darkMode
            ? '0.2em 0.2em calc(0.2em * 2) #252834, calc(0.2em * -1) calc(0.2em * -1) calc(0.2em * 2) #43475C'
            : '0.2em 0.2em calc(0.2em * 2) #A3A7BD, calc(0.2em * -1) calc(0.2em * -1) calc(0.2em * 2) #FFFFFF'),
        border: 'none',
        borderRadius: '1rem',
        maxWidth: '475px',
        maxHeight: '650px',
        position: 'relative',
      },
    };
  }

  render() {
    const html = document.querySelector('html');
    if (this.state.darkMode) {
      html.setAttribute('class', 'dark-bg');
    } else {
      html.setAttribute('class', 'bg');
    }

    return (
      <div className={this.state.darkMode ? 'dark h-fill' : 'h-fill'}>
        <div className="flex flex-col justify-between h-fill bg-background dark:bg-background-dark">
          <header className="flex items-center py-2 px-3 text-primary dark:text-primary-dark">
            <button className="mr-2" type="button" onClick={() => this.toggleState('settingsModalOpen')}>
              <Settings />
            </button>
            <button type="button" onClick={() => this.toggleState('createModalOpen')}>
              <Create />
            </button>
            <h1 className="flex-1 text-center text-l xxs:text-lg sm:text-3xl tracking-wide font-bold font-og">
              WORDLES WITH FRIENDS {this.getHeaderSymbol()}
            </h1>
            <button className="mr-2" type="button" onClick={() => this.toggleState('endGameModalOpen')}>
              <Share />
            </button>
            <button type="button" onClick={() => this.toggleState('firstTime')}>
              <Info />
            </button>
          </header>
          <Board
            board={this.state.board}
            currentRow={this.state.currentRow}
            submittedInvalidWord={this.state.submittedInvalidWord}
            cellStatuses={this.state.cellStatuses}
            colorBlindMode={this.state.colorBlindMode}
          />
          <InfoModal
            isOpen={this.state.firstTime}
            handleClose={() => this.disableState('firstTime')}
            darkMode={this.state.darkMode}
            colorBlindMode={this.state.colorBlindMode}
            styles={this.getModalStyles()}
          />
          <EndGameModal
            isOpen={this.state.endGameModalOpen}
            handleClose={() => this.disableState('endGameModalOpen')}
            darkMode={this.state.darkMode}
            gameState={this.state.gameState}
            answer={this.state.answer}
            day={this.state.day}
            currentRow={this.state.currentRow}
            cellStatuses={this.state.cellStatuses}
            wins={this.state.wins}
            losses={this.state.losses}
            styles={this.getModalStyles()}
          />
          <SettingsModal
            isOpen={this.state.settingsModalOpen}
            handleClose={() => this.disableState('settingsModalOpen')}
            darkMode={this.state.darkMode}
            colorBlindMode={this.state.colorBlindMode}
            toggleDarkMode={() => this.toggleState('darkMode')}
            toggleColorBlindMode={() => this.toggleState('colorBlindMode')}
            styles={this.getModalStyles()}
          />
          <Keyboard
            letterStatuses={this.state.letterStatuses}
            addLetter={(letter) => this.addLetter(letter)}
            onEnterPress={() => this.onEnterPress()}
            onDeletePress={() => this.onDeletePress()}
            disabled={this.state.gameState !== state.playing}
            colorBlindMode={this.state.colorBlindMode}
          />
        </div>
      </div>
    );
  }
}
