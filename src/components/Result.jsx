import styled from '@emotion/styled'
import { CHOICE } from '../constants'

const RESULT = {
  WON: 'won',
  LOST: 'lost',
  EQUALITY: 'equality',
}

const RESULT_LABEL = {
  [RESULT.WON]: 'GAGNÉ',
  [RESULT.LOST]: 'PERDU',
  [RESULT.EQUALITY]: 'ÉGALITÉ',
}

const getResult = (playerChoice, opponentChoice) => {
  const comparedChoice = comparer(playerChoice, opponentChoice)

  switch (comparedChoice) {
    case 1:
      return RESULT.WON
    case -1:
      return RESULT.LOST
    default:
      return RESULT.EQUALITY
  }
}

const comparer = (a, b) => {
  if (a === b) return 0

  if (a === CHOICE.ROCK) {
    if (b === CHOICE.PAPER) return -1
    if (b === CHOICE.SCISSORS) return 1
  }

  if (a === CHOICE.PAPER) {
    if (b === CHOICE.SCISSORS) return -1
    if (b === CHOICE.ROCK) return 1
  }

  if (a === CHOICE.SCISSORS) {
    if (b === CHOICE.ROCK) return -1
    if (b === CHOICE.PAPER) return 1
  }
}

const Result = ({ isDisplayed = false, playerChoice, opponentChoice }) => (
  <Wrapper>
    {isDisplayed ? RESULT_LABEL[getResult(playerChoice, opponentChoice)] : null}
  </Wrapper>
)

const Wrapper = styled.p``

export default Result
