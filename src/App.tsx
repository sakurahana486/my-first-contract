import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";//使用我们定义的主合约钩子
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton-core";
import WebApp from "@twa-dev/sdk";//导入TG的sdk

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest,
  } = useMainContract();//主合约钩子返回的内容

  const { connected } = useTonConnect();//获取ton组件钩子返回的连接状态

  //定义一个在TG中消息提示弹窗的组件
  const showAlert = () => {
    WebApp.showAlert("Hey there!");
  };

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>您当前所在操作系统为：{WebApp.platform}（如果不在TG内的话将返回未知）</b>
          <b>我的合约地址:</b>
          <div className='Hint'>{contract_address}</div>
          <b>我的合约余额：</b>
          {contract_balance && (
            <div className='Hint'>{fromNano(contract_balance)}</div>
          )}
        </div>

        <div className='Card'>
          <b>合约中计数器的值：</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        <a
          onClick={() => {
            showAlert();
          }}
        >
          仅在TG小程序中能够弹出提示窗
        </a>

        <br />

        {connected && (
          <a
            onClick={() => {
              sendIncrement();
            }}
          >
            计数器 加 3
          </a>
        )}

        <br />

        {connected && (
          <a
            onClick={() => {
              sendDeposit();
            }}
          >
            向合约存入 1 ton
          </a>
        )}

        <br />

        {connected && (
          <a
            onClick={() => {
              sendWithdrawalRequest();
            }}
          >
            向合约提取 0.5 ton
          </a>
        )}
      </div>
    </div>
  );
}

export default App;
