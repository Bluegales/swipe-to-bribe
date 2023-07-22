// // in src/Airdrop.sol of a Foundry project - https://book.getfoundry.sh/getting-started/first-steps
// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.17;

// import "@sismo-core/sismo-connect-solidity/contracts/libs/SismoLib.sol";

// // Contract to verify Citizen and Politicians using Sismo 
// contract SismoVerifier is SismoConnect {

//     event ResponseVerified(SismoConnectVerifiedResult result);

//     // appId of the Sismo Connect app
//     bytes16 private _appId = 0x32403ced4b65f2079eda77c84e7d2be6;
//     // allow proofs made from impersonating accounts to be verified
//     // it should be set to false for production
//     bool private _isImpersonationMode = true;

//     constructor()
//         SismoConnect(
//             buildConfig(_appId, _isImpersonationMode)
//         )
//     {}

//     // function verifyCitizen(bytes memory response, bytes memory message) public {
//     //     ClaimRequest[] memory claims = new ClaimRequest[](1);
//     //     claims[0] = buildClaim({groupId: 0x6e41539fdb94fe30e82d46d7f664860f});

//     //     // verify the response regarding our original request
//     //     SismoConnectVerifiedResult memory result = verify({
//     //         responseBytes: response,
//     //         claims: claims,
//     //         signature: buildSignature({message: message})
//     //     });

//     //     emit ResponseVerified(result);
// 	// }

//     // function verifyPolitician(bytes memory response, bytes memory message) public {
//     //     ClaimRequest[] memory claims = new ClaimRequest[](1);
//     //     claims[0] = buildClaim({groupId: 0xe57abdb9acb2d308d4ec1a12833e1c9f});

//     //     // verify the response regarding our original request
//     //     SismoConnectVerifiedResult memory result = verify({
//     //         responseBytes: response,
//     //         claims: claims,
//     //         signature: buildSignature({message: message})
//     //     });

//     //     emit ResponseVerified(result);
// 	// }
// }
