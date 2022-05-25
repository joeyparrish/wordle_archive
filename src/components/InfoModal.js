import { ReactComponent as Github } from '../data/Github.svg';
import { ReactComponent as Create } from '../data/Create.svg';
import { CloseButton } from './CloseButton';
import Modal from 'react-modal';
import React from 'react';

Modal.setAppElement('#root');

export class InfoModal extends React.Component {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} onRequestClose={this.props.handleClose} style={this.props.styles} contentLabel="Game Info Modal">
        <div className={`${this.props.darkMode ? 'dark' : ''}`}>
          <CloseButton onClick={this.props.handleClose} />
          <div className="h-full flex flex-col items-center justify-center max-w-[390px] mx-auto pt-9 text-primary dark:text-primary-dark">
            <div className="flex-1 w-full sm:text-base text-sm">
              <h1 className="text-center sm:text-3xl text-2xl">What is this?</h1>
              <ul className="list-disc pl-5 block sm:text-base text-sm">
                <li className="mt-6 mb-2">
                  It's <a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a>, but <strong>you</strong> choose the word and challenge your friends to solve it!
                </li>
              </ul>

              <h1 className="mt-6 text-center sm:text-3xl text-2xl">How do I challenge a friend?</h1>
              <ul className="list-disc pl-5 block sm:text-base text-sm">
                <li className="mt-6 mb-2">Click the <Create className="inline h-6 w-6" /> icon on the main page.</li>
                <li className="mb-2">Type a valid word and press ENTER.</li>
                <li className="mb-2">Copy the generated link and send it to your friends.</li>
              </ul>

              <h1 className="mt-6 text-center sm:text-3xl text-2xl">How do I play?</h1>
              <ul className="list-disc pl-5 block sm:text-base text-sm">
                <li className="mt-6 mb-2">You have 6 guesses to guess the correct word.</li>
                <li className="mb-2">You can guess any valid word.</li>
                <li className="mb-2">{
                  `After each guess, each letter will turn ${this.props.colorBlindMode ? 'orange, blue or gray.' : 'green, yellow, or gray.'}`
                }
                </li>
              </ul>

              <div className="mb-3 mt-8 flex items-center">
                <span className={`${this.props.colorBlindMode ? 'nm-inset-orange-500' : 'nm-inset-n-green'} text-gray-50 inline-flex items-center justify-center text-3x w-10 h-10 rounded-full`}>
                  W
                </span>
                <span className="mx-2">=</span>
                <span>Correct letter, correct spot</span>
              </div>
              <div className="mb-3">
                <span className={`${this.props.colorBlindMode ? 'nm-inset-blue-300' : 'nm-inset-yellow-500'} text-gray-50 inline-flex items-center justify-center text-3x w-10 h-10 rounded-full`}>
                  W
                </span>
                <span className="mx-2">=</span>
                <span>Correct letter, wrong spot</span>
              </div>
              <div className="mb-3">
                <span className="nm-inset-n-gray text-gray-50 inline-flex items-center justify-center text-3x w-10 h-10 rounded-full">
                  W
                </span>
                <span className="mx-2">=</span>
                <span>Wrong letter</span>
              </div>

              <h1 className="mt-6 text-center sm:text-3xl text-2xl">Credits</h1>
              <ul className="list-disc pl-5 block sm:text-base text-sm">
                <li className="mt-6 mb-2">
                  Built on <a className="underline text-blue-600 dark:text-amber-300" href="https://www.devangthakkar.com/">Devang Thakkar's</a> <a className="underline text-blue-600 dark:text-amber-300" href="https://github.com/DevangThakkar/wordle_archive">Wordle Archive</a>,
                  which was built on <a className="underline text-blue-600 dark:text-amber-300" href="https://twitter.com/katherinecodes">Katherine Peterson</a>'s <a className="underline text-blue-600 dark:text-amber-300" href="https://octokatherine.github.io/word-master">WordMaster</a>.
                </li>
                <li className="mt-6 mb-2">
                  Made with love by <a className="underline text-blue-600 dark:text-amber-300" href="https:///github.com/joeyparrish">Joey Parrish</a>.
                </li>
              </ul>

              <div className="flex justify-center sm:text-base text-sm">
                <span>This project is open source on</span>
                <a
                  className="ml-[6px] rounded-full h-5 w-5 sm:h-6 sm:w-6"
                  href="https://github.com/joeyparrish/wordles-with-friends"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
