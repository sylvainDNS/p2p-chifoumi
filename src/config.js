const config = {
  websocket: {
    host: 'localhost',
    port: 9000,
  },
  turn: {
    host: 'numb.viagenie.ca',
    username: 'sylvain.denyse@knplabs.com',
    credential: import.meta.env.VITE_APP_TURN_CREDENTIAL,
  },
  stun: {
    host: 'stun.stunprotocol.org',
  },
}

export default config
