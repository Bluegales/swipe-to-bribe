// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.17;

import {Plugin, IDAO} from '@aragon/osx/core/plugin/Plugin.sol';

contract GreeterPlugin is Plugin {
  constructor(IDAO _dao) Plugin(_dao) {}

  function greet() external pure returns (string memory) {
    return 'Hello world!';
  }
}