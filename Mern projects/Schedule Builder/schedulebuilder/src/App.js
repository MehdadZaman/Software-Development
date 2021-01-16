import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

import CourseList from './components/courseList.component';
import Schedule from './components/schedule.component';

function App() {
  return (
    <Router>
      <Route path='/' exact component={CourseList} />
      <Route path='/schedule' exact component={Schedule} />
    </Router>
  );
}

export default App;