import Modal from 'react-modal';
import React from 'react';
import { CloseButton } from './CloseButton';
import { ShareButton } from './ShareButton';
import { TextButton } from './TextButton';
import { state, status } from '../constants';
import Success from '../data/Success.png';
import Fail from '../data/Cross.png';
import WIP from '../data/WIP3.png';

Modal.setAppElement('#root');

export class EndGameModal extends React.Component {
  getShareText() {
    const won = this.props.gameState === state.won;
    const row = won ? this.props.currentRow : 'X';
    const header = `Wordles with Friends\n${this.props.gameId} ${row}/6`;
    return header + '\n\n' + this.getBoardMapAsText();
  }

  getBoardMapAsText() {
    return this.props.cellStatuses.map((row) => {
      if (row.every((item) => item !== status.unguessed)) {
        return row.map((state) => {
          switch (state) {
            case status.gray:
              return this.props.darkMode ? '⬛' : '⬜';
            case status.green:
              return '🟩';
            case status.yellow:
              return '🟨';
            default:
              return '  ';
          }
        }).join('') + '\n';
      } else {
        return '';
      }
    }).join('');
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.handleClose}
        style={this.props.styles}
        contentLabel="Game End Modal"
      >
        <div className={this.props.darkMode ? 'dark' : ''}>
          <CloseButton onClick={this.props.handleClose} />
          <div className="h-full flex flex-col items-center justify-center max-w-[300px] mx-auto text-primary dark:text-primary-dark">
            {this.props.gameState === state.won && (
              <>
                <img src={Success} alt="success" className="h-48" />
                <h1 className="text-3xl">Congrats!</h1>
                <div className="mt-3">{this.props.gameId}</div>
                <pre className="mt-3">{this.getBoardMapAsText()}</pre>
                <p className="mt-3 text-2xl">
                  Won: {this.props.wins}
                </p>
                <p className="mt-3 text-2xl">
                  Lost: {this.props.losses}
                </p>
              </>
            )}
            {this.props.gameState === state.lost && (
              <>
                <img src={Fail} alt="success" className="h-48" />
                <div className="text-primary dark:text-primary-dark text-4xl text-center">
                  <p>Oops!</p>
                  <p className="mt-3 text-2xl">
                    The word was <strong>{this.props.answer}</strong>
                  </p>
                  <p className="mt-3 text-2xl">
                    Won: {this.props.wins}
                  </p>
                  <p className="mt-3 text-2xl">
                    Lost: {this.props.losses}
                  </p>
                </div>
              </>
            )}
            {this.props.gameState === state.playing && (
              <>
                <img src={WIP} alt="keep playing" height="auto" width="80%" />
                <div className="text-primary dark:text-primary-dark text-4xl text-center">
                  <p className="mt-3 text-2xl">
                    Won: {this.props.wins}
                  </p>
                  <p className="mt-3 text-2xl">
                    Lost: {this.props.losses}
                  </p>
                </div>
              </>
            )}
            {this.props.gameState !== state.playing && (
              <>
                <ShareButton
                  label="Share Results"
                  shareText={this.getShareText()}
                />
                <TextButton
                  label="Create Your Own"
                  onClick={() => window.open('?', '_blank')}
                />
              </>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}
