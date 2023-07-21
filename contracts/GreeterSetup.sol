// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.17;

import {PermissionLib} from '@aragon/osx/core/permission/PermissionLib.sol';
import {PluginSetup} from '@aragon/osx/framework/plugin/setup/PluginSetup.sol';
import './GreeterPlugin.sol';

contract GreeterSetup is PluginSetup {
  function prepareInstallation(
    address _dao,
    bytes memory
  ) external returns (address plugin, PreparedSetupData memory /*preparedSetupData*/) {
    plugin = address(new GreeterPlugin(IDAO(_dao)));
  }

  function prepareUninstallation(
    address _dao,
    SetupPayload calldata _payload
  ) external pure returns (PermissionLib.MultiTargetPermission[] memory /*permissions*/) {
    (_dao, _payload);
  }

  function implementation() external view returns (address) {}
}