import React from 'react';

class PasswordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value : ""};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <input type="password" name={this.props.name} value={this.state.value} onChange={this.handleChange} />
    );
  }
}

class TextInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value : ""};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <input type="text" name={this.props.name} value={this.state.value} onChange={this.handleChange} />
    );
  }
}

class SubmitInput extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <input type="submit" name={this.props.name} text={this.props.text} />
    );
  }
}


export {
  PasswordInput,
  TextInput,
  SubmitInput
}
