import styled from '@emotion/styled'
import { nanoid } from 'nanoid'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import io from 'socket.io-client/dist/socket.io.js'

const Chat = () => {
  const peerRef = useRef()
  const socketRef = useRef()
  const otherUser = useRef()
  const sendChannel = useRef() // Data channel

  const [messages, setMessages] = useState([])
  const [userMessage, setUserMessage] = useState('')

  const query = useQuery()
  const roomId = query.get('room')

  const Peer = useCallback(userID => {
    /*
       Here we are using Turn and Stun server
       (ref: https://blog.ivrpowers.com/post/technologies/what-is-stun-turn-server/)
    */

    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: `stun:${import.meta.env.VITE_STUN_HOST}`,
        },
        {
          urls: `turn:${import.meta.env.VITE_TURN_HOST}`,
          username: import.meta.env.VITE_TURN_USERNAME,
          credential: import.meta.env.VITE_TURN_PASSWORD,
        },
      ],
    })
    peer.onicecandidate = handleICECandidateEvent
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID)
    return peer
  }, [])

  const callUser = useCallback(
    userID => {
      // This will initiate the call for the receiving peer
      console.log('[INFO] Initiated a call')
      peerRef.current = Peer(userID)
      sendChannel.current = peerRef.current.createDataChannel('sendChannel')

      // listen to incoming messages from other peer
      sendChannel.current.onmessage = handleReceiveMessage
    },
    [Peer]
  )
  const handleOffer = useCallback(
    incoming => {
      /*
      Here we are exchanging config information
      between the peers to establish communication
    */
      console.log('[INFO] Handling Offer')
      peerRef.current = Peer()
      peerRef.current.ondatachannel = event => {
        sendChannel.current = event.channel
        sendChannel.current.onmessage = handleReceiveMessage
        console.log('[SUCCESS] Connection established')
      }

      /*
      Session Description: It is the config information of the peer
      SDP stands for Session Description Protocol. The exchange
      of config information between the peers happens using this protocol
    */
      const desc = new RTCSessionDescription(incoming.sdp)

      /*
       Remote Description : Information about the other peer
       Local Description: Information about you 'current peer'
    */

      peerRef.current
        .setRemoteDescription(desc)
        .then(() => {})
        .then(() => {
          return peerRef.current.createAnswer()
        })
        .then(answer => {
          return peerRef.current.setLocalDescription(answer)
        })
        .then(() => {
          const payload = {
            target: incoming.caller,
            caller: socketRef.current.id,
            sdp: peerRef.current.localDescription,
          }
          socketRef.current.emit('answer', payload)
        })
    },
    [Peer]
  )

  useEffect(() => {
    // Step 1: Connect with the Signal server
    socketRef.current = io.connect(import.meta.env.VITE_SIGNAL_HOST) // Address of the Signal server

    // Step 2: Join the room. If initiator we will create a new room otherwise we will join a room
    socketRef.current.emit('join room', roomId) // Room ID

    // Step 3: Waiting for the other peer to join the room
    socketRef.current.on('other user', userID => {
      callUser(userID)
      otherUser.current = userID
    })

    // Signals that both peers have joined the room
    socketRef.current.on('user joined', userID => {
      otherUser.current = userID
    })

    socketRef.current.on('offer', handleOffer)

    socketRef.current.on('answer', handleAnswer)

    socketRef.current.on('ice-candidate', handleNewICECandidateMessage)
  }, [roomId, callUser, handleOffer])

  const handleNegotiationNeededEvent = userID => {
    // Offer made by the initiating peer to the receiving peer.
    peerRef.current
      .createOffer()
      .then(offer => {
        return peerRef.current.setLocalDescription(offer)
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        }
        socketRef.current.emit('offer', payload)
      })
      .catch(err => console.log('Error handling negotiation needed event', err))
  }

  const handleAnswer = message => {
    // Handle answer by the receiving peer
    const desc = new RTCSessionDescription(message.sdp)
    peerRef.current
      .setRemoteDescription(desc)
      .catch(e => console.log('Error handle answer', e))
  }

  const handleICECandidateEvent = e => {
    /*
      ICE stands for Interactive Connectivity Establishment. Using this
      peers exchange information over the intenet. When establishing a
      connection between the peers, peers generally look for several
      ICE candidates and then decide which to choose best among possible
      candidates
    */
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      }
      socketRef.current.emit('ice-candidate', payload)
    }
  }

  const handleNewICECandidateMessage = incoming => {
    const candidate = new RTCIceCandidate(incoming)

    peerRef.current.addIceCandidate(candidate).catch(e => console.log(e))
  }

  if (!roomId) return <pre>Room ID not found</pre>

  const handleSubmit = e => {
    e.preventDefault()
    console.log(sendChannel)
    console.log(sendChannel.current)
    sendChannel.current.send(e.target.message.value)
    setMessages(previousMessages => [
      ...previousMessages,
      {
        id: nanoid(),
        text: e.target.message.value,
        createdAt: new Date(),
        user: {
          id: 1,
        },
      },
    ])

    setUserMessage('')
  }

  const handleReceiveMessage = e => {
    console.log(`[INFO] Message received from peer: ${e.data}`)

    const message = {
      id: nanoid(),
      text: e.data,
      createdAt: new Date(),
      user: {
        id: 2,
      },
    }

    setMessages(previousMessages => [...previousMessages, message])
  }

  return (
    <Wrapper>
      RoomId : {roomId}
      <Messages>
        {messages.map(message => (
          <Message key={message.id} user={message.user.id}>
            {message.text}
          </Message>
        ))}
      </Messages>
      <InputWrapper onSubmit={handleSubmit}>
        <input
          id="message"
          type="text"
          value={userMessage}
          onChange={e => {
            setUserMessage(e.target.value)
          }}
        />
        <button type="submit">Send</button>
      </InputWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const Messages = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
`
const Message = styled.p`
  align-self: ${p => (p.user === 1 ? 'flex-end' : 'flex-start')};
  border: 1px solid black;
  padding: 8px 10px;
`
const InputWrapper = styled.form``

const useQuery = () => {
  const location = useLocation()
  return new URLSearchParams(location.search)
}

export default Chat
