import styled from '@emotion/styled'
import { useLocation } from 'react-router'
import NotFoundError from './NotFoundError'

const useSearchParams = () => {
  const location = useLocation()
  return new URLSearchParams(location.search)
}

const Game = () => {
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')
  const playerName = searchParams.get('playerName')

  if (!roomId) return <NotFoundError element="roomId" />
  if (!playerName) return <NotFoundError element="playerName" />

  return (
    <Wrapper>
      <Board>
        <PlayerChoice>
          <Frame>Pierre</Frame>
          {searchParams.get('playerName')}
        </PlayerChoice>

        <Result>Gagné</Result>

        <PlayerChoice>
          <Frame>Ciseaux</Frame>
          Nathan
        </PlayerChoice>
      </Board>

      <Actions>
        <ActionButton>Pierre</ActionButton>
        <ActionButton>Feuille</ActionButton>
        <ActionButton>Ciseaux</ActionButton>
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
const Frame = styled.div`
  align-items: center;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  min-width: 200px;
  min-height: 200px;
`
const Result = styled.p``

const Actions = styled.article`
  display: flex;
  gap: 8px;
`
const ActionButton = styled.button``

export default Game
