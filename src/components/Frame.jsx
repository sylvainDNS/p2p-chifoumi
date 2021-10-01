import styled from '@emotion/styled'
import { CHOICE_LABEL } from '../constants'

const Frame = ({ choice, isDisplayed = true, ...delegated }) => (
  <Wrapper {...delegated}>{isDisplayed ? CHOICE_LABEL[choice] : null}</Wrapper>
)

const Wrapper = styled.div`
  align-items: center;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  min-width: 200px;
  min-height: 200px;
`

export default Frame
