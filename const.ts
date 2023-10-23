import { ethers } from "ethers";

export const walletAddress = "0x4B746c139c728B66FCcE40610eaffD9741F8F024";
export const scanUrl = "https://api.polygonscan.com/api";
export const scanApiKey = process.env.SCAN_API_KEY;
export const alchemyApiKey = process.env.ALCHEMY_API_KEY;
export const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/");
