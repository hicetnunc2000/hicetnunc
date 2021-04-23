import React, { Component } from "react"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import example_img from "url:./large.jpg"

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
          {({
            zoomIn,
            zoomOut,
            resetTransform,
            setDefaultState,
            positionX,
            positionY,
            scale,
            previousScale,
            options: { limitToBounds, transformEnabled, disabled },
            ...rest
          }) => (
            <React.Fragment>
              <div className="tools">
                <button onClick={zoomIn}>zoom in</button>
                <button onClick={zoomOut}>zoom out</button>
                <button onClick={resetTransform}>reset</button>
              </div>
              <div className="element">
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
