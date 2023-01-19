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
  const { keys, fastestUrl, init, logout, setKeys, handleEvent, handleLoginEvent } = useLogin();
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
    let mainKeys = null;
    const mainPrivateKey = localStorage.getItem(`MAIN_PRIVATE_KEY`);
    const mainPublicKey = localStorage.getItem(`MAIN_PUBLIC_KEY`);
    const address = localStorage.getItem('WALLET_ADDRESS');
    if (mainPublicKey && mainPrivateKey && address) {
      mainKeys = {
        publicKey: mainPublicKey,
        privateKey: mainPrivateKey,
        walletAddress: address,
      };
    }
    return (
      <Login  setKeys={setKeys} handleEvent={handleEvent} appType={appType}  handleLoginEvent={handleLoginEvent} mainKeys={mainKeys}/>
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
