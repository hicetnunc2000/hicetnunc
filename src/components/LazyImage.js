import React, { Component } from 'react'

export default class LazyImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      error: false,
    }
  }

  componentDidMount() {
    const img = new Image()
    img.onload = () => {
      this.setState({
        loaded: true,
      })
    }
    img.onerror = () => {
      this.setState({
        error: true,
      })
    }
    img.src = this.props.src
  }

  render() {
    if (this.state.error) {
      return (
        <img
          className={this.props.className}
          style={this.props.style}
          src={this.props.unloadedSrc}
          alt={this.props.alt}
        />
      )
    } else if (!this.state.loaded) {
      return (
        <img
          className={this.props.className}
          style={this.props.style}
          src={this.props.unloadedSrc}
          alt={this.props.alt}
        />
      )
    }
    return (
      <img
        className={this.props.className}
        style={this.props.style}
        src={this.props.src}
        alt={this.props.alt}
      />
    )
  }
}
