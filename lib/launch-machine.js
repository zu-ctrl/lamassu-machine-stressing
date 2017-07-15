const cp = require('child_process')
const path = require('path')

const WebSocket = require('ws')
const chalk = require('chalk')
const _ = require('lodash/fp')

let ws
let child

const PORT = 10000
const ROOT = path.resolve(__dirname, '..', '..', 'lamassu-machine')
const URL = `ws://127.0.0.1:${PORT}`

function handleChild (msg) {
  console.log(`${chalk.red('[l-m]')} %j`, msg)
}

function handleBrowser (_msg) {
  const msg = JSON.parse(_msg)
  console.log(`${chalk.blue('[browser]')} %j`, msg)

  switch (msg.action) {
    case 'chooseCoin':
      ws.send(JSON.stringify({button: 'start', data: {direction: 'cashIn', cryptoCode: 'BTC'}}))
      break
    case 'scanned':
      child.send({command: 'insertBill', denomination: 1})
      break
    case 'cryptoTransferPending':
      ws.send(JSON.stringify({button: 'completed'}))
      break
  }

  if (!_.isNil(msg.sendOnly)) {
    ws.send(JSON.stringify({button: 'sendCoins'}))
  }
}

function connectWebSocket () {
  ws = new WebSocket(URL)
  ws.on('message', handleBrowser)
  ws.on('error', err => console.log('[WS Err] %s', err.message))
}

function reconnectWebSocket () {
  if (ws.readyState !== WebSocket.CLOSED) return
  connectWebSocket()
}

function launch () {
  const lmPath = path.resolve(ROOT, 'bin', 'lamassu-machine')
  console.log(lmPath)
  const args = [`--port=${PORT}`, '--mockBillValidator', '--mockBillDispenser', '--mockCam']
  const opts = {cwd: ROOT}
  child = cp.fork(lmPath, args, opts)
  child.on('message', handleChild)
  child.on('exit', bail)
  connectWebSocket()
  setInterval(reconnectWebSocket, 100)
}

function bail () {
  console.log('[stresser] Bailing out')
  if (child) child.disconnect()
  process.exit(1)
}

process.on('uncaughtException', bail)
launch()
