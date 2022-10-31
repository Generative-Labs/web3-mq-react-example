import { useMemo, useState } from 'react';
import { Client, KeyPairsType, SignClientCallBackType } from 'web3-mq';
import { message } from 'antd';

const useLogin = () => {
  const hasKeys = useMemo(() => {
    const PrivateKey = localStorage.getItem('PRIVATE_KEY') || '';
    const PublicKey = localStorage.getItem('PUBLICKEY') || '';
    const userid = localStorage.getItem('USERID') || '';
    if (PrivateKey && PublicKey && userid) {
      return { PrivateKey, PublicKey, userid };
    }
    return null;
  }, []);

  const [keys, setKeys] = useState<KeyPairsType | null>(hasKeys);
  const [fastestUrl, setFastUrl] = useState<string | null>(null);

  const init = async () => {
    const fastUrl = await Client.init({
      connectUrl: localStorage.getItem('FAST_URL'),
      app_key: 'vAUJTFXbBZRkEDRE',
      env: 'dev',
    });
    localStorage.setItem('FAST_URL', fastUrl);
    setFastUrl(fastUrl);
  };

  const signMetaMask = async () => {
    const { PrivateKey, PublicKey, userid } =
      await Client.register.signMetaMask({
        signContentURI: 'https://www.web3mq.com',
      });

    localStorage.setItem('PRIVATE_KEY', PrivateKey);
    localStorage.setItem('PUBLICKEY', PublicKey);
    localStorage.setItem('USERID', userid);
    setKeys({ PrivateKey, PublicKey, userid });
  };

  const handleEvent = (options: SignClientCallBackType) => {
    const { type, data } = options;
    console.log(`${type} ====>`, data);
    if (type === 'keys') {
      const { private_key: PrivateKey, pubkey: PublicKey, userid } = data;
      localStorage.setItem('PRIVATE_KEY', PrivateKey);
      localStorage.setItem('PUBLICKEY', PublicKey);
      localStorage.setItem('USERID', userid);
      message.success('login success', 2).then(() => {
        setKeys({ PrivateKey, PublicKey, userid });
      });
    }
  };

  const logout = () => {
    localStorage.clear();
    setKeys(null);
  };

  return { keys, fastestUrl, init, signMetaMask, handleEvent, logout };
};

export default useLogin;
