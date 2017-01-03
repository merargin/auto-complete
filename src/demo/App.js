import React, { Component } from 'react';

import AutoComplete from '../components/AutoComplete';

import config from '../config';

const cssClasses = {

  root: 'form-group',

  label: 'form-label',

  input: 'form-control',

  autocompleteContainer: 'autocomplete-container'

}

class App extends Component {

  constructor(props) {

    super(props);

    this.state = { address: '' };

    this.handleSelect = this.handleSelect.bind(this);

    this.handleChange = this.handleChange.bind(this);

  }

  handleSelect(address) {

    this.setState({ address });

  }

  handleChange(address) {

    this.setState({ address });

  }

  render() {

    const AutocompleteItem = ({ suggestion }) => (<div>{suggestion}</div>);

    return (

      <div className='page-wrapper '>

        <div className='jumbotron'>

          <div className='container'>

            <h1 className='display-3'>Autocomplete Demo</h1>

          </div>

        </div>

        <div className='container'>

          <AutoComplete

            value={this.state.address}

            config={config}

            onChange={this.handleChange}

            onSelect={this.handleSelect}

            classNames={cssClasses}

            autocompleteItem={AutocompleteItem}

          />

        </div>

      </div>

    )

  }

}

export default App
