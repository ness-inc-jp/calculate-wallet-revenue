import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { config } from "dotenv";
import { Transaction } from "./types/Transaction";
import { provider, scanApiKey, scanUrl, walletAddress } from "./const";
import { getBlockNumberByTimestamp } from "./getBlockNumberByTimestamp";
import { generateDataRange } from "./generateDateRange";
import { GoogleSpreadSheetService } from "./lib/sheet";
config();

const waitFor5Seconds = () => new Promise((resolve) => setTimeout(resolve, 5000));

const getOutgoingTransactions = async (address: string, startBlock: number, endBlock: number) => {
  const response = await axios.get(scanUrl, {
    params: {
      module: "account",
      action: "txlist",
      address,
      startblock: startBlock,
      endblock: endBlock,
      sort: "asc",
      apikey: scanApiKey,
    },
  });

  const outgoingTransactions = response.data.result.filter(
    (tx: Transaction) => tx.from.toLowerCase() === address.toLowerCase() && tx.value !== "0",
  );

  return outgoingTransactions;
};

const getIncomingTransactions = async (address: string, startBlock: number, endBlock: number) => {
  const response = await axios.get(scanUrl, {
    params: {
      module: "account",
      action: "txlistinternal",
      address,
      startblock: startBlock,
      endblock: endBlock,
      sort: "asc",
      apikey: scanApiKey,
    },
  });

  const incomingTransactions = response.data.result.filter(
    (tx: Transaction) => tx.to.toLowerCase() === address.toLowerCase(),
  );

  return incomingTransactions;
};

const getTotalValue = (transactions: Transaction[]) => {
  let totalValue = ethers.BigNumber.from(0);
  transactions.forEach((tx) => {
    totalValue = totalValue.add(tx.value);
  });
  return ethers.utils.formatEther(totalValue);
};

const getSalesAndProfit = async (address: string, startBlock: number, endBlock: number) => {
  const incomingTransactions = await getIncomingTransactions(address, startBlock, endBlock);
  const totalIncomingValue = getTotalValue(incomingTransactions);

  const startBlockBalance: BigNumber = await provider.getBalance(address, startBlock);
  console.log({ startBlockBalance: ethers.utils.formatEther(startBlockBalance) });
  const endBlockBalance: BigNumber = await provider.getBalance(address, endBlock);
  console.log({ endBlockBalance: ethers.utils.formatEther(endBlockBalance) });
  const profit = ethers.utils.formatEther(endBlockBalance.sub(startBlockBalance));

  return {
    transactionCount: incomingTransactions.length,
    sales: totalIncomingValue,
    profit: profit,
  };
};

const main = async () => {
  const instance = await GoogleSpreadSheetService.getInstance();
  const sheet = instance.getSheet("2023/05");

  const startDate = new Date("2023-05-01T00:00:00.000+09:00");
  const endDate = new Date("2023-05-07T00:00:00+09:00");

  const dateRange = generateDataRange(startDate, endDate);

  for (const date of dateRange) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const startTimestampe = Math.floor(date.getTime() / 1000);
    const endTimestamp = Math.floor(nextDate.getTime() / 1000);
    console.log({ startTimestampe, endTimestamp });

    const startBlock = await getBlockNumberByTimestamp(startTimestampe);
    console.log({ startBlock });

    await waitFor5Seconds();

    const endBlock = await getBlockNumberByTimestamp(endTimestamp);
    console.log({ endBlock });

    await waitFor5Seconds();

    //送金
    const outgoingTransactions = await getOutgoingTransactions(walletAddress, startBlock, endBlock);
    const totalOutgoingValue = getTotalValue(outgoingTransactions);
    console.log({ 送金回数: outgoingTransactions.length, 送金額: totalOutgoingValue });

    await waitFor5Seconds();

    //入金
    const incomingTransactions = await getIncomingTransactions(walletAddress, startBlock, endBlock);
    const totalIncomingValue = getTotalValue(incomingTransactions);
    console.log({ 入金回数: incomingTransactions.length, 売上: totalIncomingValue });

    //利益
    const startBlockBalance: BigNumber = await provider.getBalance(walletAddress, startBlock);
    console.log({ startBlockBalance: ethers.utils.formatEther(startBlockBalance) });
    const endBlockBalance: BigNumber = await provider.getBalance(walletAddress, endBlock);
    console.log({ endBlockBalance: ethers.utils.formatEther(endBlockBalance) });
    const profit = ethers.utils.formatEther(endBlockBalance.sub(startBlockBalance));

    console.log(
      `${date.toLocaleDateString()}
        入金数: ${incomingTransactions.length}, 
        売上: ${totalIncomingValue} Matic,
        送金数: ${outgoingTransactions.length},
        送金額: ${totalOutgoingValue} Matic,
        利益: ${profit} Matic`,
    );

    const dateToSpreadSheet = {
      日付: date.toLocaleDateString(),
      入金数: incomingTransactions.length.toString(),
      売上: totalIncomingValue,
      送金数: outgoingTransactions.length.toString(),
      送金額: totalOutgoingValue,
      利益: profit,
    };

    await sheet?.addRow(dateToSpreadSheet);

    await await waitFor5Seconds();
  }
};

main().catch((error) => console.error(error));
