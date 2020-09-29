/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * @module botbuilder-dialogs-adaptive
 */

import { DialogStateManager } from 'botbuilder-dialogs';
import { ValueExpression } from 'adaptive-expressions';

export function replaceJsonRecursively(state: DialogStateManager, unit: object): any {
    if (typeof unit === 'string') {
        const { value, error } = new ValueExpression(unit).tryGetValue(state);
        if (!error) {
            return value;
        }
        return unit;
    }

    if (Array.isArray(unit)) {
        let result = [];
        for (const child of unit) {
            result.push(replaceJsonRecursively(state, child));
        }
        return result;
    }

    if (typeof unit === 'object') {
        let result = {};
        for (let key in unit) {
            result[key] = replaceJsonRecursively(state, unit[key]);
        }
        return result;
    }

    return unit;
}