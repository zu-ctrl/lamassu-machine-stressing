
const machina = require('machina')

const SimpleCashIn = new machina.Fsm({
  initialState: 'start',
  states: {
    start: {wsChooseCoin: 'scanning'},
    scanning: {wsScanned: 'readyForBill'},
    readyForBill: {
      insertBill: 'processingBill',
      sendCoins: 'waitingForReceipt'
    },
    processingBill: {processBill: 'readyForBill'},
    waitingForReceipt: {wsCryptoTransferPending: 'waitingForCompleted'},
    waitingForCompleted: {complete: 'completed'}
  }
})

module.exports = SimpleCashIn
