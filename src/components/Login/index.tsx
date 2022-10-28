import React, { useState } from 'react';
import { Client, SignClientCallBackType } from 'web3-mq';
import { Modal, Loading } from 'web3-mq-react';

import useToggle from '../../hooks/useToggle';
import { useInput } from '../../hooks/useInput';
import { MetaMaskIcon } from '../../icons';

import './index.css';

interface IProps {
  sign: () => void;
  handleEvent: (options: SignClientCallBackType) => void;
}

const Login: React.FC<IProps> = (props) => {
  const { sign, handleEvent } = props;
  const [step, setStep] = useState<number>(1);
  const [visible, show, hide] = useToggle();
  const [loading, showLoading, hideLoading] = useToggle();

  const { input: input1, setValue: setValue1 } = useInput('eth');
  const { input: input2, setValue: setValue2 } = useInput(
    '0x7F96DDA344bDbb3747510eE7d0a1f88DD3E60Dc2'
  );

  const signClient = async () => {
    const v1 = input1.value;
    const v2 = input2.value;
    if (!v1 || !v2) {
      throw new Error('the value is require');
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
          topic_id: `${v1}:${v2}`,
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
    setStep(2);
  };

  const sendSignMsg = async () => {
    const v1 = input1.value;
    const v2 = input2.value;
    if (!v1 || !v2) {
      throw new Error('the value is require');
    }
    showLoading();
    await Client.signClient.sendDappBridge({
      did_type: v1,
      did_value: v2,
    });
    hideLoading();
    setStep(3);
    setValue1('');
    setValue2('');
  };

  const ModalBtnGroup = () => {
    if (step === 1) {
      return (
        <div className='ModalBtnGroupBtn' onClick={signClient}>
          Temporary Connection
        </div>
      );
    }
    if (step === 2) {
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
        <div className='up_text'>Welcome to SwapChat</div>
        <div className='down_text'>
          Let’s get started with your decentralized social trading trip now!
        </div>
        <div className='step_text'>Step1: Connect Wallet</div>
      </div>
      <div className='button_box'>
        <button onClick={sign} className='sign_btn'>
          <MetaMaskIcon />
          MetaMask
        </button>
        <button onClick={show} className='sign_btn'>
          Phone verification
        </button>
        <Modal
          title='Phone verification'
          visible={visible}
          closeModal={() => {
            hide();
            setStep(1);
            setValue1('');
            setValue2('');
          }}
          dialogClassName='modalContent'>
          {loading && (
            <div className='modalLoading'>
              <Loading />
            </div>
          )}
          {step === 1 && !loading && (
            <div className='modalContentBody modalContentBodyInput'>
              <input
                disabled
                type='text'
                placeholder='please enter your Did Type'
                {...input1}
              />
              <br />
              <input
                type='text'
                placeholder='please enter your Did Value'
                {...input2}
              />
            </div>
          )}
          {step === 2 && !loading && (
            <div className='modalContentBody modalContentBodyInput'>
              <input
                disabled
                type='text'
                placeholder='please enter your Did Type'
                {...input1}
              />
              <br />
              <input
                disabled
                type='text'
                placeholder='please enter your Did Value'
                {...input2}
              />
            </div>
          )}
          {step === 3 && !loading && (
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
      </div>
    </div>
  );
};

export default Login;
