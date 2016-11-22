import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ExchangeList} from '../components';

@connect(state => ({
  currencyList: state.currencyList
}))
export default class ExchListApp extends Component {

  static propTypes = {
    currency: PropTypes.object.isRequired
  }

  render () {
    const { currencyList: {currency} } = this.props;

    return (
      <div>
        <div className='exchListApp'>
          <h1>Exchange</h1>
        </div>
        <ExchangeList currency={currency}/>
      </div>
    );
  }
}
