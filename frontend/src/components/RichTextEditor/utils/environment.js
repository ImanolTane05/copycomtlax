/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {CAN_USE_DOM} from './canUseDOM';

const documentMode =
  CAN_USE_DOM && 'documentMode' in document ? document.documentMode : null;

export const IS_APPLE =
  CAN_USE_DOM && /Mac|iPod|iPhone|iPad/.test(navigator.userAgentData?.platform || navigator?.platform)

export const IS_FIREFOX =
  CAN_USE_DOM && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent)

export const CAN_USE_BEFORE_INPUT =
  CAN_USE_DOM && 'InputEvent' in window && !documentMode
    ? 'getTargetRanges' in new window.InputEvent('input')
    : false

export const IS_SAFARI =
  CAN_USE_DOM && /Version\/[\d.]+.*Safari/.test(navigator.userAgent)

export const IS_IOS =
  CAN_USE_DOM &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !window.MSStream

// Conservar estos por si se usan en un futuro.
// export const IS_WINDOWS: boolean = CAN_USE_DOM && /Win/.test(navigator.platform);
export const IS_CHROME =
  CAN_USE_DOM && /^(?=.*Chrome).*/i.test(navigator.userAgent)
// export const canUseTextInputEvent: boolean = CAN_USE_DOM && 'TextEvent' in window && !documentMode;

export const IS_APPLE_WEBKIT =
  CAN_USE_DOM && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && !IS_CHROME