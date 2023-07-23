// Next.js https://nextjs.org/docs/getting-started/installation
// in src/page.tsx
import {
  SismoConnectButton,
  AuthType,
  SismoConnectResponse,
  ClaimType,
} from "@sismo-core/sismo-connect-react";
import { Bytes } from "ethers";
import { SISMO_CONST } from "./constants"

import { useState } from 'react'
type Props={setSismoResponse:(string) => null};

function SismoButt(props: Props ) {
  return (
    <SismoConnectButton
      config={{
        appId: "0x32403ced4b65f2079eda77c84e7d2be6", // replace with your appId
        vault: {
          // For development purposes insert the Data Sources that you want to impersonate here
          // Never use this in production
          impersonate: [
            // Github
            "github:Bluegales",
          ],
        },
        // displayRawResponse: true,
      }}
      // request proof of Data Sources ownership (e.g EVM, GitHub, twitter or telegram)
      auths={[{ authType: AuthType.GITHUB }]}
      // request zk proof that Data Source are part of a group
      // (e.g NFT ownership, Dao Participation, GitHub commits)
      claims={[
        //citizens
        { groupId: "0x6e41539fdb94fe30e82d46d7f664860f" },
        //politicians
        { groupId: "0xe57abdb9acb2d308d4ec1a12833e1c9f" }
      ]} 
      // request message signature from users.
      // signature={{ message: SISMO_CONST }}
      // retrieve the Sismo Connect Reponse from the user's Sismo data vault
      onResponseBytes={async (response: string) => {
        console.log(response);
        props.setSismoResponse(response);
      // onResponse={async (sismoResponse: SismoConnectResponse) => {
      //   await fetch("/api/verify", {
      //     method: "POST",
      //     body: JSON.stringify(sismoResponse),
      }}

      // reponse in bytes to call a contract
    />
  );
}

export default SismoButt