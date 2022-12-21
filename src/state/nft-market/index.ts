import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { CreationValues } from "modules/CreationPage/CreationForm";
import useSigner from "state/signer";
import NFT_MARKET from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import useOwnedNFTs from "./useOwnedNFTs";
import useOwnedListedNFTs from "./useOwnedListedNFTs";
import useListedNFTs from "./useListedNFTs";

export type NFT = {
    id: string;
    // Owner of NFT, if NFT is listed for sale, this will be the seller address
    owner: string;
    // If price > 0, the NFT is for sale
    price: string;
    tokenURI: string;
};

const NFT_MARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string;

const useNFTMarket = () => {
    const { signer } = useSigner();
    const nftMarket = new Contract(NFT_MARKET_ADDRESS, NFT_MARKET.abi, signer);

    const ownedNFTs = useOwnedNFTs();
    const ownedListedNFTs = useOwnedListedNFTs();
    const listedNFTs = useListedNFTs();

    const createNFT = async (values: CreationValues) => {
        try {
            const data = new FormData();
            data.append("name", values.name);
            data.append("description", values.description);
            data.append("image", values.image!);
            const response = await fetch("/api/nft-storage", {
                method: "POST",
                body: data,
            });
            if (response.status == 201) {
                const json = await response.json();
                const transaction: TransactionResponse = await nftMarket.createNFT(
                    json.uri
                );
                await transaction.wait();
                console.log("tokenURI: ", json.uri);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const listNFT = async (tokenID: string, price: BigNumber) => {
        const transaction: TransactionResponse = await nftMarket.listNFT(
            tokenID,
            price
        );
        await transaction.wait();
    };

    const cancelListing = async (tokenID: string) => {
        const transaction: TransactionResponse = await nftMarket.cancelListing(
            tokenID
        );
        await transaction.wait();
    }

    const buyNFT = async (nft: NFT) => {
        //something
    };

    return {
        createNFT, 
        listNFT,
        buyNFT,
        ...ownedNFTs,
        ...ownedListedNFTs,
        ...listedNFTs,
        cancelListing,

    };
};

export default useNFTMarket;