import { CloseButton } from './CloseButton';
import Modal from 'react-modal'
import { Switch } from '@headlessui/react'
import React from 'react';

Modal.setAppElement('#root')

class SettingToggle extends React.Component {
  render() {
    return (
      <Switch.Group as="div" className="flex items-center">
        <Switch
          checked={this.props.on}
          onChange={this.props.toggle}
          className={`${
            this.props.on
              ? 'nm-inset-yellow-500'
              : 'nm-inset-background'
          } ${this.props.darkMode ? 'border-background-dark' : ''} relative inline-flex flex-shrink-0 h-8 w-14 p-1 border-2 rounded-full cursor-pointer transition ease-in-out duration-200`}
        >
          <span
            aria-hidden="true"
            className={`${
              this.props.on
                ? 'translate-x-[1.55rem]'
                : 'translate-x-0'
            } absolute pointer-events-none inline-block top-1/2 -translate-y-1/2 h-5 w-5 shadow rounded-full bg-white transform ring-0 transition ease-in-out duration-200`}
          />
        </Switch>
        <Switch.Label as="span" className="ml-3 cursor-pointer">
          {this.props.label}
        </Switch.Label>
      </Switch.Group>
    );
  }
}

export class SettingsModal extends React.Component {
  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.handleClose}
        style={this.props.styles}
        contentLabel="Settings Modal"
      >
        <div className={`h-full ${this.props.darkMode ? 'dark' : ''}`}>
          <CloseButton onClick={this.props.handleClose} />
          <div
            className={`h-full flex flex-col items-center justify-center max-w-[390px] mx-auto pt-9 text-primary dark:text-primary-dark `}
          >
            <h1 className="text-center mb-4 sm:text-3xl text-2xl">Settings</h1>
            <div className="flex-1 w-full mb-4">
              <SettingToggle
                on={this.props.darkMode}
                toggle={this.props.toggleDarkMode}
                darkMode={this.props.darkMode}
                label="Dark Mode"
              />

              <SettingToggle
                on={this.props.colorBlindMode}
                toggle={this.props.toggleColorBlindMode}
                darkMode={this.props.darkMode}
                label="Color Blind Mode"
              />
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}
