const StateMachine = require('javascript-state-machine')

const fsm = new StateMachine({
  init: 'start',
  transitions: [
    {name: 'chooseCoin', from: 'start', to: 'readyForBill'},
    {name: 'insertBill', from: 'readyForBill', to: 'processingBill'},
    {name: 'processBill', from: 'processingBill', to: 'readyForBill'},
    {name: 'sendCoins', from: 'readyForBill', to: 'waitingForReceipt'},
    {name: 'gotReceipt', from: 'waitingForReceipt', to: 'waitingForCompleted'},
    {name: 'complete', from: 'waitingForCompleted', to: 'start'}
  ],
  methods: {
    onReadyForBill,
    onSendCoins,
    onWaitingForCompleted
  }
})

function onReadyForBill () {
}

function onSendCoins () {
}

function onWaitingForCompleted () {
}
