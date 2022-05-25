import { ReactComponent as Close } from '../data/Close.svg'
import React from 'react';

export class CloseButton extends React.Component {
  render() {
    return (
      <button
        className="absolute top-4 right-4 rounded-full nm-flat-background dark:nm-flat-background-dark text-primary dark:text-primary-dark p-1 w-6 h-6 sm:p-2 sm:h-8 sm:w-8"
        onClick={this.props.onClick}
      >
        <Close />
      </button>
    );
  }
}
