import React, { Component, PropTypes } from 'react';
import mapValues from 'lodash/object/mapValues';

export default class ExchangeList extends Component {
  static propTypes = {
    currency: PropTypes.object.isRequired
  }
  
  render () {
    let {currency} = this.props;
    return (
      <div>
        <ul className="currencyRates">
          <li className="rate_box">
            <div className='part-6 currencyName'>
                <p>1 GBP</p>
                <span className='balance'>balance 0$</span>
            </div>
            <div className='part-6 currencyRate'>
              <p className='infoRate'>{Number(currency.rates["GBP"]).toFixed(3)} USD</p>
            </div>
          </li>
          <li className="rate_box">
            <div className='part-6 currencyName'>
                <p> 1 EUR</p>
                <span className='balance'>balance 0$</span>
            </div>
            <div className='part-6 currencyRate'>
              <p className='infoRate'>{Number(currency.rates["EUR"]).toFixed(3)} USD</p>
              <a className='info'>
                <p>{this.props.rates}</p>
              </a>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
