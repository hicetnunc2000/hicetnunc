import React from 'react'
import { HicetnuncContext } from '../context/HicetnuncContext'

export class InputDecimal extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = { input: '' }
    this.start = 0
  }
  static contextType = HicetnuncContext

  change = (e) => {
    this.start = e.target.selectionStart
    let val = e.target.value
    val = val.replace(/([^0-9.]+)/, '')
    val = val.replace(/^(0|\.)/, '')
    const match = /(\d{0,7})[^.]*((?:\.\d{0,6})?)/g.exec(val)
    const value = match[1] + match[2]
    e.target.value = value
    this.setState({ input: value })
    if (val.length > 0) {
      e.target.value = Number(value).toFixed(6)
      e.target.setSelectionRange(this.start, this.start)
      this.setState({ input: Number(value).toFixed(6) })
    }

    this.context.tz_per_objkt = this.state.input
  }

  // blur = e => {
  //   const val = e.target.value;
  //   if (val.length > 0) {
  //     e.target.value = Number(val).toFixed(2);
  //     this.setState({ input: e.target.value });
  //   }
  // };

  render() {
    return (
      <div>
        <input
          type="text"
          onBlur={this.blur}
          onChange={this.change}
          value={this.state.input}
          {...this.props}
        />
      </div>
    )
  }
}
