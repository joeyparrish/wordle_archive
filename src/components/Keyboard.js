import { keyboardLetters, status, letters } from '../constants'
import React from 'react';
import { ReactComponent as DeleteKey } from '../data/DeleteKey.svg';

class KeyboardKey extends React.Component {
  getKeyStyle() {
    switch (this.props.letterStatuses[this.props.letter]) {
      case status.green:
        if (this.props.colorBlindMode) {
          return 'bg-orange-500 text-gray-50';
        } else {
          return 'bg-n-green text-gray-50';
        }

      case status.yellow:
        if (this.props.colorBlindMode) {
          return 'bg-blue-300 text-gray-50';
        } else {
          return 'bg-yellow-500 text-gray-50';
        }

      case status.gray:
        return 'bg-n-gray dark:bg-gray-700 text-gray-50';

      default:
        return 'dark:bg-n-gray text-primary dark:text-primary-dark';
    }
  }

  onLetterPress(letter) {
    this.handleKeyDown(new KeyboardEvent('keydown', {
      key: letter,
    }));
  }

  render() {
    return (
      <button
        onClick={() => this.props.onClick(this.props.letter)}
        key={this.props.letter}
        className="h-10 xxs:h-14 w-[2rem] sm:w-10 mx-[3.5px] text-sm font-medium rounded-[4px] nm-flat-background-sm dark:nm-flat-background-dark-sm"
      >
        <div
          className={`h-full w-full rounded-[3px] flex items-center justify-center ${this.getKeyStyle()}`}
        >
          {this.props.letter}
        </div>
      </button>
    );
  }
}

class KeyboardRow extends React.Component {
  render() {
    return (
      <div key={this.props.idx} className="w-full flex justify-center my-[5px]">
        {this.props.idx === 2 && (
          <button
            onClick={this.props.onEnterPress}
            className="h-10 xxs:h-14 w-12 px-1 text-xs font-medium mx-[3.5px] rounded nm-flat-background-sm dark:nm-flat-background-dark-sm text-primary dark:text-primary-dark"
          >
            ENTER
          </button>
        )}
        {this.props.row.map((letter) => (
          <KeyboardKey
            letter={letter}
            letterStatuses={this.props.letterStatuses}
            colorBlindMode={this.props.colorBlindMode}
            onClick={this.props.onLetterPress}
          />
        ))}
        {this.props.idx === 2 && (
          <button
            onClick={this.props.onDeletePress}
            className="h-10 xxs:h-14 w-12 flex items-center justify-center nm-flat-background-sm dark:nm-flat-background-dark-sm text-primary dark:text-primary-dark mx-[3.5px] text-sm  rounded"
          >
            <DeleteKey className="h-6 w-6" />
          </button>
        )}
      </div>
    );
  }
}

export class Keyboard extends React.Component {
  render() {
    return (
      <div className="w-full flex flex-col items-center mb-3 select-none">
        {keyboardLetters.map((row, idx) => (
          <KeyboardRow
            row={row}
            idx={idx}
            letterStatuses={this.props.letterStatuses}
            colorBlindMode={this.props.colorBlindMode}
            onEnterPress={this.props.onEnterPress}
            onDeletePress={this.props.onDeletePress}
            onLetterPress={(letter) => this.onLetterPress(letter)}
          />
        ))}
      </div>
    );
  }

  componentDidMount() {
    this.handleKeyDownBound = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDownBound);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDownBound);
    this.handleKeyDownBound = null;
  }

  handleKeyDown(event) {
    if (this.props.disabled) return;

    const letter = event.key.toUpperCase();

    if (letters.includes(letter)) {
      this.props.addLetter(letter);
    } else if (letter === 'ENTER') {
      this.props.onEnterPress();
      event.preventDefault()
    } else if (letter === 'BACKSPACE') {
      this.props.onDeletePress();
    }
  }
}
