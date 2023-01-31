import React from 'react';
import cx from 'classnames';
import { 
  Channel,
  MessageConsole,
  MessageHeader,
  MessageList,
  MessageInput,
  Notification,
  Window,
  useChatContext
} from '@web3mq/react-components';
import MsgInput from '../MsgInput';

import './index.css';

const Main = () => {
  const { activeNotification } = useChatContext('Main');

  return (
    <>
      <Channel className={cx({
        'hide': activeNotification
      })}>
        <Window>
          <MessageHeader avatarSize={40} />
          <MessageList />
          {/* <MessageInput Input={MsgInput} /> */}
          <MessageConsole Input={<MessageInput Input={MsgInput} />} />
        </Window>
      </Channel>
      <Notification />
    </>
  )
};
export default Main;