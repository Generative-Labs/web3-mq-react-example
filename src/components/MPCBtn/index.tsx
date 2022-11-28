import React, { useEffect, useState } from 'react';
import { Modal } from 'web3-mq-react';
import { Button, Form, Input, message } from 'antd';

import useToggle from '../../hooks/useToggle';
import './index.css';

const MPCBtn = () => {
  const [visible, show, hide] = useToggle();
  const [createLoading, showCreateLoading, hideCreateLoading] = useToggle();
  const [signLoading, showSignLoading, hideSignLoading] = useToggle();
  const [step, setStep] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('TOKEN'));

  const request = async (url: string, params: any) => {
    const data = await fetch(`https://dev-mpc.web3mq.com/mpc${url}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        JWT: token || '',
      },
      body: JSON.stringify(params),
    }).then((res) => res.json());
    return data;
  };

  const register = async (values: any) => {
    const data = await request('/signup', values);
    if (data.code === 0) {
      message.success('register success');
    } else {
      message.error(data.msg);
    }
  };

  const login = async (values: any) => {
    const data = await request('/login', values);
    localStorage.setItem('TOKEN', data.data);
    setToken(data.data);
    if (data.code === 0) {
      message.success('login success');
    } else {
      message.error(data.msg);
    }
  };

  const create = async () => {
    showCreateLoading();
    const data = await request('/create', { threadhold: 3 });
    if (data.code === 0) {
      message.success('create success');
    } else {
      setToken(null);
      message.error(data.msg);
    }
    hideCreateLoading();
  };

  const signMPC = async () => {
    showSignLoading();
    const data = await request('/sign', { message: '123' });
    if (data.code === 0) {
      message.success('sign success');
    } else {
      setToken(null);
      message.error(data.msg);
    }
    hideSignLoading();
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
                <Button type='primary' htmlType='submit'>
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
                <Button type='primary' htmlType='submit'>
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
        {token && (
          <div className='btnGroup'>
            <Button loading={createLoading} type='primary' onClick={create}>
              create MPC wallet
            </Button>
            <Button loading={signLoading} type='primary' onClick={signMPC}>
              sign with MPC
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MPCBtn;
