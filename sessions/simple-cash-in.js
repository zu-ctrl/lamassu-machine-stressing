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
  ],
  data: bills => ({bills, iteration: 0}),
  methods: {
    onReadyForBill
  }
})

module.exports = SimpleCashIn

function onReadyForBill () {
  const bill = this.bills[this.iteration]

  console.log('DEBUG100: %j', {bill, bills: this.bills})

  if (!bill) {
    this.iteration = 0
    this.sendCoins()
    return
  }

  this.iteration = this.iteration + 1
  this.insertBill(bill)
}
