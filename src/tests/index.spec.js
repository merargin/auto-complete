import React from 'react';

import { mount, shallow } from 'enzyme';

import sinon from 'sinon';

import chai, { expect } from 'chai';

import AutoComplete from '../components/AutoComplete';

console.log('mount ', mount, ' shallow ', shallow);

import chaiEnzyme from 'chai-enzyme';

import jsdom from 'jsdom';

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');

global.window = global.document.defaultView;

chai.use(chaiEnzyme())


describe('<AutoComplete />', () => {

  let wrapper;

  beforeEach(() => {

    wrapper = shallow(<AutoComplete value="Berlin" onChange={() => {}} />)

  })

  it('renders an input element', () => {

    expect(wrapper.find('input')).to.have.length(1)

  })

  it('renderes an label element', () => {

    expect(wrapper.find('label')).to.have.length(1)

  })

});

describe('AutoComplete callbacks', () => {

  it('calls componentDidMount', () => {

    sinon.spy(AutoComplete.prototype, 'componentDidMount')

    const wrapper = mount(<AutoComplete value="Berlin" onChange={() => {}} />)

    expect(AutoComplete.prototype.componentDidMount.calledOnce).to.equal(true)

  })

});

describe('AutoComplete props', () => {

  it('allows user to set the value of the input through prop', () => {

    const wrapper = mount(<AutoComplete value="Berlin" onChange={() => {}} />)

    expect(wrapper.find('input').props().value).to.equal("Berlin")

  })

});

describe('autocomplete dropdown', () => {

  let wrapper;

  const autocompleteItem = ({ suggestion }) => (<div className="autocomplete-item">{suggestion}</div>)

  beforeEach(() => {

    wrapper = shallow(<AutoComplete value="Berlin" onChange={() => {}} autocompleteItem={autocompleteItem} />)

  })

  it('initially does not have an autocomplete dropdown', () => {

    expect(wrapper.find('#AutoComplete__autocomplete-container')).to.have.length(0)

  })

})

describe('custom classNames, placeholder', () => {

  const classNames = {

    root: 'my-container',

    label: 'my-label',

    input: 'my-input',

    autocompleteContainer: 'my-autocomplete-container'

  }

  let wrapper;

  beforeEach(() => {

    wrapper = shallow(<AutoComplete

                        value="Berlin"

                        onChange={() => {}}

                        classNames={classNames}

                        placeholder="Your Address"

                      />)
  })

  it('lets you set a custom className for the label', () => {

    expect(wrapper.find('label')).to.have.className('my-label')

  })

  it('lets you set a custom className for the input', () => {

    expect(wrapper.find('input')).to.have.className('my-input')

  })

  it('lets you set a custom className for autocomplete container', () => {

    wrapper.setState({ autocompleteItems: [{ suggestion: 'Berlin', placeId: 1, active: false, index: 0 }] })

    expect(wrapper.find('#AutoComplete__autocomplete-container')).to.have.className('my-autocomplete-container')

  })

  it('lets you set a custom placeholder for the input', () => {

    expect(wrapper.find('input').props().placeholder).to.equal('Your Address')

  })

});

describe('customizable autocompleteItem', () => {

  it('lets you provide a custom autocomplete item', () => {

    const autocompleteItem = ({ suggestion }) => (<div className="my-autocomplete-item"><i className="fa fa-map-marker"/></div>)

    const wrapper = shallow(<AutoComplete value="LA" onChange={() => {}} autocompleteItem={autocompleteItem}/>)

    wrapper.setState({ autocompleteItems: [{ full: 'Berlin' }] })

    expect(wrapper.find('.my-autocomplete-item')).to.have.length(1)

    expect(wrapper.find('.my-autocomplete-item')).to.contain(<i className="fa fa-map-marker"/>)

  })

})

describe('custom inline styles', () => {

  let wrapper;

  beforeEach(() => {

    const styles = {

      root: { position: 'absolute' },

      label: { color: 'red' },

      input: { width: '100%' },

      autocompleteContainer: { backgroundColor: 'green' },

      autocompleteItem: { color: 'black' },

      autocompleteItemActive: { color: 'blue' }

    }

    const classNames = {

      root: 'root-element',

      label: 'label-element',

      input: 'input-element',

      autocompleteContainer: 'autocomplete-container'

    }

    wrapper = shallow(<AutoComplete styles={styles} classNames={classNames} value="LA" onChange={() => {}}/>)

  })

  it('lets you set custom styles for the root element', () => {

    expect(wrapper.find('.root-element').props().style.position).to.equal('absolute')

  })

  it('lets you set custom styles for the label element', () => {

    expect(wrapper.find('.label-element').props().style.color).to.equal('red')

  })

  it('lets you set custom styles for the input element', () => {

    expect(wrapper.find('.input-element').props().style.width).to.equal('100%')

  })

  it('lets you set custom styles for the autocomplete container element', () => {

    wrapper.setState({ autocompleteItems: [{ full: 'Berlin, Germany' }] })

    expect(wrapper.find('.autocomplete-container').props().style.backgroundColor).to.equal('green')

  })

  it('lets you set custom styles for autocomplete items', () => {

    wrapper.setState({ autocompleteItems: [{ full: 'Berlin, Germany' }] })

    const item = wrapper.find("#AutoComplete__autocomplete-container").childAt(0)

    expect(item.props().style.color).to.equal('black')

  })

  it('lets you set custom styles for active autocomplete items', () => {

    wrapper.setState({ autocompleteItems: [{ full: 'Berlin, Germany' }] })

    const item = wrapper.find("#AutoComplete__autocomplete-container").childAt(0)

    expect(item.props().style.color).to.equal('black')

  })

})

