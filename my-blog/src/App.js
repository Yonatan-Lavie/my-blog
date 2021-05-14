import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import ArticlesListPage from './pages/ArticlesListPage';
import AboutPage from './pages/AboutPage';
import NavBar from './NavBar';
import NotFoundPage from './pages/NotFoundPage'
function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div id="page-body">
          <Switch>
            <Route path="/" component={HomePage} exact/>
            <Route path="/article/:name" component={ArticlePage} />
            <Route path="/articles-list" component={ArticlesListPage} />
            <Route path="/about" component={AboutPage} />
            <Route component={NotFoundPage} />
          </Switch>

        </div>

      </div>
    </Router>

  );
}

export default App;
