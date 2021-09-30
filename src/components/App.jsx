import styled from '@emotion/styled'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Game from './Game'
import Home from './Home'

const App = () => (
  <Wrapper>
    <Header>Chifoumi</Header>
    <Main>
      <Router>
        <Switch>
          <Route path="/game" component={Game} />
          <Route component={Home} />
        </Switch>
      </Router>
    </Main>
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
