//自定义ton组件钩子，比如链接钱包的按钮，如果用户连接了钱包，就会返回 钱包者信息（包含发起交易的各种弹窗） 以及 连接状态

import { useTonConnectUI } from "@tonconnect/ui-react";
import { Sender, SenderArguments } from "ton-core";

export function useTonConnect(): { sender: Sender; connected: boolean } {
  const [tonConnectUI] = useTonConnectUI();//获取
  
  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 用户审批所需时间（5分钟）
        });
      },
    },
    connected: tonConnectUI.connected,//连接状态
  };
}
