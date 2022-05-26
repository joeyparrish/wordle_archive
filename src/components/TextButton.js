import React from 'react';

export class TextButton extends React.Component {
  render() {
    return (
      <button
        type="button"
        className="rounded px-6 py-2 mt-8 text-lg nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
        onClick={() => this.props.onClick()}
      >
        {this.props.label}
      </button>
    );
  }
}
