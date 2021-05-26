import React from "react"
import "./styles/simple-select.scss"
import "./styles/simple-select-options.scss"
import "./styles/simple-select-cancel.scss"

import "./styles/simple-select-display.css"
import "./styles/simple-select-legend.css"
import "./styles/simple-select-openArrow.css"


// Code from https://github.com/shaefer/react-simple-select#readme (MIT License)
export class SimpleSelect extends React.Component {
    constructor(props) {
      const createTime = new Date().getTime();
      super(props);
      this.optionContainerRef = React.createRef();
      this.dropdownButton = React.createRef();
      this.optionSelected = this.optionSelected.bind(this);
      this.cancelSelection = this.cancelSelection.bind(this);
      this.openSelect = this.openSelect.bind(this);
      this.handleOutsideOptionsClick = this.handleOutsideOptionsClick.bind(this);
      this.handleKeyboard = this.handleKeyboard.bind(this);
      this.renderOption = this.renderOption.bind(this);
      this.renderOptionLabel = this.renderOptionLabel.bind(this);
      this.setOption = this.setOption.bind(this);
  
      const optionValidation = this.checkOptionType(props.options);
  
  
      //add index to each option for ease of rendering and value retrieval (this is what allows us to let value be any data type)
      const initialOptions = props.options ? props.options : [];
      const optionsWithIndexProp = initialOptions.map((x, idx) => {
        x._idx = idx;
        return x;
      });
      const blankValue = { value: "", label: "" };
      const defaultValue =
        props.defaultValue &&
        optionsWithIndexProp.find(x => x.value === props.defaultValue)
          ? optionsWithIndexProp.find(x => x.value === props.defaultValue)
          : blankValue;
  
      this.state = {
        createTime: createTime,
        blankValue: blankValue,
        validOptions: optionValidation.valid,
        invalidReason: optionValidation.reason,
        currentOptionSelected: defaultValue,
        //add in initial currentOptionIndex
        legendLabel: props.legendLabel ? props.legendLabel : "",
        selectOpen: false,
        options: optionsWithIndexProp,
        width: props.width ? props.width : "",
        focusedOptionIndex: 0,
      };
    }
  
    componentDidMount() {
      document.addEventListener("mousedown", this.handleOutsideOptionsClick);
      document.addEventListener("keydown", this.handleKeyboard);
      const finishTime = new Date().getTime();
      // console.log(
      //   `Id: ${this.props.id} CreateTime: ${finishTime - this.state.createTime}ms`
      // );
    }
  
    componentWillUnmount() {
      document.removeEventListener("mousedown", this.handleOutsideOptionsClick);
      document.removeEventListener("keydown", this.handleKeyboard);
    }
  
    checkOptionType(options) {
      if (!Array.isArray(options))
        return { valid: false, reason: "Illegal options. Expected an array." };
      //check first item as a courtesy
      const opt1 = options[0];
      if (
        !(
          typeof opt1 === "object" &&
          opt1.value !== undefined &&
          opt1.label !== undefined
        )
      ) {
        console.error(
          "Options expected to be objects with at least 2 props 'value' and 'label'",
          opt1
        );
        return {
          valid: false,
          reason:
            "Options expected to be objects with at least 2 props 'value' and 'label'"
        };
      }
      return {
        valid: true,
        reason: ""
      };
    }
  
    handleOutsideOptionsClick(e) {
      //console.log("outside Click handler", e.target, this.dropdownButton);
      const clickContainsOptionContainer =
        this.optionContainerRef.current &&
        this.optionContainerRef.current.contains(e.target);
      const clickContainsDropDownButton =
        this.dropdownButton.current &&
        this.dropdownButton.current.contains(e.target);
      if (!clickContainsOptionContainer && !clickContainsDropDownButton) {
        this.setState({
          ...this.state,
          focusedOptionIndex: 0,
          selectOpen: false
        });
      }
    }
  
    handleKeyboard(e) {
      if (this.state.selectOpen) {
        //find current focused/hovered item and move relative to that.
        const maxOptionIndex = this.state.options.length - 1;
        if (e.key === 'ArrowDown') {
          const newIndex = this.state.focusedOptionIndex === maxOptionIndex ? 0 : this.state.focusedOptionIndex + 1;
          this.optionContainerRef.current.querySelector(`div[index="${newIndex}"]`).scrollIntoViewIfNeeded(false);
          this.setState({
            ...this.state,
            focusedOptionIndex: newIndex
          })
        }
        if (e.key === 'ArrowUp') {
          const newIndex = (this.state.focusedOptionIndex === 0) ? maxOptionIndex : this.state.focusedOptionIndex - 1;
          this.optionContainerRef.current.querySelector(`div[index="${newIndex}"]`).scrollIntoViewIfNeeded(true);
          this.setState({
            ...this.state,
            focusedOptionIndex: newIndex
          })
        }
        if (e.key === 'Enter') {
          const optionIndex = this.state.focusedOptionIndex;
          const optionByIndex = this.state.options[optionIndex];
          if (this.props.onChange) {
            this.props.onChange(e, optionByIndex.value, optionByIndex);
          }
          this.setOption(optionByIndex, optionIndex);
        }
      }
    }
  
    findOptionWrapper(el) {
      if (el.getAttribute("index")) return el;
      return this.findOptionWrapper(el.parentNode);
    }
  
    optionSelected(e) {
      const optionWrapper = this.findOptionWrapper(e.target)
      const optionIndex = parseInt(optionWrapper.getAttribute("index"), 10);
      const optionByIndex = this.state.options[optionIndex];
      if (this.props.onChange) {
        this.props.onChange(e, optionByIndex.value, optionByIndex);
      }
      this.setOption(optionByIndex, optionIndex);
    }
  
    setOption(option, knownIndex) {
      const index = (knownIndex) ? knownIndex : this.state.options.findIndex(opt => opt.value === option.value && opt.label === option.label);
      this.setState({
        ...this.state,
        currentOptionSelected: option,
        currentOptionIndex: index,
        focusedOptionIndex: 0, //reset focus
        selectOpen: false //resetOpen
      });
    }
  
    openSelect(e) {
      const selectOpen = this.state.selectOpen;
      this.setState({
        ...this.state,
        selectOpen: !selectOpen
      });
    }
  
    cancelSelection(e) {
      if (this.props.onChange) {
        this.props.onChange(e);
      }
      this.setState({
        ...this.state,
        currentOptionSelected: this.state.blankValue,
        focusedOptionIndex: 0,
        selectOpen: false
      });
      e.stopPropagation(); //since cancel and dropdown are part of same dom tree we don't want the open/close to fire as well.
    }
  
    renderOptionLabel(opt) {
      if (this.props.renderOptionLabel && opt !== this.state.blankValue) {
        return this.props.renderOptionLabel(opt);
      } else {
        return opt.label;
      }
    }
  
    renderOption(opt) {
      const focusedClass = opt._idx === this.state.focusedOptionIndex ? ' focused_option' : '';
      return (
        <div
          onClick={this.optionSelected}
          key={`_select_opts${opt._idx}`}
          index={opt._idx}
          className={`select_option${focusedClass}`}
        >
          {this.renderOptionLabel(opt)}
        </div>
      );
    }
  
    render() {
      if (!this.state.validOptions)
        return <div>Invalid Options: {this.state.invalidReason}</div>;
      const opts = this.state.options.map(x => {
        return this.renderOption(x);
      });
  
      const style = {
        width: this.state.width ? this.state.width : "100%",
        display: this.props.inline ? 'inline-block' : 'block'
      };
      const fixedHeightClassName = this.props.fixedHeight ? "fixedHeight" : "";
      const cornerClassName = this.props.hasSharpCorners ? "" : "roundedCorners";
      const selectOpenClosedClass = this.state.selectOpen ? "selectOpen" : "selectClosed";
      const valueSelected = this.state.currentOptionSelected.value === "" ? "" : "valueSelected";
      const coreCssClassNames = ['simple-select', selectOpenClosedClass, valueSelected, fixedHeightClassName, cornerClassName];
      const cancelButton = (
        <div className="cancelContainer" onClick={this.cancelSelection}>
          <div className="cancelContent">
            <svg
              aria-hidden="true"
              focusable="false"
              height="20"
              viewBox="0 0 20 20"
              width="20"
            >
              <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z" />
            </svg>
          </div>
        </div>
      );
      const cancelSection = this.props.nonCancelable ? '' : cancelButton;
      return (
        <div className={coreCssClassNames.filter(x => x).join(" ")} style={style}>
          <div className="fieldset">
            <div className="legend">{this.state.legendLabel}</div>
            <div className="mainSectionWrapper" onClick={this.openSelect} ref={this.dropdownButton}>
              <div className="selectedDisplay">
                {this.renderOptionLabel(this.state.currentOptionSelected)}
              </div>
              {cancelSection}
              <div className="downArrowContainer">
                <div className="downArrowContent">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    height="20"
                    viewBox="0 0 20 20"
                    width="20"
                  >
                    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
                  </svg>
                </div>
              </div>
            </div>
            <div
              className={`simple-select-options`}
              ref={this.optionContainerRef}
            >
              {opts}
            </div>
          </div>
        </div>
      );
    }
  }
  
  export default SimpleSelect;
  