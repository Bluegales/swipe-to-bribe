// in src/Airdrop.sol of a Foundry project - https://book.getfoundry.sh/getting-started/first-steps
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "sismo-connect-solidity/SismoConnectLib.sol";

// This is a sample contract that shows how to use the SismoConnect library
contract Airdrop is SismoConnect {
    event ResponseVerified(SismoConnectVerifiedResult result);

    constructor()
        SismoConnect(
            buildConfig({
                // replace with your appId from the Sismo factory https://factory.sismo.io/
                // should match the appId used to generate the response in your frontend
                appId: 0xf4977993e52606cfd67b7a1cde717069,
                // For development purposes insert when using proofs that contains impersonation
                // Never use this in production
                isImpersonationMode: true
            })
        )
    {}

    function verifySismoConnectResponse(bytes memory response) public {
        // build the auth and claim requests that should match the response
        AuthRequest[] memory auths = new AuthRequest[](1);
        auths[0] = buildAuth({authType: AuthType.GITHUB});

        ClaimRequest[] memory claims = new ClaimRequest[](2);
        // ENS DAO Voters
        claims[0] = buildClaim({groupId: 0x85c7ee90829de70d0d51f52336ea4722});
        // Gitcoin passport with at least a score of 15
        claims[1] = buildClaim({
            groupId: 0x1cde61966decb8600dfd0749bd371f12,
            value: 15,
            claimType: ClaimType.GTE
        });

        // verify the response regarding our original request
        SismoConnectVerifiedResult memory result = verify({
            responseBytes: response,
            auths: auths,
            claims: claims,
            signature: buildSignature({message: "I vote Yes to Privacy"})
        });

        emit ResponseVerified(result);
    }
}
