import styled from '@emotion/styled'

const NotFoundError = ({ element, ...delegated }) => (
  <Wrapper>
    <code>{element}</code> not found.
  </Wrapper>
)

const Wrapper = styled.pre``

export default NotFoundError
