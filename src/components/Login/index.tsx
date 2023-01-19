import React, { useState } from 'react';
import { Client, SignClientCallBackType } from 'web3-mq';
import {Modal, Loading, LoginModal, AppTypeEnum} from 'web3-mq-react';
import { Input, Select, message, Steps } from 'antd';

import useToggle from '../../hooks/useToggle';
import { MetaMaskIcon } from '../../icons';
import MPCBtn from '../MPCBtn';

import './index.css';

interface IProps {
  setKeys: any;
  handleEvent: (options: SignClientCallBackType) => void;
  appType?: AppTypeEnum
  mainKeys?: any;
  handleLoginEvent: any;
}

const { Option } = Select;

const { Step } = Steps;

const Login: React.FC<IProps> = (props) => {
  const {  setKeys, handleEvent, appType = AppTypeEnum.pc, handleLoginEvent, mainKeys = null } = props;
  const [step, setStep] = useState<number>(0);
  const [didType, setDidType] = useState<string>('eth');
  const [didValue, setDidValue] = useState<string>(
    '0x7F96DDA344bDbb3747510eE7d0a1f88DD3E60Dc2'
  );
  const [visible, show, hide] = useToggle();
  const [loading, showLoading, hideLoading] = useToggle();

  const handleSelect = (value: string) => {
    setDidType(value);
  };

  const handleInput = (e: any) => {
    setDidValue(e.target.value);
  };

  const signClient = async () => {
    if (!didType || !didValue) {
      message.error('The value is require');
      return;
    }
    showLoading();
    const { data } = await fetch(
      'https://dev-dapp-imdemo.web3mq.com/api/get_dapp_signature/',
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dapp_id: 'web3mq:imdemo',
          topic_id: `${didType}:${didValue}`,
          timestamp: Date.now(),
        }),
      }
    ).then((res) => res.json());
    const { dapp_id, dapp_signature, signature_timestamp, topic_id } = data;

    Client.getSignClient(
      {
        dAppID: dapp_id,
        topicID: topic_id,
        signatureTimestamp: signature_timestamp,
        dAppSignature: dapp_signature,
      },
      handleEvent
    );
    hideLoading();
    setStep(1);
  };

  const sendSignMsg = async () => {
    if (!didType || !didValue) {
      message.error('The value is require');
      return;
    }
    showLoading();
    await Client.signClient.sendDappBridge({
      did_type: didType,
      did_value: didValue,
    });
    hideLoading();
    setStep(2);
  };

  const ModalBtnGroup = () => {
    if (step === 0) {
      return (
        <div className='ModalBtnGroupBtn' onClick={signClient}>
          Temporary Connection
        </div>
      );
    }
    if (step === 1) {
      return (
        <div className='ModalBtnGroupBtn' onClick={sendSignMsg}>
          Send Validation Message
        </div>
      );
    }
    return (
      <div className='tips'>
        Please verify on the phone and note keep the code is consistent
      </div>
    );
  };

  return (
    <div className='login_container'>
      <div className='step_box'>
        <div className='up_text'>Welcome to Web3MQ</div>
        <div className='down_text'>
          Let’s get started with your decentralized trip now!
        </div>
        <div className='step_text'>Step1: Connect Wallet</div>
      </div>
      <div className='button_box'>
        <LoginModal
            containerId={''}
            keys={mainKeys}
            handleLoginEvent={handleLoginEvent}
            appType={appType}
            loginBtnNode={
              <button className="sign_btn">
                <MetaMaskIcon />
                MetaMask
              </button>
            }
        />
        <button onClick={show} className='sign_btn'>
          <img className='btnIcon' src='./web3mq.logo.ico' alt='' />
          <span>Phone verification</span>
        </button>
        <Modal
          title='Phone verification'
          visible={visible}
          closeModal={() => {
            hide();
            setStep(0);
          }}
          dialogClassName='modalContent'>
          <div className='step'>
            <Steps size='small' current={step}>
              <Step title='Create connect' />
              <Step title='Send message' />
              <Step title='Confirm' />
            </Steps>
          </div>
          {loading && (
            <div className='modalLoading'>
              <Loading />
            </div>
          )}
          {step === 0 && !loading && (
            <div className='modalContentBody modalContentBodyInput'>
              <Select
                size='large'
                style={{ width: '60%', height: 42 }}
                value={didType}
                onChange={handleSelect}>
                <Option value='eth'>Eth</Option>
                <Option value='lens.xyz'>Lens</Option>
              </Select>
              <br />
              <Input
                value={didValue}
                onChange={handleInput}
                placeholder='please enter your Did Value'
              />
            </div>
          )}
          {step === 1 && !loading && (
            <div className='modalContentBody modalContentBodyInput'>
              Step2: Send Message
            </div>
          )}
          {step === 2 && !loading && (
            <div className='modalContentBody codeContainer'>
              <div className='code'>
                {Client.signClient.tempCode.split('').map((item, idx) => (
                  <span key={idx} className='codeItem'>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          <ModalBtnGroup />
        </Modal>
        <MPCBtn setKeys={setKeys} />
      </div>
    </div>
  );
};

export default Login;
