//这个钩子主要用于，通过客户端 创建合约、开放合约，存储合约数据并 return给页面展示

import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "ton-core";
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();//使用客户端
  const { sender } = useTonConnect();//通过ton组件钩子，返回钱包者信息

  //定义一个休眠函数，传入毫秒数即可
  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  //通过useState来定义一个用来存储读取数据的变量
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();
  const [balance, setBalance] = useState<null | number>(0);//默认值为0

  //使用async对象钩子，通过 合约地址，创建并且开放我们的合约
  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("EQBlj8efrsZvmLEy28elXbm1Q7OWPXMhWUdy_CL6SsGrl97v")
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  //useEffect钩子类似监听器，一旦合约初始化完成，将会执行方法
  useEffect(() => {
    //定义获取合约数据的方法
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const { balance } = await mainContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(balance);
      await sleep(5000); // 休眠5秒后，继续执行
      getValue();
    }
    getValue();//默认执行一次
  }, [mainContract]);

  //这个钩子最终会返回内容
  return {
    contract_address: mainContract?.address.toString(),//返回合约地址
    contract_balance: balance,//返回合约余额
    ...contractData,//返回定义的数据
    sendIncrement: async () => {
      return mainContract?.sendIncrement(sender, toNano("0.05"), 3);
    },//返回主合约里面的操作函数【计数器增值】
    sendDeposit: async () => {
      return mainContract?.sendDeposit(sender, toNano("1"));
    },//返回主合约里面的操作函数【存款】
    sendWithdrawalRequest: async () => {
      return mainContract?.sendWithdrawalRequest(
        sender,
        toNano("0.05"),
        toNano("0.5")
      );
    },//返回主合约里面的操作函数【取款】
  };
}
