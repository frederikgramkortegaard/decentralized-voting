import React, { useState, useEffect, ref } from 'react';
import { PollComponent, PollForm } from './components/pollComponents';
import { makePoll, getPollComponentFromAddress, _initial_load } from './blocklogic';

function App() {

  _initial_load()


  return (
    <div>
      <div id="pollsList"></div>
      <PollForm createPoll={makePoll} />
    </div >
  );
}

export default App;
