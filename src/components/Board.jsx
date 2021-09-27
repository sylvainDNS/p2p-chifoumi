import styled from '@emotion/styled'
import Square from './Square'

const Board = () => (
  <Wrapper style={{ margin: '20px' }}>
    <Row>
      <Square />
      <Square />
      <Square />
    </Row>
    <Row>
      <Square />
      <Square />
      <Square />
    </Row>
    <Row>
      <Square />
      <Square />
      <Square />
    </Row>
  </Wrapper>
)

const Wrapper = styled.div``
const Row = styled.div`
  display: flex;
`

export default Board
