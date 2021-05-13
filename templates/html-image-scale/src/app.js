import React, { Component } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import example_img from 'url:./large.jpg'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: true,
      limitToBounds: true,
      panningEnabled: true,
      transformEnabled: true,
      pinchEnabled: true,
      limitToWrapper: false,
      disabled: false,
      dbClickEnabled: true,
      lockAxisX: false,
      lockAxisY: false,
      velocityEqualToMove: true,
      enableWheel: true,
      enableTouchPadPinch: true,
      enableVelocity: true,
      limitsOnWheel: false,
    }
  }

  toggleSetting(type) {
    this.setState((p) => ({ [type]: !p[type] }))
  }

  render() {
    const {
      type,
      limitToBounds,
      panningEnabled,
      transformEnabled,
      pinchEnabled,
      limitToWrapper,
      disabled,
      dbClickEnabled,
      lockAxisX,
      lockAxisY,
      velocityEqualToMove,
      enableWheel,
      enableTouchPadPinch,
      enableVelocity,
      limitsOnWheel,
    } = this.state
    return (
      <div className="container">
        <TransformWrapper
          options={{
            limitToBounds,
            transformEnabled,
            disabled,
            limitToWrapper,
          }}
          pan={{
            disabled: !panningEnabled,
            lockAxisX,
            lockAxisY,
            velocityEqualToMove,
            velocity: enableVelocity,
          }}
          pinch={{ disabled: !pinchEnabled }}
          doubleClick={{ disabled: !dbClickEnabled }}
          wheel={{
            wheelEnabled: enableWheel,
            touchPadEnabled: enableTouchPadPinch,
            limitsOnWheel,
          }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <React.Fragment>
              <div className="element">
                <div className="tools">
                  <div onClick={zoomIn} className="icon">
                    <svg viewBox="0 0 32 32">
                      <circle
                        cx="14"
                        cy="14"
                        fill="none"
                        r="9"
                        stroke="#999999"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                      />
                      <line
                        fill="none"
                        stroke="#999999"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                        x1="27"
                        x2="20.366"
                        y1="27"
                        y2="20.366"
                      />
                      <line
                        fill="none"
                        stroke="#999999"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                        x1="14"
                        x2="14"
                        y1="10"
                        y2="18"
                      />
                      <line
                        fill="none"
                        stroke="#999999"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                        x1="10"
                        x2="18"
                        y1="14"
                        y2="14"
                      />
                    </svg>
                  </div>
                  <div onClick={zoomOut} className="icon">
                    <svg viewBox="0 0 32 32">
                      <circle
                        cx="14"
                        cy="14"
                        fill="none"
                        r="9"
                        stroke="#999999"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                      />
                      <line
                        fill="none"
                        stroke="#999999"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                        x1="27"
                        x2="20.366"
                        y1="27"
                        y2="20.366"
                      />
                      <line
                        fill="none"
                        id="XMLID_128_"
                        stroke="#999999"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                        x1="10"
                        x2="18"
                        y1="14"
                        y2="14"
                      />
                    </svg>
                  </div>
                  <div onClick={resetTransform} className="icon">
                    <svg viewBox="0 0 48 48">
                      <path
                        d="M24 10V2L14 12l10 10v-8c6.63 0 12 5.37 12 12s-5.37 12-12 12-12-5.37-12-12H8c0 8.84 7.16 16 16 16s16-7.16 16-16-7.16-16-16-16z"
                        fill="#999999"
                      />
                    </svg>
                  </div>
                </div>
                {type && (
                  <TransformComponent>
                    <img
                      className="zoom"
                      src={example_img}
                      alt="example-element"
                    />
                  </TransformComponent>
                )}
              </div>
            </React.Fragment>
          )}
        </TransformWrapper>
      </div>
    )
  }
}
