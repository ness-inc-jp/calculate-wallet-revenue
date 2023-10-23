import axios from "axios";
import { scanApiKey, scanUrl } from "./const";

export const getBlockNumberByTimestamp = async (timestamp: number) => {
  const response = await axios.get(scanUrl, {
    params: {
      module: "block",
      action: "getblocknobytime",
      timestamp,
      closest: "before",
      apikey: scanApiKey,
    },
  });

  return parseInt(response.data.result);
};
