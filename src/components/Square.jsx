import styled from '@emotion/styled'
import { COLORS } from './GlobalStyle'

const STYLES = {
  X: {
    '--color': COLORS.blue1,
  },
  O: {
    '--color': COLORS.orange1,
  },
}

const Square = ({ value, ...delegated }) => {
  const styles = STYLES[value]

  return (
    <Wrapper style={styles} {...delegated}>
      {value}
    </Wrapper>
  )
}

const Wrapper = styled.button`
  background-color: transparent;
  border: 1px solid ${COLORS.grey1};
  border-radius: 0;
  color: var(--color);
  font-size: ${32 / 16}rem;
  font-weight: bold;
  height: 50px;
  margin: 0;
  padding: 0;
  width: 50px;
`

export default Square
