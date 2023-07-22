// in src/Airdrop.sol of a Foundry project - https://book.getfoundry.sh/getting-started/first-steps
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@sismo-core/sismo-connect-solidity/contracts/libs/SismoLib.sol";

// Contract to verify Citizen and Politicians using Sismo 
contract SismoVerifier is SismoConnect {

    event ResponseVerified(SismoConnectVerifiedResult result);

    constructor()
        SismoConnect(
            buildConfig({
                appId: 0xf4977993e52606cfd67b7a1cde717069,
                // For development purposes insert when using proofs that contains impersonation
                // Never use this in production
                isImpersonationMode: true
            })
        )
    {}

    function verifyCitizen(bytes memory response, bytes memory message) public {
        ClaimRequest[] memory claims = new ClaimRequest[](1);
        claims[0] = buildClaim({groupId: 0x6e41539fdb94fe30e82d46d7f664860f});

        // verify the response regarding our original request
        SismoConnectVerifiedResult memory result = verify({
            responseBytes: response,
            claims: claims,
            signature: buildSignature({message: message})
        });

        emit ResponseVerified(result);
	}

    function verifyPolitician(bytes memory response, bytes memory message) public {
        ClaimRequest[] memory claims = new ClaimRequest[](1);
        claims[0] = buildClaim({groupId: 0xe57abdb9acb2d308d4ec1a12833e1c9f});

        // verify the response regarding our original request
        SismoConnectVerifiedResult memory result = verify({
            responseBytes: response,
            claims: claims,
            signature: buildSignature({message: message})
        });

        emit ResponseVerified(result);
	}
}
