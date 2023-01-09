import React, { useEffect, useState } from 'react';
import { Client } from 'web3-mq';
import {
  Chat,
  Channel,
  DashBoard,
  AppTypeEnum,
  Window,
  MessageHeader,
  MessageList,
  MessageInput,
} from 'web3-mq-react';
import 'web3-mq-react/dist/css/index.css';
import MsgInput from './components/MsgInput';
import Login from "./components/Login";

import useLogin from './hooks/useLogin';

import './App.css';

const App: React.FC = () => {
  const { keys, fastestUrl, init, getEthAccount, logout, login, register, setKeys, handleEvent } = useLogin();
  const [appType, setAppType] = useState(
    window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc']
  );

  useEffect(() => {
    init();
    document.getElementsByTagName('body')[0].setAttribute('data-theme', 'light');
    window.addEventListener('resize', () => {
      setAppType(
        window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc']
      );
    });
  }, []);

  if (!keys) {
    return (
      <Login  login={login} register={register} getEthAccount={getEthAccount} setKeys={setKeys} handleEvent={handleEvent}/>
    );
  }

  if (!fastestUrl) {
    return null;
  }

  const client = Client.getInstance(keys);

  return (
    <Chat client={client} appType={appType} logout={logout}>
      <DashBoard />
      <Channel>
        <Window>
          <MessageHeader avatarSize={40} />
          <MessageList />
          <MessageInput Input={MsgInput} />
        </Window>
        {/* <Thread />
        <AllThreadList /> */}
      </Channel>
    </Chat>
  );
};

export default App;
