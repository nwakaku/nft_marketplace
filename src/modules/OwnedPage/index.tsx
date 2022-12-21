import NFTCard from "components/NFTCard";
import useNFTMarket from "state/nft-market";

const OwnedPage = () => {
  const { ownedNFTs } = useNFTMarket();

  return (
    <div className="flex w-full flex-col">
       <>
          {/* Owned NFTs*/}
          <div className="flex flex-wrap">
            {ownedNFTs?.map((nft) => (
              <NFTCard nft={nft} className="mr-2 mb-2" key={nft.id} />
            ))}
          </div>
          {/* Divider, only shown if there are owned listed NFTs*/}
          
        </>
      
    </div>
    
  );
};

export default OwnedPage;
