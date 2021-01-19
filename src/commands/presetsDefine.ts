function define(name, dependencies, callback) {
    if (!name || !dependencies || !callback) return;
    let exports:any = {};
    callback({}, exports);
    if (!(window as any).presets) (window as any).presets = {};
    (window as any).presets[name.split('/').pop()] = exports.default;
};