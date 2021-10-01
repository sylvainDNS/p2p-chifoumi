import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import NotFoundError from './NotFoundError'
import io from 'socket.io-client/dist/socket.io.js'
import config from '../config'
import Frame from './Frame'
import { CHOICE, CHOICE_LABEL } from '../constants'
import Result from './Result'

const useSearchParams = () => {
  const location = useLocation()
  return new URLSearchParams(location.search)
}

const handleNegotiationNeededEvent = (socket, otherUserId, peer) => () => {
  peer.current
    .createOffer()
    .then(offer => peer.current.setLocalDescription(offer))
    .then(() => {
      console.log(socket)
      const payload = {
        target: otherUserId,
        caller: socket.id,
        description: peer.current.localDescription,
      }

      socket.emit('offer', payload)
    })
  console.log('negotiation')
}

const handleICECandidateEvent = (socket, otherUserId) => e => {
  if (e.candidate) {
    const payload = {
      target: otherUserId,
      candidate: e.candidate,
    }
    socket.emit('ice-candidate', payload)
    console.log('ICE-candidate')
  }
}

const handleOffer =
  (socket, sendChannel, peer, setOpponentChoice) => payload => {
    console.log('[INFO] Offer received')
    peer.current = createPeer(socket, peer)()
    peer.current.ondatachannel = e => {
      sendChannel.current = e.channel
      sendChannel.current.onmessage = e => setOpponentChoice(e.data)
      console.log('[SUCCESS] Connection established')
    }

    const description = new RTCSessionDescription(payload.description)

    peer.current
      .setRemoteDescription(description)
      .then(() => {})
      .then(localDescription =>
        peer.current.setLocalDescription(localDescription)
      )
      .then(() => {
        const sendingPayload = {
          target: payload.caller,
          caller: socket.id,
          description: peer.current.localDescription,
        }

        socket.emit('answer', sendingPayload)
      })
  }

const handleAnswer = peer => payload => {
  const description = new RTCSessionDescription(payload.description)

  peer.current
    .setRemoteDescription(description)
    .then(() => console.log('[INFO] answer received'))
    .catch(e => console.log('[ERROR] handle answer', e))
}

const handleNewICECandidateMessage = peer => payload => {
  const candidate = new RTCIceCandidate(payload)

  peer.current
    .addIceCandidate(candidate)
    .then(() => console.log('[INFO] ICE candidate set'))
    .catch(e => console.error('[ERROR] ICE candidate', e))
}

const handleSubmitData =
  sendChannel =>
  (data = '') => {
    sendChannel.current.send(data)
  }

const createPeer = (socket, peerRef) => otherUserId => {
  const peer = new RTCPeerConnection({
    iceServers: [
      {
        urls: `stun:${config.stun.host}`,
      },
      {
        urls: `turn:${config.turn.host}`,
        username: config.turn.username,
        credential: config.turn.credential,
      },
    ],
  })

  peer.onnegotiationneeded = handleNegotiationNeededEvent(
    socket,
    otherUserId,
    peerRef
  )
  peer.onicecandidate = handleICECandidateEvent(socket, otherUserId)
  console.log(peer)

  return peer
}

const establishConnection = (
  socket,
  otherUserId,
  sendChannel,
  peerRef,
  setOpponentChoice
) => {
  console.log('[INFO] Initiated a call')
  peerRef.current = createPeer(socket, peerRef)(otherUserId)
  sendChannel.current = peerRef.current.createDataChannel('sendChannel')

  sendChannel.current.onmessage = e => setOpponentChoice(e.data)
}

const Game = () => {
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')
  const playerName = searchParams.get('playerName')
  const sendChannel = useRef()
  const peer = useRef()

  const [otherUserId, setOtherUserId] = useState(null)

  useEffect(() => {
    const socket = io.connect(
      `${config.websocket.host}:${config.websocket.port}`
    )

    socket.emit('join room', roomId)

    socket.on('other user', id => {
      setOtherUserId(id)
      console.log(`Other user: ${id}`)
      establishConnection(socket, id, sendChannel, peer, setOpponentChoice)
    })

    socket.on('user joined', id => {
      setOtherUserId(id)
      console.log(`User joined: ${id}`)
    })

    socket.on(
      'offer',
      handleOffer(socket, sendChannel, peer, setOpponentChoice)
    )

    socket.on('answer', handleAnswer(peer))

    socket.on('ice-candidate', handleNewICECandidateMessage(peer))
  }, [roomId])

  const [playerChoice, setPlayerChoice] = useState('')
  const [opponentChoice, setOpponentChoice] = useState('')

  const handleSubmitChoice = choice => () => {
    setPlayerChoice(choice)
    handleSubmitData(sendChannel)(choice)
  }

  if (!roomId) return <NotFoundError element="roomId" />
  if (!playerName) return <NotFoundError element="playerName" />

  const isDisplayed = playerChoice && opponentChoice

  return (
    <Wrapper>
      <Board>
        <PlayerChoice>
          <Frame choice={playerChoice} />
          {searchParams.get('playerName')}
        </PlayerChoice>

        <Result
          isDisplayed={isDisplayed}
          playerChoice={playerChoice}
          opponentChoice={opponentChoice}
        />

        <PlayerChoice>
          <Frame isDisplayed={isDisplayed} choice={opponentChoice} />
          {otherUserId}
        </PlayerChoice>
      </Board>

      <Actions>
        <ActionButton choice={CHOICE.ROCK} onAction={handleSubmitChoice} />
        <ActionButton choice={CHOICE.PAPER} onAction={handleSubmitChoice} />
        <ActionButton choice={CHOICE.SCISSORS} onAction={handleSubmitChoice} />
      </Actions>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Board = styled.article`
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 40px;
`
const PlayerChoice = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const Actions = styled.article`
  display: flex;
  gap: 8px;
`
const ActionButton = ({ choice, onAction, ...props }) => (
  <button onClick={onAction(choice)} {...props}>
    {CHOICE_LABEL[choice]}
  </button>
)

export default Game
