import React from 'react';
import { TextButton } from './TextButton';

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

    const combinedText = [
      this.props.shareText,
      this.props.shareUrl,
    ].filter(Boolean).join('\n\n');

    navigator.clipboard.writeText(combinedText);
    setTimeout(() => this.setState({pressed: false}), 3000);

    if (navigator.share) {
      navigator.share({
        title: 'Wordles with Friends',
        text: this.props.shareText ? this.props.shareText + '\n\n' : '',
        url: this.props.shareUrl,
      }).catch((error) => {
        console.error('Failed to share:', error);
      });
    }
  }

  render() {
    return (
      <TextButton
        onClick={() => this.onClick()}
        label={this.state.pressed ? 'Copied!' : (this.props.label || 'Share')}
      />
    );
  }
}
