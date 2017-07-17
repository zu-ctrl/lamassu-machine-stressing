const chalk = require('chalk')
const _ = require('lodash/fp')

const SimpleCashIn = require('../sessions/simple-cash-in')
const launchMachine = require('./launch-machine')

const bills = [1, 1, 10, 20, 20, 10]

function run () {
  const fsm = new SimpleCashIn(bills)

  initListeners(fsm, launchMachine.emitter)
  initFsmListeners(fsm, launchMachine)
  launchMachine.launch()
}

function browserHandler (fsm, msg) {
  console.log(`${chalk.blue('[browser]')} %j`, msg)

  if (msg.action) {
    const nsAction = _.camelCase(`ws-${msg.action}`)
    console.log(nsAction)
    if (fsm.cannot(nsAction)) return

    fsm[nsAction](msg.data)
    return
  }

  if (!_.isNil(msg.sendOnly)) {
    fsm.processBill()
    return
  }
}

function machineHandler (fsm, msg) {
  console.log(`${chalk.red('[browser]')} %j`, msg)
}

function initListeners (fsm, emitter) {
  emitter.on('browser', msg => browserHandler(fsm, msg))
  emitter.on('machine', msg => machineHandler(fsm, msg))
}

function insertBill (machine, bill) {
  const msg = {command: 'insertBill', denomination: 1}
  machine.sendToMachine(msg)
}

function startTx (machine) {
  const msg = {button: 'start', data: {direction: 'cashIn', cryptoCode: 'BTC'}}
  machine.sendFromBrowser(msg)
}

function sendCoins (machine) {
  const msg = {button: 'sendCoins'}
  machine.sendFromBrowser(msg)
}

function done () {
  console.log('[orchestrator] Finished.')
  process.exit(0)
}

function readyForBill (fsm) {
  const bill = bills.shift()

  console.log('DEBUG100: %j', {bill, bills})

  if (!bill) {
    fsm.sendCoins()
    return
  }

  fsm.insertBill(bill)
}

function initFsmListeners (fsm, machine) {
  fsm.observe('onWsChooseCoin', () => startTx(machine))
  fsm.observe('onReadyForBill', () => readyForBill(fsm, machine))
  fsm.observe('onInsertBill', bill => insertBill(machine, bill))
  fsm.observe('onWaitingForCompleted', () => machine.sendFromBrowser({button: 'completed'}))
  fsm.observe('onSendCoins', () => sendCoins(machine))
  fsm.observe('onCompleted', done)
  fsm.observe('onTransition', lc => console.log('[%s] %s -> %s', lc.transition, lc.from, lc.to))
}

run()
