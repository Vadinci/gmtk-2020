//TODO not super happy about having to check if a function (e.g. update) exists before calling it. Some way of guaranteeing it (even if it means an empty stub) would be nice
//Similar to an Entity, but a little differen

//TODO make dimensions and anchoring work (on screen too?)

import Dispatcher from '@Marzipan/core/dispatcher';
import Transform from '@Marzipan/math/transform';
import Rectangle from '@Marzipan/math/rectangle';


let UIElement = function (settings) {
    let _components = [];

    let _tags = [];

    let _scene;
	let _transform = new Transform();
	let _dimension = new Rectangle();

    //TODO tags

    let start = function (data) {
        for (let ii = 0; ii < _components.length; ii++) {
            let comp = _components[ii];
            if (comp.start) comp.start.call(comp, data);
        }
    };

    let die = function (data) {
        for (let ii = 0; ii < _components.length; ii++) {
            let comp = _components[ii];
            if (comp.die) comp.die.call(comp, data);
        }
    };

    let update = function (data) {
        for (let ii = 0; ii < _components.length; ii++) {
            let comp = _components[ii];
            if (comp.update) comp.update.call(comp, data);
        }
    };

    let draw = function (data) {
        for (let ii = 0; ii < _components.length; ii++) {
            let comp = _components[ii];
            if (comp.preDraw) comp.preDraw.call(comp, data);
        }

        for (let ii = 0; ii < _components.length; ii++) {
            let comp = _components[ii];
            if (comp.draw) comp.draw.call(comp, data);
        }

        //reversed loop
        for (let ii = _components.length - 1; ii >= 0; ii--) {
            let comp = _components[ii];
            if (comp.postDraw) comp.postDraw.call(comp, data);
        }
    };

    let drawDebug = function (data) {
        for (let ii = 0; ii < _components.length; ii++) {
            let comp = _components[ii];
            if (comp.preDraw) comp.preDraw.call(comp, data);
        }

        for (let ii = 0; ii < _components.length; ii++) {
            let comp = _components[ii];
            if (comp.drawDebug) comp.drawDebug.call(comp, data);
        }

        //reversed loop
        for (let ii = _components.length - 1; ii >= 0; ii--) {
            let comp = _components[ii];
            if (comp.postDraw) comp.postDraw.call(comp, data);
        }
    };

    let addComponent = function (component) {
        let idx = _components.indexOf(component);
        if (idx !== -1) {
            console.warn('component ' + component.name + ' already added to entity ' + self.name);
            return;
        }
        _components.push(component);
        idx = _components.length - 1;

        if (component.added) component.added.call(component, {
            entity: self
        });

        return component;
    };

    let getComponent = function (name) {
        for (let ii = 0; ii < _components.length; ii++) {
            if (_components[ii].name === name) {
                return _components[ii];
            }
        }
    };

    let getComponents = function (name) {
        //TODO
    };

    let getAllComponents = function () {
        return [].concat(_components);
    };

    let removeComponent = function (component) {
        if (typeof component === 'string') {
            component = getComponent(component);
        }
        if (!component) return;
        let idx = _components.indexOf(component);
        if (idx === -1) {
            console.warn('component ' + component.name + ' was not added to entity ' + self.name);
            return;
        }
        if (component.die) component.die.call(component);
        _components.splice(idx, 1);
    };



    let addTag = function (tag) {
        let idx = _tags.indexOf(tag);
        if (idx !== -1) return;

        _tags.push(tag);
    };

    let addTags = function (tags) {
        tags.forEach(t => addTag(t));
    };

    let hasTag = function (tag) {
        return _tags.indexOf(tag) !== -1;
    };

    let hasTags = function (tags) {
        return _tags.reduce((a, b) => hasTag(b) && a, true);
    };

    let removeTag = function (tag) {
        let idx = _tags.indexOf(tag);
        if (idx === -1) return;

        _tags.splice(idx, 1);
    };

    let removeTags = function (tags) {
        _tags.forEach(t => removeTag(t));
    };



    let self = {
        name: settings.name || 'entity',
        z: settings.z || 0,
        priority: settings.priority || 0,

        start: start,
        update: update,
        draw: draw,
        drawDebug: drawDebug,
        die: die,

        addComponent: addComponent,
        getComponent: getComponent,
        getComponents: getComponents,
        getAllComponents: getAllComponents,
        removeComponent: removeComponent,

        addTag: addTag,
        addTags: addTags,
        hasTag: hasTag,
        hasTags: hasTags,
        removeTag: removeTag,
        removeTags: removeTags
    };

    Object.defineProperties(self, {
        scene: {
            get: () => _scene,
            set: v => {
                if (_scene && v !== undefined) throw "can't set scene twice. Entity needs to be removed first";
                _scene = v;
            }
        },
        tags: {
            get: () => [].concat(_tags)
        },
        transform: {
            get: () => _transform
        },
        dimension: {
            get: () => _dimension
        }
    });

    Dispatcher.make(self);

    return self;
};

export default UIElement;