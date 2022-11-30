import React, { useEffect, useState } from 'react';
import { Modal } from 'web3-mq-react';
import { Button, Form, Input, message, Spin } from 'antd';
import { sha3_224 } from 'js-sha3';
import {
  getUserInfoRequest,
  GenerateEd25519KeyPair,
  getCurrentDate,
  LoginParams,
  userLoginRequest,
} from 'web3-mq';

import useToggle from '../../hooks/useToggle';
import './index.css';

interface IProos {
  setKeys: (props: any) => void;
}

const MPCBtn = (props: IProos) => {
  const { setKeys } = props;
  const [visible, show, hide] = useToggle();
  const [step, setStep] = useState('login');
  const [signStep, setSignStep] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('TOKEN'));

  const request = async (url: string, params?: any) => {
    const data = await fetch(`https://dev-mpc.web3mq.com/mpc${url}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        JWT: token || '',
      },
      body: params ? JSON.stringify(params) : '',
    }).then((res) => res.json());
    console.log(data);
    if (data.code === 400) {
      message.error(data.msg);
      setToken(null);
      setSignStep(null);
      localStorage.removeItem('TOKEN');
      return;
    }
    return data;
  };

  const register = async (values: any) => {
    setLoading(true);
    const data = await request('/signup', values);
    if (data.code === 0) {
      message.success('register success');
      setStep('login');
    } else {
      message.error(data.msg);
    }
    setLoading(false);
  };

  const create = async () => {
    const data = await request('/create', { threadhold: 3 });
    if (data.code === 0) {
      return data.data;
    } else {
      message.error(data.msg);
    }
  };

  const login = async (values: any) => {
    setLoading(true);
    const data = await request('/login', values);
    if (data.code === 0) {
      message.success('login success');
      localStorage.setItem('TOKEN', data.data);
      setToken(data.data);
    } else {
      message.error(data.msg);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token && visible) {
      getWalletAddress();
    }
  }, [token, visible]);

  const getWalletAddress = async () => {
    setSignStep('Please wait while I get the wallet address');
    const data = await fetch(`https://dev-mpc.web3mq.com/mpc`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        JWT: token || '',
      },
    }).then((res) => res.json());
    if (data.code === 0) {
      signMPC(data.data);
    } else {
      // 如果没找到address
      const address = await create();
      await signMPC(address);
    }
  };

  const signMPC = async (address: string) => {
    setSignStep('Please wait while signing');
    const signContentURI = 'https://www.web3mq.com';
    const did_value = address;
    const timestamp = Date.now();
    const did_type = 'eth';
    const pubkey_type = 'ed25519';
    let userid: string = '';
    let _keys = null;
    try {
      const { data } = await getUserInfoRequest({
        did_type,
        did_value,
        timestamp,
      });
      userid = data.userid;
    } catch (error) {
      userid = `user:${sha3_224(did_type + did_value + timestamp)}`;
    }

    const { PrivateKey, PublicKey } = await GenerateEd25519KeyPair();

    const NonceContent = sha3_224(
      userid +
        pubkey_type +
        PublicKey +
        did_type +
        did_value +
        timestamp.toString()
    );

    let signContent = `Web3MQ wants you to sign in with your Ethereum account:
${did_value}
For Web3MQ login
URI: ${signContentURI}
Version: 1
Nonce: ${NonceContent}
Issued At: ${getCurrentDate()}`;

    // @ts-ignore metamask signature
    const data = await request('/sign', { message: signContent });
    if (data.code === 0) {
      const signature = data.data;

      let payload: LoginParams = {
        userid,
        did_type,
        did_value,
        did_signature: signature,
        signature_content: signContent,
        pubkey_type,
        pubkey_value: PublicKey,
        nickname: '',
        avatar_url: '',
        avatar_base64: '',
        timestamp: timestamp,
        testnet_access_key: 'vAUJTFXbBZRkEDRE',
      };

      try {
        const { data } = await userLoginRequest(payload);
        _keys = { PrivateKey, PublicKey, userid: data.userid };
      } catch (error) {
        _keys = { PrivateKey, PublicKey, userid };
      }
    }
    if (_keys) {
      const { PrivateKey, PublicKey, userid } = _keys;
      localStorage.setItem('PRIVATE_KEY', PrivateKey);
      localStorage.setItem('PUBLICKEY', PublicKey);
      localStorage.setItem('USERID', userid);
      message.success('login success', 2).then(() => {
        setKeys({ PrivateKey, PublicKey, userid });
      });
    }
    setSignStep(null);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='mpcContainer'>
      <button onClick={show} className='sign_btn'>
        MPC Login
      </button>
      <Modal visible={visible} closeModal={hide}>
        <div className='dialogClassName'>
          {step === 'register' && !token && (
            <Form
              name='register'
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={register}
              onFinishFailed={onFinishFailed}
              autoComplete='off'>
              <Form.Item
                label='Username'
                name='username'
                rules={[
                  { required: true, message: 'Please input your email!' },
                ]}>
                <Input placeholder='Please input your email!' />
              </Form.Item>
              <Form.Item
                label='Password'
                name='password'
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}>
                <Input.Password placeholder='Please input your password!' />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button loading={loading} type='primary' htmlType='submit'>
                  Register
                </Button>
                <div>
                  Already have an account?
                  <Button
                    type='link'
                    onClick={() => {
                      setStep('login');
                    }}>
                    Log In
                  </Button>
                </div>
              </Form.Item>
            </Form>
          )}
          {step === 'login' && !token && (
            <Form
              name='login'
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={login}
              onFinishFailed={onFinishFailed}
              autoComplete='off'>
              <Form.Item
                label='Username'
                name='username'
                rules={[
                  { required: true, message: 'Please input your email!' },
                ]}>
                <Input placeholder='Please input your email!' />
              </Form.Item>
              <Form.Item
                label='Password'
                name='password'
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}>
                <Input.Password placeholder='Please input your password!' />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button loading={loading} type='primary' htmlType='submit'>
                  Login
                </Button>
                <div>
                  No a account?
                  <Button
                    type='link'
                    onClick={() => {
                      setStep('register');
                    }}>
                    Sign up
                  </Button>
                </div>
              </Form.Item>
            </Form>
          )}
        </div>
        {signStep !== null && (
          <div className='btnGroup'>
            <Spin size='large' tip={`${signStep}...`} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MPCBtn;
