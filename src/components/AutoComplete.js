import React, { Component } from 'react';

import Keys from '../constants/Keys';

import defaultStyles from '../styles/defaultStyles';

class AutoComplete extends Component {

  constructor(props) {

    super(props);

    this.state = { autocompleteItems: [] };

    this.autocompleteCallback = this.autocompleteCallback.bind(this);

    this.handleInputKeyDown = this.handleInputKeyDown.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);

  }

  componentDidMount(){}

  /* Getting auto complete suggestions from server */

  autocompleteService(input, callback){

    fetch(this.props.config.END_POINT+input)

    .then(response => response.json())

    .then((response) => {

      callback(response); //Providing suggestions to create AutoComplete options

    });

  }

  /* Assigning the suggestions received from the server to create AutoComplete  */

  autocompleteCallback(predictions) {

    this.setState({

      autocompleteItems: predictions.map((p, idx) => ({

        suggestion: p.full,

        placeId: p.id,

        active: false,

        index: idx

      }))

    });

  }

  /* Removing the AutoComplete  */

  clearAutocomplete() {

    this.setState({ autocompleteItems: [] });

  }

  /* Setting selected address in the search input area */

  selectAddress(address) {

    this.clearAutocomplete();

    this._handleSelect(address);

  }

  _handleSelect(address) {

    this.props.onSelect ? this.props.onSelect(address) : this.props.onChange(address);

  }

  _getActiveItem() {

    return this.state.autocompleteItems.find(item => item.active);

  }

  _selectActiveItemAtIndex(index) {

    const activeName = this.state.autocompleteItems.find(item => item.index === index).suggestion;

    this._setActiveItemAtIndex(index);

    this.props.onChange(activeName);

  }

  _handleEnterKey() {

    const activeItem = this._getActiveItem();

    if (activeItem !== undefined) {

      this.clearAutocomplete();

      this._handleSelect(activeItem.suggestion);

    }

  }

  _handleDownKey() {

    const activeItem = this._getActiveItem();

    const nextIndex = activeItem === undefined ? 0: (activeItem.index + 1) % this.state.autocompleteItems.length

    this._selectActiveItemAtIndex(nextIndex);

  }

  _handleUpKey() {

    const activeItem = this._getActiveItem();

    if (activeItem === undefined) {

      this._selectActiveItemAtIndex(this.state.autocompleteItems.length - 1);

    } else {

      let prevIndex;

      if (activeItem.index === 0) {

        prevIndex = this.state.autocompleteItems.length - 1;

      } else {

        prevIndex = (activeItem.index - 1) % this.state.autocompleteItems.length;

      }

      this._selectActiveItemAtIndex(prevIndex);

    }

  }

  handleInputKeyDown(event) {

    switch (event.keyCode) {

      case Keys.ENTER_KEY:

        event.preventDefault();

        this._handleEnterKey();

        break;

      case Keys.ARROW_DOWN:

        this._handleDownKey();

        break;

      case Keys.ARROW_UP:

        this._handleUpKey();

        break;

      case Keys.ESCAPE:

        this.clearAutocomplete();

        break;

    }

  }

  _setActiveItemAtIndex(index) {

    this.setState({ autocompleteItems: this.state.autocompleteItems.map((item, idx) => {

      return { ...item, active: idx === index }

      }),

    })

  }

  handleInputChange(event) {

    this.props.onChange(event.target.value);

    if(event.target.value){

      this.autocompleteService( event.target.value , this.autocompleteCallback);

    } else {

      this.clearAutocomplete();

      return;

    }

  }

  autocompleteItemStyle(active) {

    return active ? { ...defaultStyles.autocompleteItemActive, ...this.props.styles.autocompleteItemActive } : {};

  }

  renderLabel() {

    const { styles, classNames } = this.props;

    return (<label style={styles.label} className={classNames.label || ''}>Search location</label>);

  }

  renderOverlay() {

    if(this.state.autocompleteItems.length > 0) {

      return (

        <div style={defaultStyles.autocompleteOverlay} onClick={() => this.clearAutocomplete()}></div>

      )

    }

  }

  renderAutocomplete() {

    const { autocompleteItems } = this.state;

    const { styles } = this.props;

    if (autocompleteItems.length === 0) {

      return null;

    }

    /* Rendering the AutoComplete options */

    return (

      <div

        id="AutoComplete__autocomplete-container"

        className={this.props.classNames.autocompleteContainer || ''}

        style={{ ...defaultStyles.autocompleteContainer, ...styles.autocompleteContainer }}>

        {autocompleteItems.map((p, idx) => (

          <div

            key={p.placeId}

            onMouseOver={() => this._setActiveItemAtIndex(p.index)}

            onClick={() => this.selectAddress(p.suggestion)}

            style={{ ...defaultStyles.autocompleteItem, ...styles.autocompleteItem, ...this.autocompleteItemStyle(p.active) }}>

            {this.props.autocompleteItem({ suggestion: p.suggestion })}

          </div>

        ))}

      </div>

    )

  }

  /* Rendering the AutoComplete input search area */

  render () {

    const { classNames, placeholder, styles, value } = this.props;

    return (

      <div

        style={{ ...defaultStyles.root, ...styles.root }}

        className={classNames.root || classNames.container || ''}

      >

        {this.renderLabel()}

        <input

          type="text"

          placeholder={placeholder}

          className={classNames.input || ''}

          value={value}

          onChange={this.handleInputChange}

          onKeyDown={this.handleInputKeyDown}

          style={styles.input}

        />

        {this.renderOverlay()}

        {this.renderAutocomplete()}

      </div>

    )

  }
}

AutoComplete.propTypes = {

    value: React.PropTypes.string.isRequired,

    onChange: React.PropTypes.func.isRequired,

    onSelect: React.PropTypes.func,

    placeholder: React.PropTypes.string,

    autocompleteItem: React.PropTypes.func,

    config: React.PropTypes.object,

    classNames: React.PropTypes.shape({

      root: React.PropTypes.string,

      label: React.PropTypes.string,

      input: React.PropTypes.string,

      autocompleteContainer: React.PropTypes.string,

    }),

    styles: React.PropTypes.shape({

      root: React.PropTypes.object,

      label: React.PropTypes.object,

      input: React.PropTypes.object,

      autocompleteContainer: React.PropTypes.object,

      autocompleteItem: React.PropTypes.object,

      autocompleteItemActive: React.PropTypes.object

    })

}

/* Assigning default props for the component */

AutoComplete.defaultProps = {

    placeholder: 'Address',

    classNames: {},

    autocompleteItem: ({ suggestion }) => (<div>{suggestion}</div>),

    styles: {}
}

export default AutoComplete
