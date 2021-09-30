import styled from '@emotion/styled'
import VisuallyHidden from '@reach/visually-hidden'
import { nanoid } from 'nanoid'
import { useHistory } from 'react-router'

const goToGameWithHistory =
  history =>
  ({ roomId, playerName }) =>
    history.push(`/game?roomId=${roomId}&playerName=${playerName}`)

const Home = () => {
  const history = useHistory()
  const goToGamePage = goToGameWithHistory(history)

  const handleCreate = e => {
    e.preventDefault()

    const roomId = nanoid(8)
    const playerName = document.getElementById('playerName').value

    goToGamePage({ roomId, playerName })
  }
  const handleJoin = e => {
    e.preventDefault()

    const roomId = document.getElementById('roomId').value
    const playerName = document.getElementById('playerName').value

    goToGamePage({ roomId, playerName })
  }

  return (
    <Wrapper>
      <label>
        Name:
        <input id="playerName" type="text" />
      </label>
      <Button type="button" onClick={handleCreate}>
        Create room
      </Button>
      <FieldWrapper>
        <Button type="button" onClick={handleJoin}>
          Join room
        </Button>
        <VisuallyHidden>
          <label htmlFor="roomId">Room ID</label>
        </VisuallyHidden>
        <input id="roomId" type="text" />
      </FieldWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: auto;
  max-width: 400px;
`
const FieldWrapper = styled.fieldset`
  display: flex;
`

const Button = styled.button``

export default Home
