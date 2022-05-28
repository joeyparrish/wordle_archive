import React from 'react'
import { letters, status, state } from './constants'
import words from './data/words'

import { ReactComponent as Create } from './data/Create.svg'
import { ReactComponent as Info } from './data/Info.svg'
import { ReactComponent as Settings } from './data/Settings.svg'
import { ReactComponent as Share } from './data/Share.svg'

import { Board } from './components/Board'
import { InfoModal } from './components/InfoModal'
import { SettingsModal } from './components/SettingsModal'
import { EndGameModal } from './components/EndGameModal'
import { ShareNewGameModal } from './components/ShareNewGameModal'
import { Keyboard } from './components/Keyboard'
import { decrypt, encrypt, codeToWord, wordToCode } from './cipher'

function isValidWord(word) {
  return words[word.toLowerCase()];
}

function computeGameId() {
  const { search } = document.location;

  if (search) {
    return search.slice(1);
  }

  return '';
}

function computeAnswer(gameId) {
  if (!gameId) {
    return '';
  }

  const answer = decrypt(codeToWord(gameId));
  if (answer.length !== 5 || !isValidWord(answer)) {
    return '';
  }

  return answer;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const gameId = computeGameId();
    const answer = computeAnswer(gameId);
    const createMode = answer === '';

    // Don't use Array(6).fill(Array(5).fill('')), because this will result in
    // each row being the same (===) object.  Overwriting a cell of one row
    // would overwrite the cell in the same column in all rows.
    const board = [];
    // In create mode, we only display one row.
    for (let rowIdx = 0; rowIdx < (createMode ? 1 : 6); rowIdx++) {
      board.push(Array(5).fill(''));
    }

    this.state = {
      gameId,
      answer,
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
      createMode,
      shareNewGameModalOpen: false,
      newGameId: '',
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

    const {currentRow, gameState} = combinedState;
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
      currentRow,
    };
  }

  componentDidMount() {
    this.loadSettings();

    if (this.state.answer) {
      const newBoard = this.loadBoardState();
      this.computeWinsAndLosses();

      // This will be -1 for an empty board.
      const {lastRow} = this.updateStateFromBoard(newBoard);
      this.setState({
        currentRow: lastRow + 1,
        currentCol: 0,
      });
    }
  }

  updateStateFromBoard(board) {
    let gameState = state.playing;
    let lastRow = -1;
    const cellStatuses = [];
    const letterStatuses = {};
    for (const letter of letters) {
      letterStatuses[letter] = status.unguessed;
    }

    for (let rowIdx = 0; rowIdx < this.state.board.length; rowIdx++) {
      const numLetters = board[rowIdx].filter(Boolean).length;
      if (numLetters !== 5) {
        // Cell/letter status is not revealed unless the row is complete.
        cellStatuses.push(Array(5).fill(status.unguessed));
      } else {
        lastRow = rowIdx;

        // Okay, so, it turns out that this shit is complicated.
        //
        // If the answer is:
        //   PARES
        // but you guess:
        //   PRESS
        // the colors should be:
        //   YYY_G
        //
        // Although the first S is in the word, it should be gray, not yellow.
        // Since there's only one S, and there's a green S in the right place,
        // the other S should _NOT_ be yellow.
        //
        // Because of this, we mark them in multiple passes, and use info about
        // which letters from your guess have been matched.

        // Track how many times each letter appears in the guess.
        const guess = board[rowIdx];
        const unmatchedLetters = {};
        for (const letter of this.state.answer) {
          if (letter in unmatchedLetters) {
            unmatchedLetters[letter] += 1;
          } else {
            unmatchedLetters[letter] = 1;
          }
        }

        // Start with everything gray.
        const rowStatus = Array(5).fill(status.gray);

        // Mark the green ones first, and count down in unmatchedLetters.
        for (let colIdx = 0; colIdx < 5; colIdx++) {
          const letter = board[rowIdx][colIdx];
          if (letter === this.state.answer[colIdx]) {
            rowStatus[colIdx] = status.green;
            unmatchedLetters[letter] -= 1;
          }
        }

        // Now you can mark the yellow ones.
        for (let colIdx = 0; colIdx < 5; colIdx++) {
          const letter = board[rowIdx][colIdx];
          if (rowStatus[colIdx] == status.gray &&
              this.state.answer.includes(letter) &&
              unmatchedLetters[letter]) {
            rowStatus[colIdx] = status.yellow;
          }
        }

        // Push the row status.
        cellStatuses.push(rowStatus);

        // Update letter statuses on the keyboard.
        for (let colIdx = 0; colIdx < 5; colIdx++) {
          const letter = board[rowIdx][colIdx];
          if (letterStatuses[letter] !== status.green) {
            letterStatuses[letter] = rowStatus[colIdx];
          }
        }

        // Update game status if applicable.
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
    const savedStates = JSON.parse(localStorage.getItem('gameStates'));

    let wins = 0;
    let losses = 0;

    for (const gameId in (savedStates || {})) {
      const savedState = savedStates[gameId];
      switch (savedState.gameState) {
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
    const savedStates = JSON.parse(localStorage.getItem('gameStates'));
    const savedState = savedStates && savedStates[this.state.gameId];
    if (savedState) {
      this.setState({
        board: savedState.board,
      });
      return savedState.board;
    }

    // Old state remains.
    return this.state.board;
  }

  saveBoardState(gameState) {
    let savedStates = JSON.parse(localStorage.getItem('gameStates'));
    if (!savedStates) {
      savedStates = {};
    }
    savedStates[this.state.gameId] = {
      board: this.state.board,
      gameState: this.state.gameState,
    };
    localStorage.setItem('gameStates', JSON.stringify(savedStates));
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
    if (this.state.createMode) {
      const word = this.state.board[0].join('');

      if (!isValidWord(word)) {
        this.setState({submittedInvalidWord: true});
        return;
      }

      // In creation mode, once you enter a valid word, you "win", and you get
      // to see the dialog to share your word to challenge your friends.

      // Since the ID has a time-based element, don't update it once we compute
      // one.  This way, you can close the share dialog, hit "enter", and get
      // back to the same game ID in the share dialog.
      const newGameId = this.state.newGameId || wordToCode(encrypt(word));

      this.setState({
        currentRow: 2,  // So cellStatuses will affect the first row
        cellStatuses: [Array(5).fill(status.green)],
        newGameId,
        shareNewGameModalOpen: true,
      });

      return;
    }

    if (this.state.currentRow === 6) {
      return;
    }

    const word = this.state.board[this.state.currentRow].join('');
    if (!isValidWord(word)) {
      this.setState({submittedInvalidWord: true});
      return;
    }

    this.setState({
      currentRow: this.state.currentRow + 1,
      currentCol: 0,
    });

    const {gameState} = this.updateStateFromBoard(this.state.board);
    this.saveBoardState(gameState);
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

  openCreateMode() {
    window.open('?', '_blank');
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
            <button type="button" className={this.state.createMode ? 'invisible' : ''} onClick={() => this.openCreateMode()}>
              <Create />
            </button>
            <h1 className="flex-1 text-center xxs:text-lg sm:text-3xl tracking-wide font-bold font-og">
              WORDLES WITH FRIENDS
            </h1>
            <button className={this.state.createMode ? 'invisible' : 'mr-2'} type="button" onClick={() => this.toggleState('endGameModalOpen')}>
              <Share />
            </button>
            <button type="button" onClick={() => this.toggleState('firstTime')}>
              <Info />
            </button>
          </header>
          <header className="flex items-center py-2 px-3 text-primary dark:text-primary-dark">
            <h2 className="flex-1 text-center font-og font-bold">
              {
                this.state.createMode ?
                    "ENTER A WORD TO CHALLENGE YOUR FRIENDS" :
                    this.state.gameId + " " + this.getHeaderSymbol()
              }
            </h2>
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
            gameId={this.state.gameId}
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
          <ShareNewGameModal
            isOpen={this.state.shareNewGameModalOpen}
            handleClose={() => this.disableState('shareNewGameModalOpen')}
            darkMode={this.state.darkMode}
            newGameId={this.state.newGameId}
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
