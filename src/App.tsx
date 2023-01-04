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

import NewLogin, {AddressRes, LoginRes} from './components/NewLogin';
import useLogin from './hooks/useLogin';

import './App.css';

const App: React.FC = () => {
  const { keys, fastestUrl, init, signMetaMask, handleEvent, logout, setKeys } =
    useLogin();
  const [appType, setAppType] = useState(
    window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc']
  );
  const getEthAccount =async (): Promise<AddressRes> => {
    return {
      address: '0x9b6a5a1dd55ea481f76b782862e7df2977dffe6c',
      userExits: false
    }
  }
  const login =async (): Promise<LoginRes> => {
    return {
      success: false,
      msg: 'The password is incorrect',
      code: -1
    }
  }
  const register =async (): Promise<boolean> => {
    return true
  }

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
        <NewLogin login={login} register={register} getEthAccount={getEthAccount}></NewLogin>
      // <Login sign={signMetaMask} handleEvent={handleEvent} setKeys={setKeys} />
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
