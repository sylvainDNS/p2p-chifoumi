import styled from '@emotion/styled'
import { useState } from 'react'
import { useHistory } from 'react-router'

const LENGTH = 6

// Generating random room id for the initiating peer
const generateId = () => {
  let result = ''
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let charactersLength = characters.length
  for (let i = 0; i < LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const Home = () => {
  const [roomId, setRoomId] = useState('')
  const history = useHistory()

  const handleJoinRoom = () => {
    if (roomId !== '') history.push(`/chat?room=${roomId}`)
  }

  const handleCreateRoom = () => {
    const id = generateId()
    console.log(id)
    setRoomId(id)
    history.push(`/chat?room=${id}`)
  }

  return (
    <Wrapper>
      <InputWrapper>
        <label>P2P WEBRTC</label>
        <input
          type="text"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        />
      </InputWrapper>
      <ButtonWrapper>
        <button onClick={handleJoinRoom}>Join Room</button>
      </ButtonWrapper>
      <ButtonWrapper>
        <button onClick={handleCreateRoom}>Create Room</button>
        <p>Don't have a Room ID? Create One</p>
      </ButtonWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  flex: 1;
  background-color: '#F8F8FF';
`
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  padding-left: 10px;
  padding-right: 10px;

  label {
    align-self: center;
    font-size: ${24 / 16}rem;
    font-weight: bold;
    margin: 8px;
  }

  input {
    background-color: #fff;
    border-width: 0.5px;
    font-size: ${18 / 16}rem;
    height: 55px;
    padding-left: 15px;
    padding-right: 15px;
  }
`
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;

  button {
    background-color: #007aff;
    color: #fff;
  }

  p {
    align-self: center;
    color: #d3d3d3;
    margin-top: 5px;
  }
`

export default Home
