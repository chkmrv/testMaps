
import omit from 'lodash/object/omit';
import assign from 'lodash/object/assign';
import mapValues from 'lodash/object/mapValues';

let exchangeRates = () => {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://openexchangerates.org/api/latest.json?app_id=081342762b8642c19b84dd01562a6fc0', false);
  xhr.send();
  if (xhr.status != 200) {
    console.log( xhr.status);
  } else {
    initialState.currency = JSON.parse(xhr.responseText);
  }
}

const initialState = {
  currency: {}
}

setInterval(() => {exchangeRates()}, 30000 );
exchangeRates();

export default function choose(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
