import { ReactComponent as Close } from '../data/Close.svg'
import { ShareButton } from './ShareButton';
import Modal from 'react-modal'
import React from 'react';

Modal.setAppElement('#root')

export class ShareNewGameModal extends React.Component {
  render() {
    const newGameUrl =
        (new URL('?' + this.props.newGameId, window.location.href)).toString();

    return (
      <Modal isOpen={this.props.isOpen} onRequestClose={this.props.handleClose} style={this.props.styles} contentLabel="Share New Game Modal">
        <div className={`${this.props.darkMode ? 'dark' : ''}`}>
          <button
            className="absolute top-4 right-4 rounded-full nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark p-1 w-6 h-6 sm:p-2 sm:h-8 sm:w-8"
            onClick={this.props.handleClose}
          >
            <Close />
          </button>
          <div className="h-full flex flex-col items-center justify-center max-w-[390px] mx-auto pt-9 text-primary dark:text-primary-dark">
            <div className="flex-1 w-full sm:text-base text-sm">
              <h1 className="text-center sm:text-3xl text-2xl">Now challenge your friends!</h1>
              <div className="pl-5 block sm:text-base text-sm mt-6 mb-5">
                <div className="flex-1 w-full text-center">
                  <a
                    className="text-center underline text-blue-600"
                    href={newGameUrl}
                    target="_blank"
                  >{newGameUrl}</a>
                  <ShareButton
                    shareText={newGameUrl}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
