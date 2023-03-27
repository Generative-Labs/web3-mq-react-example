import React, {useEffect, useRef, useState} from 'react';
import {Client} from "@web3mq/client";
import {Button} from "@web3mq/react-components";
import '@web3mq/react-components/dist/css/index.css';
import {Input} from "antd";

enum AppTypeEnum {
    'pc' = 'pc',
    'h5' = 'h5',
    'mobile' = 'mobile',
}

const App: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [signRes, setSignRes] = useState('');
    const [signContent, setSignContent] = useState('');
    const [signTypedDataContent, setSignTypedDataContent] = useState('');
    const [signTypedDataRes, setSignTypedDataRes] = useState();
    const [appType, setAppType] = useState(
        window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc']
    );
    const [fastUrl, setFastUrl] = useState('');

    useEffect(() => {
        document.getElementsByTagName('body')[0].setAttribute('data-theme', 'light');
        window.addEventListener('resize', () => {
            setAppType(
                window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc']
            );
        });
    }, []);
    const sign = async () => {
        const {sign} = await Client.register.sign(signContent, walletAddress, 'eth')
        setSignRes(sign)
        console.log(sign, 'sign - res')
    }


    const init = async () => {
        const tempPubkey = localStorage.getItem('PUBLIC_KEY') || '';
        const didKey = localStorage.getItem('DID_KEY') || '';
        const url = await Client.init({
            connectUrl: localStorage.getItem('FAST_URL'),
            app_key: 'vAUJTFXbBZRkEDRE',
            didKey,
            tempPubkey,
            env: 'dev'
        });
        setFastUrl(url)
    };


    const signTypedData = async () => {
        const msgParams = [
            {
                type: 'string',
                name: 'Message',
                value: signTypedDataContent,
            },
        ];
        try {
            //@ts-ignore
            const sign = await ethereum.request({
                method: 'eth_signTypedData',
                params: [msgParams, walletAddress],
            });
            setSignTypedDataRes(sign)
        } catch (err) {
            console.log(err)
        }

    };

    const connect = async () => {
        const {address} = await Client.register.getAccount('eth')
        console.log(address, 'address')
        setWalletAddress(address)
    }


    return (
        <div>
            {
                fastUrl ? <>
                    <Button onClick={connect}>connect Wallet</Button>

                    {
                        walletAddress && <div>
                            Personal Sign Content
                            <Input type="text" value={signContent} onChange={(e) => {
                                setSignContent(e.target.value)
                            }
                            }/>
                            {
                                signContent &&
                                <Button onClick={sign}>personal Sign</Button>
                            }
                        </div>
                    }

                    {
                        walletAddress && <div>
                            Sign Typed Data
                            <Input type="text" value={signTypedDataContent} onChange={(e) => {
                                setSignTypedDataContent(e.target.value)
                            }
                            }/>
                            {
                                signTypedDataContent &&
                                <Button onClick={signTypedData}>sign typed data</Button>
                            }
                        </div>
                    }

                    <div>{walletAddress && <p>{'connect success, wallet address is : ' + walletAddress}</p>}</div>
                    <div>{signRes && <p>{'sign success, signature is : ' + signRes}</p>}</div>
                    <div>{signTypedDataRes &&
                        <p>{'sign typed data success, signature is : ' + signTypedDataRes}</p>}</div>

                </> : <button onClick={init}>init</button>
            }


        </div>
    );
};

export default App;
