import Modal from 'react-modal';
import React from 'react';
import { CloseButton } from './CloseButton';
import { ShareButton } from './ShareButton';
import { state, status } from '../constants';
import Success from '../data/Success.png';
import Fail from '../data/Cross.png';
import WIP from '../data/WIP3.png';

Modal.setAppElement('#root');

export class EndGameModal extends React.Component {
  getShareText() {
    const won = this.props.gameState === state.won;
    const row = won ? this.props.currentRow : 'X';
    const header = `Wordles with Friends ${this.props.gameId} ${row}/6`;

    const map = this.props.cellStatuses.map((row) => {
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

    return header + '\n\n' + map;
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
                <img src={Success} alt="success" height="auto" width="auto" />
                <h1 className=" text-3xl">Congrats!</h1>
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
                <img src={Fail} alt="success" height="auto" width="80%" />
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
                  shareText={this.getShareText()}
                />
              </>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}
