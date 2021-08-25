/* eslint-disable @typescript-eslint/ban-types */

export function isHotModule(module: NodeModule & { hot: boolean }): boolean {
    return module && module.hot;
}

export function requireContext(
    require: NodeRequire & { context: Function },
    ...contextArgs: (string | boolean | RegExp)[]
): any {
    return require.context(...contextArgs);
}
