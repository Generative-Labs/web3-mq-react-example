import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppTypeEnum, Button, ButtonType, MqButton } from 'web3-mq-react';
import {
  DesktopIcon,
  MobileIcon,
  ViewAllIcon,
  WalletConnectIcon,
  WalletMetaMaskIcon,
} from '../../../../icons';

import ss from './index.module.scss';
import { StepStringEnum } from '../../index';
import web3mqIcon from '../../../../assets/web3mqIcon.svg';
import walletConnectIcon from '../../../../assets/walletConnectIcon.svg';

interface IProps {
  setStep: any;
  setHeaderTitle: any;
  step: StepStringEnum;
}

const StepOne: React.FC<IProps> = (props) => {
  const { setStep, setHeaderTitle, step } = props;
  useEffect(() => {
    setHeaderTitle('Connect Dapp');
  }, []);

  return (
    <div className={ss.container}>
      {step === StepStringEnum.HOME && (
        <div className={ss.stepOneBox}>
          <div className={ss.contentBox}>
            <div className={ss.top}>
              <div className={ss.icon}>
                <DesktopIcon />
              </div>
              <div>Desktop</div>
            </div>
            <div className={ss.walletBox}>
              <div
                className={ss.walletItem}
                onClick={() => {
                  setHeaderTitle('Choose Desktop wallets');
                  setStep(StepStringEnum.LOGIN_MODAL);
                }}
              >
                <div className={ss.walletIcon}>
                  <WalletMetaMaskIcon />
                </div>
                <div className={ss.walletName}>MetaMask</div>
              </div>
              {/*<div*/}
              {/*    className={ss.walletItem}*/}
              {/*    onClick={() => {*/}
              {/*      setHeaderTitle('Choose Desktop wallets');*/}
              {/*      setStep(StepStringEnum.VIEW_ALL);*/}
              {/*    }}*/}
              {/*>*/}
              {/*  <div className={ss.walletIcon}>*/}
              {/*    <ViewAllIcon />*/}
              {/*  </div>*/}
              {/*  <div className={ss.walletName}>View All</div>*/}
              {/*</div>*/}
            </div>
          </div>
          <div className={ss.contentBox}>
            <div className={ss.top}>
              <div className={ss.icon}>
                <MobileIcon />
              </div>
              <div className={ss.title}>Mobile</div>
            </div>
            <div className={ss.btnsBox}>
              <MqButton className={ss.btn}>
                <img src={web3mqIcon} className={ss.icon} alt="" />
                Web3MQ
              </MqButton>
              <MqButton className={ss.btn}>
                <img src={walletConnectIcon} className={ss.icon} alt="" />
                WalletConnect
              </MqButton>
            </div>
          </div>
        </div>
      )}
      {step === StepStringEnum.VIEW_ALL && (
        <div>
          Step two
          <Button
            onClick={() => {
              setStep(StepStringEnum.LOGIN_MODAL);
            }}
          >
            next
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepOne;
