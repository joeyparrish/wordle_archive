import React from 'react';

export class ShareButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pressed: false,
    };
  }

  onClick() {
    this.setState({
      pressed: true,
    });
    navigator.clipboard.writeText(this.props.shareText);
    setTimeout(() => this.setState({pressed: false}), 3000);
  }

  render() {
    return (
      <button
        type="button"
        className="rounded px-6 py-2 mt-8 text-lg nm-flat-background dark:nm-flat-background-dark hover:nm-inset-background dark:hover:nm-inset-background-dark text-primary dark:text-primary-dark"
        onClick={() => this.onClick()}
      >
        {this.state.pressed ? 'Copied!' : 'Share'}
      </button>
    );
  }
}
