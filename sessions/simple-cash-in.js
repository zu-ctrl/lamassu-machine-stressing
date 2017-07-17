const StateMachine = require('javascript-state-machine')

const SimpleCashIn = StateMachine.factory({
  init: 'init',
  transitions: [
    {name: 'wsChooseCoin', from: 'init', to: 'scanning'},
    {name: 'wsScanned', from: 'scanning', to: 'readyForBill'},
    {name: 'insertBill', from: 'readyForBill', to: 'processingBill'},
    {name: 'processBill', from: 'processingBill', to: 'readyForBill'},
    {name: 'sendCoins', from: 'readyForBill', to: 'waitingForReceipt'},
    {name: 'wsCryptoTransferPending', from: 'waitingForReceipt', to: 'waitingForCompleted'},
    {name: 'complete', from: 'waitingForCompleted', to: 'completed'}
  ]
})

module.exports = SimpleCashIn
