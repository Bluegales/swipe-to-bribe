// Next.js https://nextjs.org/docs/getting-started/installation
// in src/page.tsx
import {
  SismoConnectButton,
  AuthType,
  SismoConnectResponse,
  ClaimType,
} from "@sismo-core/sismo-connect-react";

function SismoButt() {
  return (
    <SismoConnectButton
      config={{
        appId: "0xf4977993e52606cfd67b7a1cde717069", // replace with your appId
        vault: {
          // For development purposes insert the Data Sources that you want to impersonate here
          // Never use this in production
          impersonate: [
            // EVM
            "leo21.sismo.eth",
            "0xA4C94A6091545e40fc9c3E0982AEc8942E282F38",
            "0x1b9424ed517f7700e7368e34a9743295a225d889",
            "0x82fbed074f62386ed43bb816f748e8817bf46ff7",
            "0xc281bd4db5bf94f02a8525dca954db3895685700",
            // Github
            "github:leo21",
            // Twitter
            "twitter:leo21_eth",
            // Telegram
            "telegram:leo21",
          ],
        },
        // displayRawResponse: true,
      }}
      // request proof of Data Sources ownership (e.g EVM, GitHub, twitter or telegram)
      auths={[{ authType: AuthType.GITHUB }]}
      // request zk proof that Data Source are part of a group
      // (e.g NFT ownership, Dao Participation, GitHub commits)
      claims={[
        // ENS DAO Voters
        { groupId: "0x85c7ee90829de70d0d51f52336ea4722" }, 
        // Gitcoin passport with at least a score of 15
        { groupId: "0x1cde61966decb8600dfd0749bd371f12", value: 15, claimType: ClaimType.GTE }
      ]} 
      // request message signature from users.
      signature={{ message: "I vote Yes to Privacy" }}
      // retrieve the Sismo Connect Reponse from the user's Sismo data vault
      onResponse={async (response: SismoConnectResponse) => {
        const res = await fetch("/api/verify", {
          method: "POST",
          body: JSON.stringify(response),
        });
        console.log(await res.json());
      }}
      // reponse in bytes to call a contract
      // onResponseBytes={async (response: string) => {
      //   console.log(response);
      // }}
    />
  );
}

export default SismoButt