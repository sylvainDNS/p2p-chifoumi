import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Chat from './Chat'
import Home from './Home'

const P2P = () => (
  <Router>
    <Switch>
      <Route path="/chat" component={Chat} />
      <Route path="/" component={Home} />
    </Switch>
  </Router>
)

export default P2P
