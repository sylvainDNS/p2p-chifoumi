import styled from '@emotion/styled'

const App = () => (
  <Wrapper>
    <Header>Tic-Tac-Toe</Header>
    <Main></Main>
    <Footer>Nathan & Sylvain - 2021</Footer>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
`
const Header = styled.header`
  text-align: center;
`
const Main = styled.main`
  flex: 1;
`
const Footer = styled.footer`
  text-align: center;
`
export default App