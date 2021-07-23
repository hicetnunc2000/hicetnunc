import React, { Component, createRef } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import './app.scss'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.domElement = createRef()
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
      mute: true,
    }
  }

  toggleSetting(type) {
    this.setState((p) => ({ [type]: !p[type] }))
  }

  toggleAudio = () => {
    const { mute } = this.state
    if (!mute) {
      this.domElement.current.pause()
      this.domElement.current.currentTime = 0
    } else {
      this.domElement.current.play()
    }
    this.toggleSetting('mute')
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
      mute,
    } = this.state

    return (
      <>
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

                    <div onClick={this.toggleAudio} className="icon audio">
                      {mute ? (
                        <svg viewBox="0 0 16 16">
                          <g transform="translate(2 2) scale(0.8)">
                            <polygon
                              points="10,16 10,0 3,5 0,5 0,11 3,11 "
                              fill="#999999"
                            />
                            <polygon
                              points="14.646,5.646 13,7.293 11.354,5.646 10.646,6.354 12.293,8 10.646,9.646 11.354,10.354 13,8.707 14.646,10.354   15.354,9.646 13.707,8 15.354,6.354 "
                              fill="#999999"
                            />
                          </g>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 16 16">
                          <g transform="translate(2 2) scale(0.8)">
                            <polygon
                              points="10,16 10,0 3,5 0,5 0,11 3,11 "
                              fill="#999999"
                            />
                            <path
                              d="M11,13.91c2.837-0.477,5-2.938,5-5.91s-2.163-5.433-5-5.91v1.011C13.279,3.566,15,5.585,15,8s-1.721,4.434-4,4.899V13.91z"
                              fill="#999999"
                            />
                            <path
                              d="M11,9.722v1.094c1.163-0.413,2-1.512,2-2.816s-0.837-2.403-2-2.816v1.094C11.595,6.625,12,7.263,12,8  C12,8.737,11.595,9.375,11,9.722z"
                              fill="#999999"
                            />
                          </g>
                        </svg>
                      )}
                    </div>
                  </div>
                  {type && (
                    <TransformComponent>
                      <img
                        className="zoom"
                        src="large.jpg"
                        alt="example-element"
                      />
                    </TransformComponent>
                  )}
                </div>
              </React.Fragment>
            )}
          </TransformWrapper>
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
          <audio ref={this.domElement} loop>
            <source src="audio.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </>
    )
  }
}
