import React from 'react';
import { status } from '../constants';

export class Board extends React.Component {
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

