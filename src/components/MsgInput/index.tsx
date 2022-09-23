import React, { useCallback, useState } from 'react';
import { ChatAutoComplete, useChatContext, Notify } from 'web3-mq-react';
import cx from 'classnames';

import { OpenModalIcon, WarningIcon } from '../../icons';
// import transferImg from '../../image/commingSoonImg.png';

// import SudoSwap from '../SudoSwap';
// import useToggle from '../../hooks/useToggle';

import ss from './index.module.css';

// enum OperaTypeEnum {
//   Transfer = 'Transfer',
//   Sudoswap = 'Sudoswap',
// }

// const operationConfigs = [
//   {
//     type: OperaTypeEnum.Transfer,
//     icon: <TransferIcon />,
//   },
//   {
//     type: OperaTypeEnum.Sudoswap,
//     icon: <SudoSwapIcon />,
//   },
// ];

const MsgInput: React.FC = () => {
  // const { visible, toggle } = useToggle();
  const [visible, setVisible] = useState<boolean>(false);
  // const [modalType, setModalType] = useState<string | undefined>(undefined);
  const { appType } = useChatContext('MsgInput');

  // const operationClicked = (type: string) => {
  //   setModalType(type);
  // };

  const RenderOperation = useCallback(() => {
    return (
      <div className={ss.operationContainer}>
        <div className={ss.operation}>
          {/* {operationConfigs.map((item) => (
            <div
              className={ss.operaItem}
              key={item.type}
              onClick={() => operationClicked(item.type)}
            >
              <div className={ss.iconBox}>{item.icon}</div>
              <div className={ss.title}>{item.type}</div>
            </div>
          ))} */}
          <Notify />
        </div>
        <div className={ss.warning}>
          <WarningIcon className={ss.icon} />
          General smart contract support is coming soon
        </div>
      </div>
    );
  }, []);

  return (
    <>
      <div className={cx(ss.inputBox, { [ss.mobileStyle]: appType === 'h5' })}>
        <OpenModalIcon
          className={cx(ss.auditBox, {
            [ss.close]: visible,
          })}
          onClick={() => setVisible(!visible)}
        />
        <ChatAutoComplete />
      </div>
      {visible && <RenderOperation />}
      {/* <Modal
        visible={modalType !== undefined}
        title={modalType}
        appType={appType}
        closeModal={() => {
          setModalType(undefined);
        }}
      >
        {modalType === OperaTypeEnum.Transfer && (
          <div className={ss.transferContainer}>
            <img src={transferImg} alt="" />
          </div>
        )}
        {modalType === OperaTypeEnum.Sudoswap && <SudoSwap />}
      </Modal> */}
    </>
  );
};

export default MsgInput;
