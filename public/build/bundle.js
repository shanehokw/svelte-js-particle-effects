
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch$1(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch$1(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch$1(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch$1(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch$1(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.51.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function getOriginalBodyPadding() {
      const style = window ? window.getComputedStyle(document.body, null) : {};

      return parseInt((style && style.getPropertyValue('padding-right')) || 0, 10);
    }

    function getScrollbarWidth() {
      let scrollDiv = document.createElement('div');
      // .modal-scrollbar-measure styles // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.4/scss/_modal.scss#L106-L113
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';
      document.body.appendChild(scrollDiv);
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }

    function setScrollbarWidth(padding) {
      document.body.style.paddingRight = padding > 0 ? `${padding}px` : null;
    }

    function isBodyOverflowing() {
      return window ? document.body.clientWidth < window.innerWidth : false;
    }

    function conditionallyUpdateScrollbar() {
      const scrollbarWidth = getScrollbarWidth();
      // https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/js/src/modal.js#L433
      const fixedContent = document.querySelectorAll(
        '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top'
      )[0];
      const bodyPadding = fixedContent
        ? parseInt(fixedContent.style.paddingRight || 0, 10)
        : 0;

      if (isBodyOverflowing()) {
        setScrollbarWidth(bodyPadding + scrollbarWidth);
      }
    }

    function browserEvent(target, ...args) {
      target.addEventListener(...args);

      return () => target.removeEventListener(...args);
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    function getTransitionDuration(element) {
      if (!element) return 0;

      // Get transition-duration of the element
      let { transitionDuration, transitionDelay } =
        window.getComputedStyle(element);

      const floatTransitionDuration = Number.parseFloat(transitionDuration);
      const floatTransitionDelay = Number.parseFloat(transitionDelay);

      // Return 0 if element or transition duration is not found
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      }

      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];

      return (
        (Number.parseFloat(transitionDuration) +
          Number.parseFloat(transitionDelay)) *
        1000
      );
    }

    function uuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    function backdropIn(node) {
      node.style.display = 'block';

      const duration = getTransitionDuration(node);

      return {
        duration,
        tick: (t) => {
          if (t === 0) {
            node.classList.add('show');
          }
        }
      };
    }

    function backdropOut(node) {
      node.classList.remove('show');
      const duration = getTransitionDuration(node);

      return {
        duration,
        tick: (t) => {
          if (t === 0) {
            node.style.display = 'none';
          }
        }
      };
    }

    function modalIn(node) {
      node.style.display = 'block';
      const duration = getTransitionDuration(node);

      return {
        duration,
        tick: (t) => {
          if (t > 0) {
            node.classList.add('show');
          }
        }
      };
    }

    function modalOut(node) {
      node.classList.remove('show');
      const duration = getTransitionDuration(node);

      return {
        duration,
        tick: (t) => {
          if (t === 1) {
            node.style.display = 'none';
          }
        }
      };
    }

    /* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.51.0 */
    const file$a = "node_modules\\sveltestrap\\src\\Button.svelte";

    // (54:0) {:else}
    function create_else_block_1$1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$a, 54, 2, 1124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[23](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*children, $$scope*/ 262146)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*button_binding*/ ctx[23](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(54:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (37:0) {#if href}
    function create_if_block$4(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$a, 37, 2, 866);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			/*a_binding*/ ctx[22](a);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[20], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			/*a_binding*/ ctx[22](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(37:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (68:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(68:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (66:6) {#if children}
    function create_if_block_2$2(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(66:6) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    // (65:10)        
    function fallback_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$2, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(65:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (50:4) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(50:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (48:4) {#if children}
    function create_if_block_1$3(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(48:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$a(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","inner","outline","size","style","value","white"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { disabled = false } = $$props;
    	let { href = '' } = $$props;
    	let { inner = undefined } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = '' } = $$props;
    	let { value = '' } = $$props;
    	let { white = false } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$new_props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$new_props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$new_props) $$invalidate(17, white = $$new_props.white);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		inner,
    		outline,
    		size,
    		style,
    		value,
    		white,
    		defaultAriaLabel,
    		classes,
    		ariaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$props) $$invalidate(17, white = $$new_props.white);
    		if ('defaultAriaLabel' in $$props) $$invalidate(6, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ('classes' in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ('ariaLabel' in $$props) $$invalidate(8, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(8, ariaLabel = $$props['aria-label']);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active, white*/ 261120) {
    			$$invalidate(7, classes = classnames(className, close ? 'btn-close' : 'btn', close || `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, {
    				active,
    				'btn-close-white': close && white
    			}));
    		}

    		if ($$self.$$.dirty & /*close*/ 8192) {
    			$$invalidate(6, defaultAriaLabel = close ? 'Close' : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		inner,
    		children,
    		disabled,
    		href,
    		style,
    		value,
    		defaultAriaLabel,
    		classes,
    		ariaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		close,
    		color,
    		outline,
    		size,
    		white,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$a, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 1,
    			close: 13,
    			color: 14,
    			disabled: 2,
    			href: 3,
    			inner: 0,
    			outline: 15,
    			size: 16,
    			style: 4,
    			value: 5,
    			white: 17
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inner() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inner(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get white() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set white(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Icon.svelte generated by Svelte v3.51.0 */
    const file$9 = "node_modules\\sveltestrap\\src\\Icon.svelte";

    function create_fragment$9(ctx) {
    	let i;
    	let i_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let i_data = {};

    	for (let i = 0; i < i_levels.length; i += 1) {
    		i_data = assign(i_data, i_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			i = element("i");
    			set_attributes(i, i_data);
    			add_location(i, file$9, 10, 0, 189);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(i, i_data = get_spread_update(i_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				dirty & /*classes*/ 1 && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","name"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { class: className = '' } = $$props;
    	let { name = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('name' in $$new_props) $$invalidate(3, name = $$new_props.name);
    	};

    	$$self.$capture_state = () => ({ classnames, className, name, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('name' in $$props) $$invalidate(3, name = $$new_props.name);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, name*/ 12) {
    			$$invalidate(0, classes = classnames(className, `bi-${name}`));
    		}
    	};

    	return [classes, $$restProps, className, name];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$9, safe_not_equal, { class: 2, name: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get class() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\InlineContainer.svelte generated by Svelte v3.51.0 */

    const file$8 = "node_modules\\sveltestrap\\src\\InlineContainer.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$8, 3, 0, 67);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InlineContainer', slots, ['default']);
    	let x = 'wtf svelte?'; // eslint-disable-line
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InlineContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ x });

    	$$self.$inject_state = $$props => {
    		if ('x' in $$props) x = $$props.x;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$$scope, slots];
    }

    class InlineContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InlineContainer",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\ModalBackdrop.svelte generated by Svelte v3.51.0 */
    const file$7 = "node_modules\\sveltestrap\\src\\ModalBackdrop.svelte";

    // (20:0) {#if isOpen && loaded}
    function create_if_block$3(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	let div_levels = [/*$$restProps*/ ctx[4], { class: /*classes*/ ctx[3] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_attributes(div, div_data);
    			toggle_class(div, "fade", /*fade*/ ctx[1]);
    			add_location(div, file$7, 20, 2, 464);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4],
    				(!current || dirty & /*classes*/ 8) && { class: /*classes*/ ctx[3] }
    			]));

    			toggle_class(div, "fade", /*fade*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, backdropIn, {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, backdropOut, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(20:0) {#if isOpen && loaded}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[0] && /*loaded*/ ctx[2] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0] && /*loaded*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen, loaded*/ 5) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","isOpen","fade"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalBackdrop', slots, []);
    	let { class: className = '' } = $$props;
    	let { isOpen = false } = $$props;
    	let { fade = true } = $$props;
    	let loaded = false;

    	onMount(() => {
    		$$invalidate(2, loaded = true);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('fade' in $$new_props) $$invalidate(1, fade = $$new_props.fade);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		classnames,
    		backdropIn,
    		backdropOut,
    		className,
    		isOpen,
    		fade,
    		loaded,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('fade' in $$props) $$invalidate(1, fade = $$new_props.fade);
    		if ('loaded' in $$props) $$invalidate(2, loaded = $$new_props.loaded);
    		if ('classes' in $$props) $$invalidate(3, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 32) {
    			$$invalidate(3, classes = classnames(className, 'modal-backdrop'));
    		}
    	};

    	return [isOpen, fade, loaded, classes, $$restProps, className, click_handler];
    }

    class ModalBackdrop extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$7, safe_not_equal, { class: 5, isOpen: 0, fade: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalBackdrop",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalBackdrop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalBackdrop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<ModalBackdrop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<ModalBackdrop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fade() {
    		throw new Error("<ModalBackdrop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fade(value) {
    		throw new Error("<ModalBackdrop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\ModalBody.svelte generated by Svelte v3.51.0 */
    const file$6 = "node_modules\\sveltestrap\\src\\ModalBody.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$6, 9, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalBody', slots, ['default']);
    	let { class: className = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, 'modal-body'));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class ModalBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$6, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalBody",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalBody>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalBody>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\ModalHeader.svelte generated by Svelte v3.51.0 */
    const file$5 = "node_modules\\sveltestrap\\src\\ModalHeader.svelte";
    const get_close_slot_changes = dirty => ({});
    const get_close_slot_context = ctx => ({});

    // (18:4) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(18:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#if children}
    function create_if_block_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 4) set_data_dev(t, /*children*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(16:4) {#if children}",
    		ctx
    	});

    	return block;
    }

    // (23:4) {#if typeof toggle === 'function'}
    function create_if_block$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "btn-close");
    			attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			add_location(button, file$5, 23, 6, 525);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*toggle*/ ctx[0])) /*toggle*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*closeAriaLabel*/ 2) {
    				attr_dev(button, "aria-label", /*closeAriaLabel*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(23:4) {#if typeof toggle === 'function'}",
    		ctx
    	});

    	return block;
    }

    // (22:21)      
    function fallback_block(ctx) {
    	let if_block_anchor;
    	let if_block = typeof /*toggle*/ ctx[0] === 'function' && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (typeof /*toggle*/ ctx[0] === 'function') {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(22:21)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let h5;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const close_slot_template = /*#slots*/ ctx[8].close;
    	const close_slot = create_slot(close_slot_template, ctx, /*$$scope*/ ctx[7], get_close_slot_context);
    	const close_slot_or_fallback = close_slot || fallback_block(ctx);
    	let div_levels = [/*$$restProps*/ ctx[5], { class: /*classes*/ ctx[4] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			if_block.c();
    			t = space();
    			if (close_slot_or_fallback) close_slot_or_fallback.c();
    			attr_dev(h5, "class", "modal-title");
    			attr_dev(h5, "id", /*id*/ ctx[3]);
    			add_location(h5, file$5, 14, 2, 344);
    			set_attributes(div, div_data);
    			add_location(div, file$5, 13, 0, 303);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			if_blocks[current_block_type_index].m(h5, null);
    			append_dev(div, t);

    			if (close_slot_or_fallback) {
    				close_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(h5, null);
    			}

    			if (!current || dirty & /*id*/ 8) {
    				attr_dev(h5, "id", /*id*/ ctx[3]);
    			}

    			if (close_slot) {
    				if (close_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						close_slot,
    						close_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(close_slot_template, /*$$scope*/ ctx[7], dirty, get_close_slot_changes),
    						get_close_slot_context
    					);
    				}
    			} else {
    				if (close_slot_or_fallback && close_slot_or_fallback.p && (!current || dirty & /*closeAriaLabel, toggle*/ 3)) {
    					close_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5],
    				(!current || dirty & /*classes*/ 16) && { class: /*classes*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(close_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(close_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (close_slot_or_fallback) close_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class","toggle","closeAriaLabel","children","id"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalHeader', slots, ['default','close']);
    	let { class: className = '' } = $$props;
    	let { toggle = undefined } = $$props;
    	let { closeAriaLabel = 'Close' } = $$props;
    	let { children = undefined } = $$props;
    	let { id = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(6, className = $$new_props.class);
    		if ('toggle' in $$new_props) $$invalidate(0, toggle = $$new_props.toggle);
    		if ('closeAriaLabel' in $$new_props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ('children' in $$new_props) $$invalidate(2, children = $$new_props.children);
    		if ('id' in $$new_props) $$invalidate(3, id = $$new_props.id);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		toggle,
    		closeAriaLabel,
    		children,
    		id,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(6, className = $$new_props.className);
    		if ('toggle' in $$props) $$invalidate(0, toggle = $$new_props.toggle);
    		if ('closeAriaLabel' in $$props) $$invalidate(1, closeAriaLabel = $$new_props.closeAriaLabel);
    		if ('children' in $$props) $$invalidate(2, children = $$new_props.children);
    		if ('id' in $$props) $$invalidate(3, id = $$new_props.id);
    		if ('classes' in $$props) $$invalidate(4, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 64) {
    			$$invalidate(4, classes = classnames(className, 'modal-header'));
    		}
    	};

    	return [
    		toggle,
    		closeAriaLabel,
    		children,
    		id,
    		classes,
    		$$restProps,
    		className,
    		$$scope,
    		slots
    	];
    }

    class ModalHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$5, safe_not_equal, {
    			class: 6,
    			toggle: 0,
    			closeAriaLabel: 1,
    			children: 2,
    			id: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalHeader",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeAriaLabel() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeAriaLabel(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ModalHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ModalHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Portal.svelte generated by Svelte v3.51.0 */
    const file$4 = "node_modules\\sveltestrap\\src\\Portal.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	let div_levels = [/*$$restProps*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$4, 18, 0, 346);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[4](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[4](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Portal', slots, ['default']);
    	let ref;
    	let portal;

    	onMount(() => {
    		portal = document.createElement('div');
    		document.body.appendChild(portal);
    		portal.appendChild(ref);
    	});

    	onDestroy(() => {
    		if (typeof document !== 'undefined') {
    			document.body.removeChild(portal);
    		}
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onMount, onDestroy, ref, portal });

    	$$self.$inject_state = $$new_props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('portal' in $$props) portal = $$new_props.portal;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, $$restProps, $$scope, slots, div_binding];
    }

    class Portal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Portal",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Modal.svelte generated by Svelte v3.51.0 */

    const file$3 = "node_modules\\sveltestrap\\src\\Modal.svelte";
    const get_external_slot_changes = dirty => ({});
    const get_external_slot_context = ctx => ({});

    // (223:0) {#if _isMounted}
    function create_if_block_1$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*outer*/ ctx[13];

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty[0] & /*wrapClassName, $$restProps, labelledBy, modalClassName, fade, staticModal, classes, _dialog, contentClassName, body, toggle, header, isOpen*/ 2119615 | dirty[1] & /*$$scope*/ 8) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*outer*/ ctx[13])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(223:0) {#if _isMounted}",
    		ctx
    	});

    	return block;
    }

    // (226:6) {#if isOpen}
    function create_if_block_2$1(ctx) {
    	let div2;
    	let t0;
    	let div1;
    	let div0;
    	let t1;
    	let current_block_type_index;
    	let if_block1;
    	let div0_class_value;
    	let div2_class_value;
    	let div2_intro;
    	let div2_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const external_slot_template = /*#slots*/ ctx[31].external;
    	const external_slot = create_slot(external_slot_template, ctx, /*$$scope*/ ctx[34], get_external_slot_context);
    	let if_block0 = /*header*/ ctx[3] && create_if_block_4$1(ctx);
    	const if_block_creators = [create_if_block_3$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*body*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (external_slot) external_slot.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if_block1.c();
    			attr_dev(div0, "class", div0_class_value = classnames('modal-content', /*contentClassName*/ ctx[9]));
    			add_location(div0, file$3, 244, 12, 5732);
    			attr_dev(div1, "class", /*classes*/ ctx[14]);
    			attr_dev(div1, "role", "document");
    			add_location(div1, file$3, 243, 10, 5662);
    			attr_dev(div2, "aria-labelledby", /*labelledBy*/ ctx[5]);

    			attr_dev(div2, "class", div2_class_value = classnames('modal', /*modalClassName*/ ctx[8], {
    				fade: /*fade*/ ctx[10],
    				'position-static': /*staticModal*/ ctx[0]
    			}));

    			attr_dev(div2, "role", "dialog");
    			add_location(div2, file$3, 226, 8, 5106);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);

    			if (external_slot) {
    				external_slot.m(div2, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t1);
    			if_blocks[current_block_type_index].m(div0, null);
    			/*div1_binding*/ ctx[32](div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "introstart", /*introstart_handler*/ ctx[33], false, false, false),
    					listen_dev(div2, "introend", /*onModalOpened*/ ctx[17], false, false, false),
    					listen_dev(div2, "outrostart", /*onModalClosing*/ ctx[18], false, false, false),
    					listen_dev(div2, "outroend", /*onModalClosed*/ ctx[19], false, false, false),
    					listen_dev(div2, "click", /*handleBackdropClick*/ ctx[16], false, false, false),
    					listen_dev(div2, "mousedown", /*handleBackdropMouseDown*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (external_slot) {
    				if (external_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
    					update_slot_base(
    						external_slot,
    						external_slot_template,
    						ctx,
    						/*$$scope*/ ctx[34],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[34])
    						: get_slot_changes(external_slot_template, /*$$scope*/ ctx[34], dirty, get_external_slot_changes),
    						get_external_slot_context
    					);
    				}
    			}

    			if (/*header*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*header*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div0, null);
    			}

    			if (!current || dirty[0] & /*contentClassName*/ 512 && div0_class_value !== (div0_class_value = classnames('modal-content', /*contentClassName*/ ctx[9]))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*classes*/ 16384) {
    				attr_dev(div1, "class", /*classes*/ ctx[14]);
    			}

    			if (!current || dirty[0] & /*labelledBy*/ 32) {
    				attr_dev(div2, "aria-labelledby", /*labelledBy*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*modalClassName, fade, staticModal*/ 1281 && div2_class_value !== (div2_class_value = classnames('modal', /*modalClassName*/ ctx[8], {
    				fade: /*fade*/ ctx[10],
    				'position-static': /*staticModal*/ ctx[0]
    			}))) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(external_slot, local);
    			transition_in(if_block0);
    			transition_in(if_block1);

    			add_render_callback(() => {
    				if (div2_outro) div2_outro.end(1);
    				div2_intro = create_in_transition(div2, modalIn, {});
    				div2_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(external_slot, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			if (div2_intro) div2_intro.invalidate();
    			div2_outro = create_out_transition(div2, modalOut, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (external_slot) external_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			/*div1_binding*/ ctx[32](null);
    			if (detaching && div2_outro) div2_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(226:6) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (246:14) {#if header}
    function create_if_block_4$1(ctx) {
    	let modalheader;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle: /*toggle*/ ctx[4],
    				id: /*labelledBy*/ ctx[5],
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalheader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalheader_changes = {};
    			if (dirty[0] & /*toggle*/ 16) modalheader_changes.toggle = /*toggle*/ ctx[4];
    			if (dirty[0] & /*labelledBy*/ 32) modalheader_changes.id = /*labelledBy*/ ctx[5];

    			if (dirty[0] & /*header*/ 8 | dirty[1] & /*$$scope*/ 8) {
    				modalheader_changes.$$scope = { dirty, ctx };
    			}

    			modalheader.$set(modalheader_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalheader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalheader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(246:14) {#if header}",
    		ctx
    	});

    	return block;
    }

    // (247:16) <ModalHeader {toggle} id={labelledBy}>
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*header*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*header*/ 8) set_data_dev(t, /*header*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(247:16) <ModalHeader {toggle} id={labelledBy}>",
    		ctx
    	});

    	return block;
    }

    // (255:14) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[31].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[34], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[34],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[34])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[34], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(255:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (251:14) {#if body}
    function create_if_block_3$1(ctx) {
    	let modalbody;
    	let current;

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalbody.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalbody, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalbody_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalbody.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalbody.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalbody, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(251:14) {#if body}",
    		ctx
    	});

    	return block;
    }

    // (252:16) <ModalBody>
    function create_default_slot_2$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[31].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[34], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[34],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[34])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[34], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(252:16) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (224:2) <svelte:component this={outer}>
    function create_default_slot_1$1(ctx) {
    	let div;
    	let current;
    	let if_block = /*isOpen*/ ctx[1] && create_if_block_2$1(ctx);

    	let div_levels = [
    		{ class: /*wrapClassName*/ ctx[7] },
    		{ tabindex: "-1" },
    		/*$$restProps*/ ctx[21]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			set_attributes(div, div_data);
    			add_location(div, file$3, 224, 4, 5020);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*isOpen*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*isOpen*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*wrapClassName*/ 128) && { class: /*wrapClassName*/ ctx[7] },
    				{ tabindex: "-1" },
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(224:2) <svelte:component this={outer}>",
    		ctx
    	});

    	return block;
    }

    // (265:0) {#if backdrop && !staticModal}
    function create_if_block$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*outer*/ ctx[13];

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty[0] & /*fade, isOpen*/ 1026 | dirty[1] & /*$$scope*/ 8) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*outer*/ ctx[13])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(265:0) {#if backdrop && !staticModal}",
    		ctx
    	});

    	return block;
    }

    // (266:2) <svelte:component this={outer}>
    function create_default_slot$1(ctx) {
    	let modalbackdrop;
    	let current;

    	modalbackdrop = new ModalBackdrop({
    			props: {
    				fade: /*fade*/ ctx[10],
    				isOpen: /*isOpen*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalbackdrop.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalbackdrop, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalbackdrop_changes = {};
    			if (dirty[0] & /*fade*/ 1024) modalbackdrop_changes.fade = /*fade*/ ctx[10];
    			if (dirty[0] & /*isOpen*/ 2) modalbackdrop_changes.isOpen = /*isOpen*/ ctx[1];
    			modalbackdrop.$set(modalbackdrop_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalbackdrop.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalbackdrop.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalbackdrop, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(266:2) <svelte:component this={outer}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*_isMounted*/ ctx[11] && create_if_block_1$1(ctx);
    	let if_block1 = /*backdrop*/ ctx[6] && !/*staticModal*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*_isMounted*/ ctx[11]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*_isMounted*/ 2048) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*backdrop*/ ctx[6] && !/*staticModal*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*backdrop, staticModal*/ 65) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let openCount = 0;
    const dialogBaseClass = 'modal-dialog';

    function instance$2($$self, $$props, $$invalidate) {
    	let classes;
    	let outer;

    	const omit_props_names = [
    		"class","static","isOpen","autoFocus","body","centered","container","fullscreen","header","scrollable","size","toggle","labelledBy","backdrop","wrapClassName","modalClassName","contentClassName","fade","unmountOnClose","returnFocusAfterClose"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['external','default']);
    	const dispatch = createEventDispatcher();
    	let { class: className = '' } = $$props;
    	let { static: staticModal = false } = $$props;
    	let { isOpen = false } = $$props;
    	let { autoFocus = true } = $$props;
    	let { body = false } = $$props;
    	let { centered = false } = $$props;
    	let { container = undefined } = $$props;
    	let { fullscreen = false } = $$props;
    	let { header = undefined } = $$props;
    	let { scrollable = false } = $$props;
    	let { size = '' } = $$props;
    	let { toggle = undefined } = $$props;
    	let { labelledBy = header ? `modal-${uuid()}` : undefined } = $$props;
    	let { backdrop = true } = $$props;
    	let { wrapClassName = '' } = $$props;
    	let { modalClassName = '' } = $$props;
    	let { contentClassName = '' } = $$props;
    	let { fade = true } = $$props;
    	let { unmountOnClose = true } = $$props;
    	let { returnFocusAfterClose = true } = $$props;
    	let hasOpened = false;
    	let _isMounted = false;
    	let _triggeringElement;
    	let _originalBodyPadding;
    	let _lastIsOpen = isOpen;
    	let _lastHasOpened = hasOpened;
    	let _dialog;
    	let _mouseDownElement;
    	let _removeEscListener;

    	onMount(() => {
    		if (isOpen) {
    			init();
    			hasOpened = true;
    		}

    		if (hasOpened && autoFocus) {
    			setFocus();
    		}
    	});

    	onDestroy(() => {
    		destroy();

    		if (hasOpened) {
    			close();
    		}
    	});

    	afterUpdate(() => {
    		if (isOpen && !_lastIsOpen) {
    			init();
    			hasOpened = true;
    		}

    		if (autoFocus && hasOpened && !_lastHasOpened) {
    			setFocus();
    		}

    		_lastIsOpen = isOpen;
    		_lastHasOpened = hasOpened;
    	});

    	function setFocus() {
    		if (_dialog && _dialog.parentNode && typeof _dialog.parentNode.focus === 'function') {
    			_dialog.parentNode.focus();
    		}
    	}

    	function init() {
    		try {
    			_triggeringElement = document.activeElement;
    		} catch(err) {
    			_triggeringElement = null;
    		}

    		if (!staticModal) {
    			_originalBodyPadding = getOriginalBodyPadding();
    			conditionallyUpdateScrollbar();

    			if (openCount === 0) {
    				document.body.className = classnames(document.body.className, 'modal-open');
    			}

    			++openCount;
    		}

    		$$invalidate(11, _isMounted = true);
    	}

    	function manageFocusAfterClose() {
    		if (_triggeringElement) {
    			if (typeof _triggeringElement.focus === 'function' && returnFocusAfterClose) {
    				_triggeringElement.focus();
    			}

    			_triggeringElement = null;
    		}
    	}

    	function destroy() {
    		manageFocusAfterClose();
    	}

    	function close() {
    		if (openCount <= 1) {
    			document.body.classList.remove('modal-open');
    		}

    		manageFocusAfterClose();
    		openCount = Math.max(0, openCount - 1);
    		setScrollbarWidth(_originalBodyPadding);
    	}

    	function handleBackdropClick(e) {
    		if (e.target === _mouseDownElement) {
    			if (!isOpen || !backdrop) {
    				return;
    			}

    			const backdropElem = _dialog ? _dialog.parentNode : null;

    			if (backdrop === true && backdropElem && e.target === backdropElem && toggle) {
    				e.stopPropagation();
    				toggle(e);
    			}
    		}
    	}

    	function onModalOpened() {
    		dispatch('open');

    		_removeEscListener = browserEvent(document, 'keydown', event => {
    			if (event.key && event.key === 'Escape') {
    				if (toggle && backdrop === true) {
    					if (_removeEscListener) _removeEscListener();
    					toggle(event);
    				}
    			}
    		});
    	}

    	function onModalClosing() {
    		dispatch('closing');

    		if (_removeEscListener) {
    			_removeEscListener();
    		}
    	}

    	function onModalClosed() {
    		dispatch('close');

    		if (unmountOnClose) {
    			destroy();
    		}

    		close();

    		if (_isMounted) {
    			hasOpened = false;
    		}

    		$$invalidate(11, _isMounted = false);
    	}

    	function handleBackdropMouseDown(e) {
    		_mouseDownElement = e.target;
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			_dialog = $$value;
    			$$invalidate(12, _dialog);
    		});
    	}

    	const introstart_handler = () => dispatch('opening');

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(21, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(22, className = $$new_props.class);
    		if ('static' in $$new_props) $$invalidate(0, staticModal = $$new_props.static);
    		if ('isOpen' in $$new_props) $$invalidate(1, isOpen = $$new_props.isOpen);
    		if ('autoFocus' in $$new_props) $$invalidate(23, autoFocus = $$new_props.autoFocus);
    		if ('body' in $$new_props) $$invalidate(2, body = $$new_props.body);
    		if ('centered' in $$new_props) $$invalidate(24, centered = $$new_props.centered);
    		if ('container' in $$new_props) $$invalidate(25, container = $$new_props.container);
    		if ('fullscreen' in $$new_props) $$invalidate(26, fullscreen = $$new_props.fullscreen);
    		if ('header' in $$new_props) $$invalidate(3, header = $$new_props.header);
    		if ('scrollable' in $$new_props) $$invalidate(27, scrollable = $$new_props.scrollable);
    		if ('size' in $$new_props) $$invalidate(28, size = $$new_props.size);
    		if ('toggle' in $$new_props) $$invalidate(4, toggle = $$new_props.toggle);
    		if ('labelledBy' in $$new_props) $$invalidate(5, labelledBy = $$new_props.labelledBy);
    		if ('backdrop' in $$new_props) $$invalidate(6, backdrop = $$new_props.backdrop);
    		if ('wrapClassName' in $$new_props) $$invalidate(7, wrapClassName = $$new_props.wrapClassName);
    		if ('modalClassName' in $$new_props) $$invalidate(8, modalClassName = $$new_props.modalClassName);
    		if ('contentClassName' in $$new_props) $$invalidate(9, contentClassName = $$new_props.contentClassName);
    		if ('fade' in $$new_props) $$invalidate(10, fade = $$new_props.fade);
    		if ('unmountOnClose' in $$new_props) $$invalidate(29, unmountOnClose = $$new_props.unmountOnClose);
    		if ('returnFocusAfterClose' in $$new_props) $$invalidate(30, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
    		if ('$$scope' in $$new_props) $$invalidate(34, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		openCount,
    		classnames,
    		browserEvent,
    		createEventDispatcher,
    		onDestroy,
    		onMount,
    		afterUpdate,
    		modalIn,
    		modalOut,
    		InlineContainer,
    		ModalBackdrop,
    		ModalBody,
    		ModalHeader,
    		Portal,
    		conditionallyUpdateScrollbar,
    		getOriginalBodyPadding,
    		setScrollbarWidth,
    		uuid,
    		dispatch,
    		className,
    		staticModal,
    		isOpen,
    		autoFocus,
    		body,
    		centered,
    		container,
    		fullscreen,
    		header,
    		scrollable,
    		size,
    		toggle,
    		labelledBy,
    		backdrop,
    		wrapClassName,
    		modalClassName,
    		contentClassName,
    		fade,
    		unmountOnClose,
    		returnFocusAfterClose,
    		hasOpened,
    		_isMounted,
    		_triggeringElement,
    		_originalBodyPadding,
    		_lastIsOpen,
    		_lastHasOpened,
    		_dialog,
    		_mouseDownElement,
    		_removeEscListener,
    		setFocus,
    		init,
    		manageFocusAfterClose,
    		destroy,
    		close,
    		handleBackdropClick,
    		onModalOpened,
    		onModalClosing,
    		onModalClosed,
    		handleBackdropMouseDown,
    		dialogBaseClass,
    		outer,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(22, className = $$new_props.className);
    		if ('staticModal' in $$props) $$invalidate(0, staticModal = $$new_props.staticModal);
    		if ('isOpen' in $$props) $$invalidate(1, isOpen = $$new_props.isOpen);
    		if ('autoFocus' in $$props) $$invalidate(23, autoFocus = $$new_props.autoFocus);
    		if ('body' in $$props) $$invalidate(2, body = $$new_props.body);
    		if ('centered' in $$props) $$invalidate(24, centered = $$new_props.centered);
    		if ('container' in $$props) $$invalidate(25, container = $$new_props.container);
    		if ('fullscreen' in $$props) $$invalidate(26, fullscreen = $$new_props.fullscreen);
    		if ('header' in $$props) $$invalidate(3, header = $$new_props.header);
    		if ('scrollable' in $$props) $$invalidate(27, scrollable = $$new_props.scrollable);
    		if ('size' in $$props) $$invalidate(28, size = $$new_props.size);
    		if ('toggle' in $$props) $$invalidate(4, toggle = $$new_props.toggle);
    		if ('labelledBy' in $$props) $$invalidate(5, labelledBy = $$new_props.labelledBy);
    		if ('backdrop' in $$props) $$invalidate(6, backdrop = $$new_props.backdrop);
    		if ('wrapClassName' in $$props) $$invalidate(7, wrapClassName = $$new_props.wrapClassName);
    		if ('modalClassName' in $$props) $$invalidate(8, modalClassName = $$new_props.modalClassName);
    		if ('contentClassName' in $$props) $$invalidate(9, contentClassName = $$new_props.contentClassName);
    		if ('fade' in $$props) $$invalidate(10, fade = $$new_props.fade);
    		if ('unmountOnClose' in $$props) $$invalidate(29, unmountOnClose = $$new_props.unmountOnClose);
    		if ('returnFocusAfterClose' in $$props) $$invalidate(30, returnFocusAfterClose = $$new_props.returnFocusAfterClose);
    		if ('hasOpened' in $$props) hasOpened = $$new_props.hasOpened;
    		if ('_isMounted' in $$props) $$invalidate(11, _isMounted = $$new_props._isMounted);
    		if ('_triggeringElement' in $$props) _triggeringElement = $$new_props._triggeringElement;
    		if ('_originalBodyPadding' in $$props) _originalBodyPadding = $$new_props._originalBodyPadding;
    		if ('_lastIsOpen' in $$props) _lastIsOpen = $$new_props._lastIsOpen;
    		if ('_lastHasOpened' in $$props) _lastHasOpened = $$new_props._lastHasOpened;
    		if ('_dialog' in $$props) $$invalidate(12, _dialog = $$new_props._dialog);
    		if ('_mouseDownElement' in $$props) _mouseDownElement = $$new_props._mouseDownElement;
    		if ('_removeEscListener' in $$props) _removeEscListener = $$new_props._removeEscListener;
    		if ('outer' in $$props) $$invalidate(13, outer = $$new_props.outer);
    		if ('classes' in $$props) $$invalidate(14, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*className, size, fullscreen, centered, scrollable*/ 490733568) {
    			$$invalidate(14, classes = classnames(dialogBaseClass, className, {
    				[`modal-${size}`]: size,
    				'modal-fullscreen': fullscreen === true,
    				[`modal-fullscreen-${fullscreen}-down`]: fullscreen && typeof fullscreen === 'string',
    				[`${dialogBaseClass}-centered`]: centered,
    				[`${dialogBaseClass}-scrollable`]: scrollable
    			}));
    		}

    		if ($$self.$$.dirty[0] & /*container, staticModal*/ 33554433) {
    			$$invalidate(13, outer = container === 'inline' || staticModal
    			? InlineContainer
    			: Portal);
    		}
    	};

    	return [
    		staticModal,
    		isOpen,
    		body,
    		header,
    		toggle,
    		labelledBy,
    		backdrop,
    		wrapClassName,
    		modalClassName,
    		contentClassName,
    		fade,
    		_isMounted,
    		_dialog,
    		outer,
    		classes,
    		dispatch,
    		handleBackdropClick,
    		onModalOpened,
    		onModalClosing,
    		onModalClosed,
    		handleBackdropMouseDown,
    		$$restProps,
    		className,
    		autoFocus,
    		centered,
    		container,
    		fullscreen,
    		scrollable,
    		size,
    		unmountOnClose,
    		returnFocusAfterClose,
    		slots,
    		div1_binding,
    		introstart_handler,
    		$$scope
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$3,
    			safe_not_equal,
    			{
    				class: 22,
    				static: 0,
    				isOpen: 1,
    				autoFocus: 23,
    				body: 2,
    				centered: 24,
    				container: 25,
    				fullscreen: 26,
    				header: 3,
    				scrollable: 27,
    				size: 28,
    				toggle: 4,
    				labelledBy: 5,
    				backdrop: 6,
    				wrapClassName: 7,
    				modalClassName: 8,
    				contentClassName: 9,
    				fade: 10,
    				unmountOnClose: 29,
    				returnFocusAfterClose: 30
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get class() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get static() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set static(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoFocus() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoFocus(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get body() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set body(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get centered() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set centered(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get container() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fullscreen() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fullscreen(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get header() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollable() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scrollable(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggle() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggle(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdrop() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdrop(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wrapClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrapClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get contentClassName() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contentClassName(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fade() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fade(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unmountOnClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unmountOnClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get returnFocusAfterClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set returnFocusAfterClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\ModalFooter.svelte generated by Svelte v3.51.0 */
    const file$2 = "node_modules\\sveltestrap\\src\\ModalFooter.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*classes*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$2, 9, 0, 167);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*classes*/ 1) && { class: /*classes*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let classes;
    	const omit_props_names = ["class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalFooter', slots, ['default']);
    	let { class: className = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ classnames, className, classes });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('classes' in $$props) $$invalidate(0, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 4) {
    			$$invalidate(0, classes = classnames(className, 'modal-footer'));
    		}
    	};

    	return [classes, $$restProps, className, $$scope, slots];
    }

    class ModalFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$2, safe_not_equal, { class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalFooter",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get class() {
    		throw new Error("<ModalFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ModalFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFoundation = /** @class */ (function () {
        function MDCFoundation(adapter) {
            if (adapter === void 0) { adapter = {}; }
            this.adapter = adapter;
        }
        Object.defineProperty(MDCFoundation, "cssClasses", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "strings", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "numbers", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "defaultAdapter", {
            get: function () {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
            },
            enumerable: false,
            configurable: true
        });
        MDCFoundation.prototype.init = function () {
            // Subclasses should override this method to perform initialization routines (registering events, etc.)
        };
        MDCFoundation.prototype.destroy = function () {
            // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
        };
        return MDCFoundation;
    }());

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Determine whether the current browser supports passive event listeners, and
     * if so, use them.
     */
    function applyPassive$1(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        return supportsPassiveOption(globalObj) ?
            { passive: true } :
            false;
    }
    function supportsPassiveOption(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        // See
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        var passiveSupported = false;
        try {
            var options = {
                // This function will be called when the browser
                // attempts to access the passive property.
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            var handler = function () { };
            globalObj.document.addEventListener('test', handler, options);
            globalObj.document.removeEventListener('test', handler, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        applyPassive: applyPassive$1
    });

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
     * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
     */
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        var el = element;
        while (el) {
            if (matches$1(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    function matches$1(element, selector) {
        var nativeMatches = element.matches
            || element.webkitMatchesSelector
            || element.msMatchesSelector;
        return nativeMatches.call(element, selector);
    }
    /**
     * Used to compute the estimated scroll width of elements. When an element is
     * hidden due to display: none; being applied to a parent element, the width is
     * returned as 0. However, the element will have a true width once no longer
     * inside a display: none context. This method computes an estimated width when
     * the element is hidden or returns the true width when the element is visble.
     * @param {Element} element the element whose width to estimate
     */
    function estimateScrollWidth(element) {
        // Check the offsetParent. If the element inherits display: none from any
        // parent, the offsetParent property will be null (see
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
        // This check ensures we only clone the node when necessary.
        var htmlEl = element;
        if (htmlEl.offsetParent !== null) {
            return htmlEl.scrollWidth;
        }
        var clone = htmlEl.cloneNode(true);
        clone.style.setProperty('position', 'absolute');
        clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
        document.documentElement.appendChild(clone);
        var scrollWidth = clone.scrollWidth;
        document.documentElement.removeChild(clone);
        return scrollWidth;
    }

    var ponyfill = /*#__PURE__*/Object.freeze({
        __proto__: null,
        closest: closest,
        matches: matches$1,
        estimateScrollWidth: estimateScrollWidth
    });

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$1 = {
        // Ripple is a special case where the "root" component is really a "mixin" of sorts,
        // given that it's an 'upgrade' to an existing component. That being said it is the root
        // CSS class that all other CSS classes derive from.
        BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
        FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
        FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
        ROOT: 'mdc-ripple-upgraded',
        UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
    };
    var strings$1 = {
        VAR_FG_SCALE: '--mdc-ripple-fg-scale',
        VAR_FG_SIZE: '--mdc-ripple-fg-size',
        VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
        VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
        VAR_LEFT: '--mdc-ripple-left',
        VAR_TOP: '--mdc-ripple-top',
    };
    var numbers$1 = {
        DEACTIVATION_TIMEOUT_MS: 225,
        FG_DEACTIVATION_MS: 150,
        INITIAL_ORIGIN_SCALE: 0.6,
        PADDING: 10,
        TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
    };

    /**
     * Stores result from supportsCssVariables to avoid redundant processing to
     * detect CSS custom variable support.
     */
    var supportsCssVariables_;
    function supportsCssVariables(windowObj, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var CSS = windowObj.CSS;
        var supportsCssVars = supportsCssVariables_;
        if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
            return supportsCssVariables_;
        }
        var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
        if (!supportsFunctionPresent) {
            return false;
        }
        var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
        // See: https://bugs.webkit.org/show_bug.cgi?id=154669
        // See: README section on Safari
        var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
            CSS.supports('color', '#00000000'));
        supportsCssVars =
            explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
        if (!forceRefresh) {
            supportsCssVariables_ = supportsCssVars;
        }
        return supportsCssVars;
    }
    function getNormalizedEventCoords(evt, pageOffset, clientRect) {
        if (!evt) {
            return { x: 0, y: 0 };
        }
        var x = pageOffset.x, y = pageOffset.y;
        var documentX = x + clientRect.left;
        var documentY = y + clientRect.top;
        var normalizedX;
        var normalizedY;
        // Determine touch point relative to the ripple container.
        if (evt.type === 'touchstart') {
            var touchEvent = evt;
            normalizedX = touchEvent.changedTouches[0].pageX - documentX;
            normalizedY = touchEvent.changedTouches[0].pageY - documentY;
        }
        else {
            var mouseEvent = evt;
            normalizedX = mouseEvent.pageX - documentX;
            normalizedY = mouseEvent.pageY - documentY;
        }
        return { x: normalizedX, y: normalizedY };
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    // Activation events registered on the root element of each instance for activation
    var ACTIVATION_EVENT_TYPES = [
        'touchstart', 'pointerdown', 'mousedown', 'keydown',
    ];
    // Deactivation events registered on documentElement when a pointer-related down event occurs
    var POINTER_DEACTIVATION_EVENT_TYPES = [
        'touchend', 'pointerup', 'mouseup', 'contextmenu',
    ];
    // simultaneous nested activations
    var activatedTargets = [];
    var MDCRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCRippleFoundation, _super);
        function MDCRippleFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
            _this.activationAnimationHasEnded = false;
            _this.activationTimer = 0;
            _this.fgDeactivationRemovalTimer = 0;
            _this.fgScale = '0';
            _this.frame = { width: 0, height: 0 };
            _this.initialSize = 0;
            _this.layoutFrame = 0;
            _this.maxRadius = 0;
            _this.unboundedCoords = { left: 0, top: 0 };
            _this.activationState = _this.defaultActivationState();
            _this.activationTimerCallback = function () {
                _this.activationAnimationHasEnded = true;
                _this.runDeactivationUXLogicIfReady();
            };
            _this.activateHandler = function (e) {
                _this.activateImpl(e);
            };
            _this.deactivateHandler = function () {
                _this.deactivateImpl();
            };
            _this.focusHandler = function () {
                _this.handleFocus();
            };
            _this.blurHandler = function () {
                _this.handleBlur();
            };
            _this.resizeHandler = function () {
                _this.layout();
            };
            return _this;
        }
        Object.defineProperty(MDCRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "strings", {
            get: function () {
                return strings$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "numbers", {
            get: function () {
                return numbers$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    browserSupportsCssVars: function () { return true; },
                    computeBoundingRect: function () {
                        return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                    },
                    containsEventTarget: function () { return true; },
                    deregisterDocumentInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    deregisterResizeHandler: function () { return undefined; },
                    getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                    isSurfaceActive: function () { return true; },
                    isSurfaceDisabled: function () { return true; },
                    isUnbounded: function () { return true; },
                    registerDocumentInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                    registerResizeHandler: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    updateCssVariable: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRippleFoundation.prototype.init = function () {
            var _this = this;
            var supportsPressRipple = this.supportsPressRipple();
            this.registerRootHandlers(supportsPressRipple);
            if (supportsPressRipple) {
                var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.addClass(ROOT_1);
                    if (_this.adapter.isUnbounded()) {
                        _this.adapter.addClass(UNBOUNDED_1);
                        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                        _this.layoutInternal();
                    }
                });
            }
        };
        MDCRippleFoundation.prototype.destroy = function () {
            var _this = this;
            if (this.supportsPressRipple()) {
                if (this.activationTimer) {
                    clearTimeout(this.activationTimer);
                    this.activationTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
                }
                if (this.fgDeactivationRemovalTimer) {
                    clearTimeout(this.fgDeactivationRemovalTimer);
                    this.fgDeactivationRemovalTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
                }
                var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.removeClass(ROOT_2);
                    _this.adapter.removeClass(UNBOUNDED_2);
                    _this.removeCssVars();
                });
            }
            this.deregisterRootHandlers();
            this.deregisterDeactivationHandlers();
        };
        /**
         * @param evt Optional event containing position information.
         */
        MDCRippleFoundation.prototype.activate = function (evt) {
            this.activateImpl(evt);
        };
        MDCRippleFoundation.prototype.deactivate = function () {
            this.deactivateImpl();
        };
        MDCRippleFoundation.prototype.layout = function () {
            var _this = this;
            if (this.layoutFrame) {
                cancelAnimationFrame(this.layoutFrame);
            }
            this.layoutFrame = requestAnimationFrame(function () {
                _this.layoutInternal();
                _this.layoutFrame = 0;
            });
        };
        MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
            var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
            if (unbounded) {
                this.adapter.addClass(UNBOUNDED);
            }
            else {
                this.adapter.removeClass(UNBOUNDED);
            }
        };
        MDCRippleFoundation.prototype.handleFocus = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        MDCRippleFoundation.prototype.handleBlur = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        /**
         * We compute this property so that we are not querying information about the client
         * until the point in time where the foundation requests it. This prevents scenarios where
         * client-side feature-detection may happen too early, such as when components are rendered on the server
         * and then initialized at mount time on the client.
         */
        MDCRippleFoundation.prototype.supportsPressRipple = function () {
            return this.adapter.browserSupportsCssVars();
        };
        MDCRippleFoundation.prototype.defaultActivationState = function () {
            return {
                activationEvent: undefined,
                hasDeactivationUXRun: false,
                isActivated: false,
                isProgrammatic: false,
                wasActivatedByPointer: false,
                wasElementMadeActive: false,
            };
        };
        /**
         * supportsPressRipple Passed from init to save a redundant function call
         */
        MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
            var e_1, _a;
            if (supportsPressRipple) {
                try {
                    for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (this.adapter.isUnbounded()) {
                    this.adapter.registerResizeHandler(this.resizeHandler);
                }
            }
            this.adapter.registerInteractionHandler('focus', this.focusHandler);
            this.adapter.registerInteractionHandler('blur', this.blurHandler);
        };
        MDCRippleFoundation.prototype.registerDeactivationHandlers = function (evt) {
            var e_2, _a;
            if (evt.type === 'keydown') {
                this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
            }
            else {
                try {
                    for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
            var e_3, _a;
            try {
                for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
            this.adapter.deregisterInteractionHandler('blur', this.blurHandler);
            if (this.adapter.isUnbounded()) {
                this.adapter.deregisterResizeHandler(this.resizeHandler);
            }
        };
        MDCRippleFoundation.prototype.deregisterDeactivationHandlers = function () {
            var e_4, _a;
            this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
            try {
                for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        MDCRippleFoundation.prototype.removeCssVars = function () {
            var _this = this;
            var rippleStrings = MDCRippleFoundation.strings;
            var keys = Object.keys(rippleStrings);
            keys.forEach(function (key) {
                if (key.indexOf('VAR_') === 0) {
                    _this.adapter.updateCssVariable(rippleStrings[key], null);
                }
            });
        };
        MDCRippleFoundation.prototype.activateImpl = function (evt) {
            var _this = this;
            if (this.adapter.isSurfaceDisabled()) {
                return;
            }
            var activationState = this.activationState;
            if (activationState.isActivated) {
                return;
            }
            // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
            var previousActivationEvent = this.previousActivationEvent;
            var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
            if (isSameInteraction) {
                return;
            }
            activationState.isActivated = true;
            activationState.isProgrammatic = evt === undefined;
            activationState.activationEvent = evt;
            activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
            var hasActivatedChild = evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
            if (hasActivatedChild) {
                // Immediately reset activation state, while preserving logic that prevents touch follow-on events
                this.resetActivationState();
                return;
            }
            if (evt !== undefined) {
                activatedTargets.push(evt.target);
                this.registerDeactivationHandlers(evt);
            }
            activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
            if (activationState.wasElementMadeActive) {
                this.animateActivation();
            }
            requestAnimationFrame(function () {
                // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
                activatedTargets = [];
                if (!activationState.wasElementMadeActive
                    && evt !== undefined
                    && (evt.key === ' ' || evt.keyCode === 32)) {
                    // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                    // active states inconsistently when they're called within event handling code:
                    // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                    // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                    // variable is set within a rAF callback for a submit button interaction (#2241).
                    activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
                    if (activationState.wasElementMadeActive) {
                        _this.animateActivation();
                    }
                }
                if (!activationState.wasElementMadeActive) {
                    // Reset activation state immediately if element was not made active.
                    _this.activationState = _this.defaultActivationState();
                }
            });
        };
        MDCRippleFoundation.prototype.checkElementMadeActive = function (evt) {
            return (evt !== undefined && evt.type === 'keydown') ?
                this.adapter.isSurfaceActive() :
                true;
        };
        MDCRippleFoundation.prototype.animateActivation = function () {
            var _this = this;
            var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
            var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
            var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
            this.layoutInternal();
            var translateStart = '';
            var translateEnd = '';
            if (!this.adapter.isUnbounded()) {
                var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
                translateStart = startPoint.x + "px, " + startPoint.y + "px";
                translateEnd = endPoint.x + "px, " + endPoint.y + "px";
            }
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
            // Cancel any ongoing activation/deactivation animations
            clearTimeout(this.activationTimer);
            clearTimeout(this.fgDeactivationRemovalTimer);
            this.rmBoundedActivationClasses();
            this.adapter.removeClass(FG_DEACTIVATION);
            // Force layout in order to re-trigger the animation.
            this.adapter.computeBoundingRect();
            this.adapter.addClass(FG_ACTIVATION);
            this.activationTimer = setTimeout(function () {
                _this.activationTimerCallback();
            }, DEACTIVATION_TIMEOUT_MS);
        };
        MDCRippleFoundation.prototype.getFgTranslationCoordinates = function () {
            var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
            var startPoint;
            if (wasActivatedByPointer) {
                startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
            }
            else {
                startPoint = {
                    x: this.frame.width / 2,
                    y: this.frame.height / 2,
                };
            }
            // Center the element around the start point.
            startPoint = {
                x: startPoint.x - (this.initialSize / 2),
                y: startPoint.y - (this.initialSize / 2),
            };
            var endPoint = {
                x: (this.frame.width / 2) - (this.initialSize / 2),
                y: (this.frame.height / 2) - (this.initialSize / 2),
            };
            return { startPoint: startPoint, endPoint: endPoint };
        };
        MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady = function () {
            var _this = this;
            // This method is called both when a pointing device is released, and when the activation animation ends.
            // The deactivation animation should only run after both of those occur.
            var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
            var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
            var activationHasEnded = hasDeactivationUXRun || !isActivated;
            if (activationHasEnded && this.activationAnimationHasEnded) {
                this.rmBoundedActivationClasses();
                this.adapter.addClass(FG_DEACTIVATION);
                this.fgDeactivationRemovalTimer = setTimeout(function () {
                    _this.adapter.removeClass(FG_DEACTIVATION);
                }, numbers$1.FG_DEACTIVATION_MS);
            }
        };
        MDCRippleFoundation.prototype.rmBoundedActivationClasses = function () {
            var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
            this.adapter.removeClass(FG_ACTIVATION);
            this.activationAnimationHasEnded = false;
            this.adapter.computeBoundingRect();
        };
        MDCRippleFoundation.prototype.resetActivationState = function () {
            var _this = this;
            this.previousActivationEvent = this.activationState.activationEvent;
            this.activationState = this.defaultActivationState();
            // Touch devices may fire additional events for the same interaction within a short time.
            // Store the previous event until it's safe to assume that subsequent events are for new interactions.
            setTimeout(function () { return _this.previousActivationEvent = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
        };
        MDCRippleFoundation.prototype.deactivateImpl = function () {
            var _this = this;
            var activationState = this.activationState;
            // This can happen in scenarios such as when you have a keyup event that blurs the element.
            if (!activationState.isActivated) {
                return;
            }
            var state = __assign({}, activationState);
            if (activationState.isProgrammatic) {
                requestAnimationFrame(function () {
                    _this.animateDeactivation(state);
                });
                this.resetActivationState();
            }
            else {
                this.deregisterDeactivationHandlers();
                requestAnimationFrame(function () {
                    _this.activationState.hasDeactivationUXRun = true;
                    _this.animateDeactivation(state);
                    _this.resetActivationState();
                });
            }
        };
        MDCRippleFoundation.prototype.animateDeactivation = function (_a) {
            var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
            if (wasActivatedByPointer || wasElementMadeActive) {
                this.runDeactivationUXLogicIfReady();
            }
        };
        MDCRippleFoundation.prototype.layoutInternal = function () {
            var _this = this;
            this.frame = this.adapter.computeBoundingRect();
            var maxDim = Math.max(this.frame.height, this.frame.width);
            // Surface diameter is treated differently for unbounded vs. bounded ripples.
            // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
            // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
            // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
            // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
            // `overflow: hidden`.
            var getBoundedRadius = function () {
                var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
            };
            this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
            // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
            var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
            // Unbounded ripple size should always be even number to equally center align.
            if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize = initialSize - 1;
            }
            else {
                this.initialSize = initialSize;
            }
            this.fgScale = "" + this.maxRadius / this.initialSize;
            this.updateLayoutCssVars();
        };
        MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
            var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
            this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
            this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
            if (this.adapter.isUnbounded()) {
                this.unboundedCoords = {
                    left: Math.round((this.frame.width / 2) - (this.initialSize / 2)),
                    top: Math.round((this.frame.height / 2) - (this.initialSize / 2)),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
            }
        };
        return MDCRippleFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /** Slider element classes. */
    var cssClasses = {
        DISABLED: 'mdc-slider--disabled',
        DISCRETE: 'mdc-slider--discrete',
        INPUT: 'mdc-slider__input',
        RANGE: 'mdc-slider--range',
        THUMB: 'mdc-slider__thumb',
        // Applied when thumb is in the focused state.
        THUMB_FOCUSED: 'mdc-slider__thumb--focused',
        THUMB_KNOB: 'mdc-slider__thumb-knob',
        // Class added to the top thumb (for overlapping thumbs in range slider).
        THUMB_TOP: 'mdc-slider__thumb--top',
        THUMB_WITH_INDICATOR: 'mdc-slider__thumb--with-indicator',
        TICK_MARKS: 'mdc-slider--tick-marks',
        TICK_MARKS_CONTAINER: 'mdc-slider__tick-marks',
        TICK_MARK_ACTIVE: 'mdc-slider__tick-mark--active',
        TICK_MARK_INACTIVE: 'mdc-slider__tick-mark--inactive',
        TRACK: 'mdc-slider__track',
        // The active track fill element that will be scaled as the value changes.
        TRACK_ACTIVE: 'mdc-slider__track--active_fill',
        VALUE_INDICATOR_CONTAINER: 'mdc-slider__value-indicator-container',
        VALUE_INDICATOR_TEXT: 'mdc-slider__value-indicator-text',
    };
    /** Slider numbers. */
    var numbers = {
        // Default step size.
        STEP_SIZE: 1,
        // Default minimum difference between the start and end values.
        MIN_RANGE: 0,
        // Minimum absolute difference between clientX of move event / down event
        // for which to update thumb, in the case of overlapping thumbs.
        // This is needed to reduce chances of choosing the thumb based on
        // pointer jitter.
        THUMB_UPDATE_MIN_PX: 5,
    };
    /** Slider attributes. */
    var attributes = {
        ARIA_VALUETEXT: 'aria-valuetext',
        INPUT_DISABLED: 'disabled',
        INPUT_MIN: 'min',
        INPUT_MAX: 'max',
        INPUT_VALUE: 'value',
        INPUT_STEP: 'step',
        DATA_MIN_RANGE: 'data-min-range',
    };
    /** Slider strings. */
    var strings = {
        VAR_VALUE_INDICATOR_CARET_LEFT: '--slider-value-indicator-caret-left',
        VAR_VALUE_INDICATOR_CARET_RIGHT: '--slider-value-indicator-caret-right',
        VAR_VALUE_INDICATOR_CARET_TRANSFORM: '--slider-value-indicator-caret-transform',
        VAR_VALUE_INDICATOR_CONTAINER_LEFT: '--slider-value-indicator-container-left',
        VAR_VALUE_INDICATOR_CONTAINER_RIGHT: '--slider-value-indicator-container-right',
        VAR_VALUE_INDICATOR_CONTAINER_TRANSFORM: '--slider-value-indicator-container-transform',
    };

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * AnimationFrame provides a user-friendly abstraction around requesting
     * and canceling animation frames.
     */
    var AnimationFrame = /** @class */ (function () {
        function AnimationFrame() {
            this.rafIDs = new Map();
        }
        /**
         * Requests an animation frame. Cancels any existing frame with the same key.
         * @param {string} key The key for this callback.
         * @param {FrameRequestCallback} callback The callback to be executed.
         */
        AnimationFrame.prototype.request = function (key, callback) {
            var _this = this;
            this.cancel(key);
            var frameID = requestAnimationFrame(function (frame) {
                _this.rafIDs.delete(key);
                // Callback must come *after* the key is deleted so that nested calls to
                // request with the same key are not deleted.
                callback(frame);
            });
            this.rafIDs.set(key, frameID);
        };
        /**
         * Cancels a queued callback with the given key.
         * @param {string} key The key for this callback.
         */
        AnimationFrame.prototype.cancel = function (key) {
            var rafID = this.rafIDs.get(key);
            if (rafID) {
                cancelAnimationFrame(rafID);
                this.rafIDs.delete(key);
            }
        };
        /**
         * Cancels all queued callback.
         */
        AnimationFrame.prototype.cancelAll = function () {
            var _this = this;
            // Need to use forEach because it's the only iteration method supported
            // by IE11. Suppress the underscore because we don't need it.
            // tslint:disable-next-line:enforce-name-casing
            this.rafIDs.forEach(function (_, key) {
                _this.cancel(key);
            });
        };
        /**
         * Returns the queue of unexecuted callback keys.
         */
        AnimationFrame.prototype.getQueue = function () {
            var queue = [];
            // Need to use forEach because it's the only iteration method supported
            // by IE11. Suppress the underscore because we don't need it.
            // tslint:disable-next-line:enforce-name-casing
            this.rafIDs.forEach(function (_, key) {
                queue.push(key);
            });
            return queue;
        };
        return AnimationFrame;
    }());

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssPropertyNameMap = {
        animation: {
            prefixed: '-webkit-animation',
            standard: 'animation',
        },
        transform: {
            prefixed: '-webkit-transform',
            standard: 'transform',
        },
        transition: {
            prefixed: '-webkit-transition',
            standard: 'transition',
        },
    };
    function isWindow(windowObj) {
        return Boolean(windowObj.document) && typeof windowObj.document.createElement === 'function';
    }
    function getCorrectPropertyName(windowObj, cssProperty) {
        if (isWindow(windowObj) && cssProperty in cssPropertyNameMap) {
            var el = windowObj.document.createElement('div');
            var _a = cssPropertyNameMap[cssProperty], standard = _a.standard, prefixed = _a.prefixed;
            var isStandard = standard in el.style;
            return isStandard ? standard : prefixed;
        }
        return cssProperty;
    }

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /** Tick mark enum, for discrete sliders. */
    var TickMark;
    (function (TickMark) {
        TickMark[TickMark["ACTIVE"] = 0] = "ACTIVE";
        TickMark[TickMark["INACTIVE"] = 1] = "INACTIVE";
    })(TickMark || (TickMark = {}));
    /**
     * Thumb types: range slider has two thumbs (START, END) whereas single point
     * slider only has one thumb (END).
     */
    var Thumb;
    (function (Thumb) {
        // Thumb at start of slider (e.g. in LTR mode, left thumb on range slider).
        Thumb[Thumb["START"] = 1] = "START";
        // Thumb at end of slider (e.g. in LTR mode, right thumb on range slider,
        // or only thumb on single point slider).
        Thumb[Thumb["END"] = 2] = "END";
    })(Thumb || (Thumb = {}));

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var AnimationKeys;
    (function (AnimationKeys) {
        AnimationKeys["SLIDER_UPDATE"] = "slider_update";
    })(AnimationKeys || (AnimationKeys = {}));
    // Accessing `window` without a `typeof` check will throw on Node environments.
    var HAS_WINDOW = typeof window !== 'undefined';
    /**
     * Foundation class for slider. Responsibilities include:
     * - Updating slider values (internal state and DOM updates) based on client
     *   'x' position.
     * - Updating DOM after slider property updates (e.g. min, max).
     */
    var MDCSliderFoundation = /** @class */ (function (_super) {
        __extends(MDCSliderFoundation, _super);
        function MDCSliderFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCSliderFoundation.defaultAdapter), adapter)) || this;
            // Whether the initial styles (to position the thumb, before component
            // initialization) have been removed.
            _this.initialStylesRemoved = false;
            _this.isDisabled = false;
            _this.isDiscrete = false;
            _this.step = numbers.STEP_SIZE;
            _this.minRange = numbers.MIN_RANGE;
            _this.hasTickMarks = false;
            // The following properties are only set for range sliders.
            _this.isRange = false;
            // Tracks the thumb being moved across a slider pointer interaction (down,
            // move event).
            _this.thumb = null;
            // `clientX` from the most recent down event. Used in subsequent move
            // events to determine which thumb to move (in the case of
            // overlapping thumbs).
            _this.downEventClientX = null;
            // Width of the start thumb knob.
            _this.startThumbKnobWidth = 0;
            // Width of the end thumb knob.
            _this.endThumbKnobWidth = 0;
            _this.animFrame = new AnimationFrame();
            return _this;
        }
        Object.defineProperty(MDCSliderFoundation, "defaultAdapter", {
            get: function () {
                // tslint:disable:object-literal-sort-keys Methods should be in the same
                // order as the adapter interface.
                return {
                    hasClass: function () { return false; },
                    addClass: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    addThumbClass: function () { return undefined; },
                    removeThumbClass: function () { return undefined; },
                    getAttribute: function () { return null; },
                    getInputValue: function () { return ''; },
                    setInputValue: function () { return undefined; },
                    getInputAttribute: function () { return null; },
                    setInputAttribute: function () { return null; },
                    removeInputAttribute: function () { return null; },
                    focusInput: function () { return undefined; },
                    isInputFocused: function () { return false; },
                    shouldHideFocusStylesForPointerEvents: function () { return false; },
                    getThumbKnobWidth: function () { return 0; },
                    getValueIndicatorContainerWidth: function () { return 0; },
                    getThumbBoundingClientRect: function () {
                        return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                    },
                    getBoundingClientRect: function () {
                        return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                    },
                    isRTL: function () { return false; },
                    setThumbStyleProperty: function () { return undefined; },
                    removeThumbStyleProperty: function () { return undefined; },
                    setTrackActiveStyleProperty: function () { return undefined; },
                    removeTrackActiveStyleProperty: function () { return undefined; },
                    setValueIndicatorText: function () { return undefined; },
                    getValueToAriaValueTextFn: function () { return null; },
                    updateTickMarks: function () { return undefined; },
                    setPointerCapture: function () { return undefined; },
                    emitChangeEvent: function () { return undefined; },
                    emitInputEvent: function () { return undefined; },
                    emitDragStartEvent: function () { return undefined; },
                    emitDragEndEvent: function () { return undefined; },
                    registerEventHandler: function () { return undefined; },
                    deregisterEventHandler: function () { return undefined; },
                    registerThumbEventHandler: function () { return undefined; },
                    deregisterThumbEventHandler: function () { return undefined; },
                    registerInputEventHandler: function () { return undefined; },
                    deregisterInputEventHandler: function () { return undefined; },
                    registerBodyEventHandler: function () { return undefined; },
                    deregisterBodyEventHandler: function () { return undefined; },
                    registerWindowEventHandler: function () { return undefined; },
                    deregisterWindowEventHandler: function () { return undefined; },
                };
                // tslint:enable:object-literal-sort-keys
            },
            enumerable: false,
            configurable: true
        });
        MDCSliderFoundation.prototype.init = function () {
            var _this = this;
            this.isDisabled = this.adapter.hasClass(cssClasses.DISABLED);
            this.isDiscrete = this.adapter.hasClass(cssClasses.DISCRETE);
            this.hasTickMarks = this.adapter.hasClass(cssClasses.TICK_MARKS);
            this.isRange = this.adapter.hasClass(cssClasses.RANGE);
            var min = this.convertAttributeValueToNumber(this.adapter.getInputAttribute(attributes.INPUT_MIN, this.isRange ? Thumb.START : Thumb.END), attributes.INPUT_MIN);
            var max = this.convertAttributeValueToNumber(this.adapter.getInputAttribute(attributes.INPUT_MAX, Thumb.END), attributes.INPUT_MAX);
            var value = this.convertAttributeValueToNumber(this.adapter.getInputAttribute(attributes.INPUT_VALUE, Thumb.END), attributes.INPUT_VALUE);
            var valueStart = this.isRange ?
                this.convertAttributeValueToNumber(this.adapter.getInputAttribute(attributes.INPUT_VALUE, Thumb.START), attributes.INPUT_VALUE) :
                min;
            var stepAttr = this.adapter.getInputAttribute(attributes.INPUT_STEP, Thumb.END);
            var step = stepAttr ?
                this.convertAttributeValueToNumber(stepAttr, attributes.INPUT_STEP) :
                this.step;
            var minRangeAttr = this.adapter.getAttribute(attributes.DATA_MIN_RANGE);
            var minRange = minRangeAttr ?
                this.convertAttributeValueToNumber(minRangeAttr, attributes.DATA_MIN_RANGE) :
                this.minRange;
            this.validateProperties({ min: min, max: max, value: value, valueStart: valueStart, step: step, minRange: minRange });
            this.min = min;
            this.max = max;
            this.value = value;
            this.valueStart = valueStart;
            this.step = step;
            this.minRange = minRange;
            this.numDecimalPlaces = getNumDecimalPlaces(this.step);
            this.valueBeforeDownEvent = value;
            this.valueStartBeforeDownEvent = valueStart;
            this.mousedownOrTouchstartListener =
                this.handleMousedownOrTouchstart.bind(this);
            this.moveListener = this.handleMove.bind(this);
            this.pointerdownListener = this.handlePointerdown.bind(this);
            this.pointerupListener = this.handlePointerup.bind(this);
            this.thumbMouseenterListener = this.handleThumbMouseenter.bind(this);
            this.thumbMouseleaveListener = this.handleThumbMouseleave.bind(this);
            this.inputStartChangeListener = function () {
                _this.handleInputChange(Thumb.START);
            };
            this.inputEndChangeListener = function () {
                _this.handleInputChange(Thumb.END);
            };
            this.inputStartFocusListener = function () {
                _this.handleInputFocus(Thumb.START);
            };
            this.inputEndFocusListener = function () {
                _this.handleInputFocus(Thumb.END);
            };
            this.inputStartBlurListener = function () {
                _this.handleInputBlur(Thumb.START);
            };
            this.inputEndBlurListener = function () {
                _this.handleInputBlur(Thumb.END);
            };
            this.resizeListener = this.handleResize.bind(this);
            this.registerEventHandlers();
        };
        MDCSliderFoundation.prototype.destroy = function () {
            this.deregisterEventHandlers();
        };
        MDCSliderFoundation.prototype.setMin = function (value) {
            this.min = value;
            if (!this.isRange) {
                this.valueStart = value;
            }
            this.updateUI();
        };
        MDCSliderFoundation.prototype.setMax = function (value) {
            this.max = value;
            this.updateUI();
        };
        MDCSliderFoundation.prototype.getMin = function () {
            return this.min;
        };
        MDCSliderFoundation.prototype.getMax = function () {
            return this.max;
        };
        /**
         * - For single point sliders, returns the thumb value.
         * - For range (two-thumb) sliders, returns the end thumb's value.
         */
        MDCSliderFoundation.prototype.getValue = function () {
            return this.value;
        };
        /**
         * - For single point sliders, sets the thumb value.
         * - For range (two-thumb) sliders, sets the end thumb's value.
         */
        MDCSliderFoundation.prototype.setValue = function (value) {
            if (this.isRange && value < this.valueStart + this.minRange) {
                throw new Error("end thumb value (" + value + ") must be >= start thumb " +
                    ("value (" + this.valueStart + ") + min range (" + this.minRange + ")"));
            }
            this.updateValue(value, Thumb.END);
        };
        /**
         * Only applicable for range sliders.
         * @return The start thumb's value.
         */
        MDCSliderFoundation.prototype.getValueStart = function () {
            if (!this.isRange) {
                throw new Error('`valueStart` is only applicable for range sliders.');
            }
            return this.valueStart;
        };
        /**
         * Only applicable for range sliders. Sets the start thumb's value.
         */
        MDCSliderFoundation.prototype.setValueStart = function (valueStart) {
            if (!this.isRange) {
                throw new Error('`valueStart` is only applicable for range sliders.');
            }
            if (this.isRange && valueStart > this.value - this.minRange) {
                throw new Error("start thumb value (" + valueStart + ") must be <= end thumb " +
                    ("value (" + this.value + ") - min range (" + this.minRange + ")"));
            }
            this.updateValue(valueStart, Thumb.START);
        };
        MDCSliderFoundation.prototype.setStep = function (value) {
            this.step = value;
            this.numDecimalPlaces = getNumDecimalPlaces(value);
            this.updateUI();
        };
        /**
         * Only applicable for range sliders. Sets the minimum difference between the
         * start and end values.
         */
        MDCSliderFoundation.prototype.setMinRange = function (value) {
            if (!this.isRange) {
                throw new Error('`minRange` is only applicable for range sliders.');
            }
            if (value < 0) {
                throw new Error('`minRange` must be non-negative. ' +
                    ("Current value: " + value));
            }
            if (this.value - this.valueStart < value) {
                throw new Error("start thumb value (" + this.valueStart + ") and end thumb value " +
                    ("(" + this.value + ") must differ by at least " + value + "."));
            }
            this.minRange = value;
        };
        MDCSliderFoundation.prototype.setIsDiscrete = function (value) {
            this.isDiscrete = value;
            this.updateValueIndicatorUI();
            this.updateTickMarksUI();
        };
        MDCSliderFoundation.prototype.getStep = function () {
            return this.step;
        };
        MDCSliderFoundation.prototype.getMinRange = function () {
            if (!this.isRange) {
                throw new Error('`minRange` is only applicable for range sliders.');
            }
            return this.minRange;
        };
        MDCSliderFoundation.prototype.setHasTickMarks = function (value) {
            this.hasTickMarks = value;
            this.updateTickMarksUI();
        };
        MDCSliderFoundation.prototype.getDisabled = function () {
            return this.isDisabled;
        };
        /**
         * Sets disabled state, including updating styles and thumb tabindex.
         */
        MDCSliderFoundation.prototype.setDisabled = function (disabled) {
            this.isDisabled = disabled;
            if (disabled) {
                this.adapter.addClass(cssClasses.DISABLED);
                if (this.isRange) {
                    this.adapter.setInputAttribute(attributes.INPUT_DISABLED, '', Thumb.START);
                }
                this.adapter.setInputAttribute(attributes.INPUT_DISABLED, '', Thumb.END);
            }
            else {
                this.adapter.removeClass(cssClasses.DISABLED);
                if (this.isRange) {
                    this.adapter.removeInputAttribute(attributes.INPUT_DISABLED, Thumb.START);
                }
                this.adapter.removeInputAttribute(attributes.INPUT_DISABLED, Thumb.END);
            }
        };
        /** @return Whether the slider is a range slider. */
        MDCSliderFoundation.prototype.getIsRange = function () {
            return this.isRange;
        };
        /**
         * - Syncs slider boundingClientRect with the current DOM.
         * - Updates UI based on internal state.
         */
        MDCSliderFoundation.prototype.layout = function (_a) {
            var _b = _a === void 0 ? {} : _a, skipUpdateUI = _b.skipUpdateUI;
            this.rect = this.adapter.getBoundingClientRect();
            if (this.isRange) {
                this.startThumbKnobWidth = this.adapter.getThumbKnobWidth(Thumb.START);
                this.endThumbKnobWidth = this.adapter.getThumbKnobWidth(Thumb.END);
            }
            if (!skipUpdateUI) {
                this.updateUI();
            }
        };
        /** Handles resize events on the window. */
        MDCSliderFoundation.prototype.handleResize = function () {
            this.layout();
        };
        /**
         * Handles pointer down events on the slider root element.
         */
        MDCSliderFoundation.prototype.handleDown = function (event) {
            if (this.isDisabled)
                return;
            this.valueStartBeforeDownEvent = this.valueStart;
            this.valueBeforeDownEvent = this.value;
            var clientX = event.clientX != null ?
                event.clientX :
                event.targetTouches[0].clientX;
            this.downEventClientX = clientX;
            var value = this.mapClientXOnSliderScale(clientX);
            this.thumb = this.getThumbFromDownEvent(clientX, value);
            if (this.thumb === null)
                return;
            this.handleDragStart(event, value, this.thumb);
            this.updateValue(value, this.thumb, { emitInputEvent: true });
        };
        /**
         * Handles pointer move events on the slider root element.
         */
        MDCSliderFoundation.prototype.handleMove = function (event) {
            if (this.isDisabled)
                return;
            // Prevent scrolling.
            event.preventDefault();
            var clientX = event.clientX != null ?
                event.clientX :
                event.targetTouches[0].clientX;
            var dragAlreadyStarted = this.thumb != null;
            this.thumb = this.getThumbFromMoveEvent(clientX);
            if (this.thumb === null)
                return;
            var value = this.mapClientXOnSliderScale(clientX);
            if (!dragAlreadyStarted) {
                this.handleDragStart(event, value, this.thumb);
                this.adapter.emitDragStartEvent(value, this.thumb);
            }
            this.updateValue(value, this.thumb, { emitInputEvent: true });
        };
        /**
         * Handles pointer up events on the slider root element.
         */
        MDCSliderFoundation.prototype.handleUp = function () {
            var _a, _b;
            if (this.isDisabled || this.thumb === null)
                return;
            // Remove the focused state and hide the value indicator(s) (if present)
            // if focus state is meant to be hidden.
            if ((_b = (_a = this.adapter).shouldHideFocusStylesForPointerEvents) === null || _b === void 0 ? void 0 : _b.call(_a)) {
                this.handleInputBlur(this.thumb);
            }
            var oldValue = this.thumb === Thumb.START ?
                this.valueStartBeforeDownEvent :
                this.valueBeforeDownEvent;
            var newValue = this.thumb === Thumb.START ? this.valueStart : this.value;
            if (oldValue !== newValue) {
                this.adapter.emitChangeEvent(newValue, this.thumb);
            }
            this.adapter.emitDragEndEvent(newValue, this.thumb);
            this.thumb = null;
        };
        /**
         * For range, discrete slider, shows the value indicator on both thumbs.
         */
        MDCSliderFoundation.prototype.handleThumbMouseenter = function () {
            if (!this.isDiscrete || !this.isRange)
                return;
            this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.START);
            this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
        };
        /**
         * For range, discrete slider, hides the value indicator on both thumbs.
         */
        MDCSliderFoundation.prototype.handleThumbMouseleave = function () {
            var _a, _b;
            if (!this.isDiscrete || !this.isRange)
                return;
            if ((!((_b = (_a = this.adapter).shouldHideFocusStylesForPointerEvents) === null || _b === void 0 ? void 0 : _b.call(_a)) &&
                (this.adapter.isInputFocused(Thumb.START) ||
                    this.adapter.isInputFocused(Thumb.END))) ||
                this.thumb) {
                // Leave value indicator shown if either input is focused or the thumb is
                // being dragged.
                return;
            }
            this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.START);
            this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, Thumb.END);
        };
        MDCSliderFoundation.prototype.handleMousedownOrTouchstart = function (event) {
            var _this = this;
            var moveEventType = event.type === 'mousedown' ? 'mousemove' : 'touchmove';
            // After a down event on the slider root, listen for move events on
            // body (so the slider value is updated for events outside of the
            // slider root).
            this.adapter.registerBodyEventHandler(moveEventType, this.moveListener);
            var upHandler = function () {
                _this.handleUp();
                // Once the drag is finished (up event on body), remove the move
                // handler.
                _this.adapter.deregisterBodyEventHandler(moveEventType, _this.moveListener);
                // Also stop listening for subsequent up events.
                _this.adapter.deregisterEventHandler('mouseup', upHandler);
                _this.adapter.deregisterEventHandler('touchend', upHandler);
            };
            this.adapter.registerBodyEventHandler('mouseup', upHandler);
            this.adapter.registerBodyEventHandler('touchend', upHandler);
            this.handleDown(event);
        };
        MDCSliderFoundation.prototype.handlePointerdown = function (event) {
            var isPrimaryButton = event.button === 0;
            if (!isPrimaryButton)
                return;
            if (event.pointerId != null) {
                this.adapter.setPointerCapture(event.pointerId);
            }
            this.adapter.registerEventHandler('pointermove', this.moveListener);
            this.handleDown(event);
        };
        /**
         * Handles input `change` event by setting internal slider value to match
         * input's new value.
         */
        MDCSliderFoundation.prototype.handleInputChange = function (thumb) {
            var value = Number(this.adapter.getInputValue(thumb));
            if (thumb === Thumb.START) {
                this.setValueStart(value);
            }
            else {
                this.setValue(value);
            }
            this.adapter.emitChangeEvent(thumb === Thumb.START ? this.valueStart : this.value, thumb);
            this.adapter.emitInputEvent(thumb === Thumb.START ? this.valueStart : this.value, thumb);
        };
        /** Shows activated state and value indicator on thumb(s). */
        MDCSliderFoundation.prototype.handleInputFocus = function (thumb) {
            this.adapter.addThumbClass(cssClasses.THUMB_FOCUSED, thumb);
            if (!this.isDiscrete)
                return;
            this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, thumb);
            if (this.isRange) {
                var otherThumb = thumb === Thumb.START ? Thumb.END : Thumb.START;
                this.adapter.addThumbClass(cssClasses.THUMB_WITH_INDICATOR, otherThumb);
            }
        };
        /** Removes activated state and value indicator from thumb(s). */
        MDCSliderFoundation.prototype.handleInputBlur = function (thumb) {
            this.adapter.removeThumbClass(cssClasses.THUMB_FOCUSED, thumb);
            if (!this.isDiscrete)
                return;
            this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, thumb);
            if (this.isRange) {
                var otherThumb = thumb === Thumb.START ? Thumb.END : Thumb.START;
                this.adapter.removeThumbClass(cssClasses.THUMB_WITH_INDICATOR, otherThumb);
            }
        };
        /**
         * Emits custom dragStart event, along with focusing the underlying input.
         */
        MDCSliderFoundation.prototype.handleDragStart = function (event, value, thumb) {
            var _a, _b;
            this.adapter.emitDragStartEvent(value, thumb);
            this.adapter.focusInput(thumb);
            // Restore focused state and show the value indicator(s) (if present)
            // in case they were previously hidden on dragEnd.
            // This is needed if the input is already focused, in which case
            // #focusInput above wouldn't actually trigger #handleInputFocus,
            // which is why we need to invoke it manually here.
            if ((_b = (_a = this.adapter).shouldHideFocusStylesForPointerEvents) === null || _b === void 0 ? void 0 : _b.call(_a)) {
                this.handleInputFocus(thumb);
            }
            // Prevent the input (that we just focused) from losing focus.
            event.preventDefault();
        };
        /**
         * @return The thumb to be moved based on initial down event.
         */
        MDCSliderFoundation.prototype.getThumbFromDownEvent = function (clientX, value) {
            // For single point slider, thumb to be moved is always the END (only)
            // thumb.
            if (!this.isRange)
                return Thumb.END;
            // Check if event press point is in the bounds of any thumb.
            var thumbStartRect = this.adapter.getThumbBoundingClientRect(Thumb.START);
            var thumbEndRect = this.adapter.getThumbBoundingClientRect(Thumb.END);
            var inThumbStartBounds = clientX >= thumbStartRect.left && clientX <= thumbStartRect.right;
            var inThumbEndBounds = clientX >= thumbEndRect.left && clientX <= thumbEndRect.right;
            if (inThumbStartBounds && inThumbEndBounds) {
                // Thumbs overlapping. Thumb to be moved cannot be determined yet.
                return null;
            }
            // If press is in bounds for either thumb on down event, that's the thumb
            // to be moved.
            if (inThumbStartBounds) {
                return Thumb.START;
            }
            if (inThumbEndBounds) {
                return Thumb.END;
            }
            // For presses outside the range, return whichever thumb is closer.
            if (value < this.valueStart) {
                return Thumb.START;
            }
            if (value > this.value) {
                return Thumb.END;
            }
            // For presses inside the range, return whichever thumb is closer.
            return (value - this.valueStart <= this.value - value) ? Thumb.START :
                Thumb.END;
        };
        /**
         * @return The thumb to be moved based on move event (based on drag
         *     direction from original down event). Only applicable if thumbs
         *     were overlapping in the down event.
         */
        MDCSliderFoundation.prototype.getThumbFromMoveEvent = function (clientX) {
            // Thumb has already been chosen.
            if (this.thumb !== null)
                return this.thumb;
            if (this.downEventClientX === null) {
                throw new Error('`downEventClientX` is null after move event.');
            }
            var moveDistanceUnderThreshold = Math.abs(this.downEventClientX - clientX) < numbers.THUMB_UPDATE_MIN_PX;
            if (moveDistanceUnderThreshold)
                return this.thumb;
            var draggedThumbToLeft = clientX < this.downEventClientX;
            if (draggedThumbToLeft) {
                return this.adapter.isRTL() ? Thumb.END : Thumb.START;
            }
            else {
                return this.adapter.isRTL() ? Thumb.START : Thumb.END;
            }
        };
        /**
         * Updates UI based on internal state.
         * @param thumb Thumb whose value is being updated. If undefined, UI is
         *     updated for both thumbs based on current internal state.
         */
        MDCSliderFoundation.prototype.updateUI = function (thumb) {
            if (thumb) {
                this.updateThumbAndInputAttributes(thumb);
            }
            else {
                this.updateThumbAndInputAttributes(Thumb.START);
                this.updateThumbAndInputAttributes(Thumb.END);
            }
            this.updateThumbAndTrackUI(thumb);
            this.updateValueIndicatorUI(thumb);
            this.updateTickMarksUI();
        };
        /**
         * Updates thumb and input attributes based on current value.
         * @param thumb Thumb whose aria attributes to update.
         */
        MDCSliderFoundation.prototype.updateThumbAndInputAttributes = function (thumb) {
            if (!thumb)
                return;
            var value = this.isRange && thumb === Thumb.START ? this.valueStart : this.value;
            var valueStr = String(value);
            this.adapter.setInputAttribute(attributes.INPUT_VALUE, valueStr, thumb);
            if (this.isRange && thumb === Thumb.START) {
                this.adapter.setInputAttribute(attributes.INPUT_MIN, String(value + this.minRange), Thumb.END);
            }
            else if (this.isRange && thumb === Thumb.END) {
                this.adapter.setInputAttribute(attributes.INPUT_MAX, String(value - this.minRange), Thumb.START);
            }
            // Sync attribute with property.
            if (this.adapter.getInputValue(thumb) !== valueStr) {
                this.adapter.setInputValue(valueStr, thumb);
            }
            var valueToAriaValueTextFn = this.adapter.getValueToAriaValueTextFn();
            if (valueToAriaValueTextFn) {
                this.adapter.setInputAttribute(attributes.ARIA_VALUETEXT, valueToAriaValueTextFn(value, thumb), thumb);
            }
        };
        /**
         * Updates value indicator UI based on current value.
         * @param thumb Thumb whose value indicator to update. If undefined, all
         *     thumbs' value indicators are updated.
         */
        MDCSliderFoundation.prototype.updateValueIndicatorUI = function (thumb) {
            if (!this.isDiscrete)
                return;
            var value = this.isRange && thumb === Thumb.START ? this.valueStart : this.value;
            this.adapter.setValueIndicatorText(value, thumb === Thumb.START ? Thumb.START : Thumb.END);
            if (!thumb && this.isRange) {
                this.adapter.setValueIndicatorText(this.valueStart, Thumb.START);
            }
        };
        /**
         * Updates tick marks UI within slider, based on current min, max, and step.
         */
        MDCSliderFoundation.prototype.updateTickMarksUI = function () {
            if (!this.isDiscrete || !this.hasTickMarks)
                return;
            var numTickMarksInactiveStart = (this.valueStart - this.min) / this.step;
            var numTickMarksActive = (this.value - this.valueStart) / this.step + 1;
            var numTickMarksInactiveEnd = (this.max - this.value) / this.step;
            var tickMarksInactiveStart = Array.from({ length: numTickMarksInactiveStart })
                .fill(TickMark.INACTIVE);
            var tickMarksActive = Array.from({ length: numTickMarksActive })
                .fill(TickMark.ACTIVE);
            var tickMarksInactiveEnd = Array.from({ length: numTickMarksInactiveEnd })
                .fill(TickMark.INACTIVE);
            this.adapter.updateTickMarks(tickMarksInactiveStart.concat(tickMarksActive)
                .concat(tickMarksInactiveEnd));
        };
        /** Maps clientX to a value on the slider scale. */
        MDCSliderFoundation.prototype.mapClientXOnSliderScale = function (clientX) {
            var xPos = clientX - this.rect.left;
            var pctComplete = xPos / this.rect.width;
            if (this.adapter.isRTL()) {
                pctComplete = 1 - pctComplete;
            }
            // Fit the percentage complete between the range [min,max]
            // by remapping from [0, 1] to [min, min+(max-min)].
            var value = this.min + pctComplete * (this.max - this.min);
            if (value === this.max || value === this.min) {
                return value;
            }
            return Number(this.quantize(value).toFixed(this.numDecimalPlaces));
        };
        /** Calculates the quantized value based on step value. */
        MDCSliderFoundation.prototype.quantize = function (value) {
            var numSteps = Math.round((value - this.min) / this.step);
            return this.min + numSteps * this.step;
        };
        /**
         * Updates slider value (internal state and UI) based on the given value.
         */
        MDCSliderFoundation.prototype.updateValue = function (value, thumb, _a) {
            var _b = _a === void 0 ? {} : _a, emitInputEvent = _b.emitInputEvent;
            value = this.clampValue(value, thumb);
            if (this.isRange && thumb === Thumb.START) {
                // Exit early if current value is the same as the new value.
                if (this.valueStart === value)
                    return;
                this.valueStart = value;
            }
            else {
                // Exit early if current value is the same as the new value.
                if (this.value === value)
                    return;
                this.value = value;
            }
            this.updateUI(thumb);
            if (emitInputEvent) {
                this.adapter.emitInputEvent(thumb === Thumb.START ? this.valueStart : this.value, thumb);
            }
        };
        /**
         * Clamps the given value for the given thumb based on slider properties:
         * - Restricts value within [min, max].
         * - If range slider, clamp start value <= end value - min range, and
         *   end value >= start value + min range.
         */
        MDCSliderFoundation.prototype.clampValue = function (value, thumb) {
            // Clamp value to [min, max] range.
            value = Math.min(Math.max(value, this.min), this.max);
            var thumbStartMovedPastThumbEnd = this.isRange && thumb === Thumb.START &&
                value > this.value - this.minRange;
            if (thumbStartMovedPastThumbEnd) {
                return this.value - this.minRange;
            }
            var thumbEndMovedPastThumbStart = this.isRange && thumb === Thumb.END &&
                value < this.valueStart + this.minRange;
            if (thumbEndMovedPastThumbStart) {
                return this.valueStart + this.minRange;
            }
            return value;
        };
        /**
         * Updates the active track and thumb style properties to reflect current
         * value.
         */
        MDCSliderFoundation.prototype.updateThumbAndTrackUI = function (thumb) {
            var _this = this;
            var _a = this, max = _a.max, min = _a.min;
            var pctComplete = (this.value - this.valueStart) / (max - min);
            var rangePx = pctComplete * this.rect.width;
            var isRtl = this.adapter.isRTL();
            var transformProp = HAS_WINDOW ? getCorrectPropertyName(window, 'transform') : 'transform';
            if (this.isRange) {
                var thumbLeftPos_1 = this.adapter.isRTL() ?
                    (max - this.value) / (max - min) * this.rect.width :
                    (this.valueStart - min) / (max - min) * this.rect.width;
                var thumbRightPos_1 = thumbLeftPos_1 + rangePx;
                this.animFrame.request(AnimationKeys.SLIDER_UPDATE, function () {
                    // Set active track styles, accounting for animation direction by
                    // setting `transform-origin`.
                    var trackAnimatesFromRight = (!isRtl && thumb === Thumb.START) ||
                        (isRtl && thumb !== Thumb.START);
                    if (trackAnimatesFromRight) {
                        _this.adapter.setTrackActiveStyleProperty('transform-origin', 'right');
                        _this.adapter.setTrackActiveStyleProperty('left', 'auto');
                        _this.adapter.setTrackActiveStyleProperty('right', _this.rect.width - thumbRightPos_1 + "px");
                    }
                    else {
                        _this.adapter.setTrackActiveStyleProperty('transform-origin', 'left');
                        _this.adapter.setTrackActiveStyleProperty('right', 'auto');
                        _this.adapter.setTrackActiveStyleProperty('left', thumbLeftPos_1 + "px");
                    }
                    _this.adapter.setTrackActiveStyleProperty(transformProp, "scaleX(" + pctComplete + ")");
                    // Set thumb styles.
                    var thumbStartPos = isRtl ? thumbRightPos_1 : thumbLeftPos_1;
                    var thumbEndPos = _this.adapter.isRTL() ? thumbLeftPos_1 : thumbRightPos_1;
                    if (thumb === Thumb.START || !thumb || !_this.initialStylesRemoved) {
                        _this.adapter.setThumbStyleProperty(transformProp, "translateX(" + thumbStartPos + "px)", Thumb.START);
                        _this.alignValueIndicator(Thumb.START, thumbStartPos);
                    }
                    if (thumb === Thumb.END || !thumb || !_this.initialStylesRemoved) {
                        _this.adapter.setThumbStyleProperty(transformProp, "translateX(" + thumbEndPos + "px)", Thumb.END);
                        _this.alignValueIndicator(Thumb.END, thumbEndPos);
                    }
                    _this.removeInitialStyles(isRtl);
                    _this.updateOverlappingThumbsUI(thumbStartPos, thumbEndPos, thumb);
                });
            }
            else {
                this.animFrame.request(AnimationKeys.SLIDER_UPDATE, function () {
                    var thumbStartPos = isRtl ? _this.rect.width - rangePx : rangePx;
                    _this.adapter.setThumbStyleProperty(transformProp, "translateX(" + thumbStartPos + "px)", Thumb.END);
                    _this.alignValueIndicator(Thumb.END, thumbStartPos);
                    _this.adapter.setTrackActiveStyleProperty(transformProp, "scaleX(" + pctComplete + ")");
                    _this.removeInitialStyles(isRtl);
                });
            }
        };
        /**
         * Shifts the value indicator to either side if it would otherwise stick
         * beyond the slider's length while keeping the caret above the knob.
         */
        MDCSliderFoundation.prototype.alignValueIndicator = function (thumb, thumbPos) {
            if (!this.isDiscrete)
                return;
            var thumbHalfWidth = this.adapter.getThumbBoundingClientRect(thumb).width / 2;
            var containerWidth = this.adapter.getValueIndicatorContainerWidth(thumb);
            var sliderWidth = this.adapter.getBoundingClientRect().width;
            if (containerWidth / 2 > thumbPos + thumbHalfWidth) {
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_LEFT, thumbHalfWidth + "px", thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_RIGHT, 'auto', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_TRANSFORM, 'translateX(-50%)', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_LEFT, '0', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_RIGHT, 'auto', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_TRANSFORM, 'none', thumb);
            }
            else if (containerWidth / 2 > sliderWidth - thumbPos + thumbHalfWidth) {
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_LEFT, 'auto', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_RIGHT, thumbHalfWidth + "px", thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_TRANSFORM, 'translateX(50%)', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_LEFT, 'auto', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_RIGHT, '0', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_TRANSFORM, 'none', thumb);
            }
            else {
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_LEFT, '50%', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_RIGHT, 'auto', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CARET_TRANSFORM, 'translateX(-50%)', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_LEFT, '50%', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_RIGHT, 'auto', thumb);
                this.adapter.setThumbStyleProperty(strings.VAR_VALUE_INDICATOR_CONTAINER_TRANSFORM, 'translateX(-50%)', thumb);
            }
        };
        /**
         * Removes initial inline styles if not already removed. `left:<...>%`
         * inline styles can be added to position the thumb correctly before JS
         * initialization. However, they need to be removed before the JS starts
         * positioning the thumb. This is because the JS uses
         * `transform:translateX(<...>)px` (for performance reasons) to position
         * the thumb (which is not possible for initial styles since we need the
         * bounding rect measurements).
         */
        MDCSliderFoundation.prototype.removeInitialStyles = function (isRtl) {
            if (this.initialStylesRemoved)
                return;
            // Remove thumb position properties that were added for initial render.
            var position = isRtl ? 'right' : 'left';
            this.adapter.removeThumbStyleProperty(position, Thumb.END);
            if (this.isRange) {
                this.adapter.removeThumbStyleProperty(position, Thumb.START);
            }
            this.initialStylesRemoved = true;
            this.resetTrackAndThumbAnimation();
        };
        /**
         * Resets track/thumb animation to prevent animation when adding
         * `transform` styles to thumb initially.
         */
        MDCSliderFoundation.prototype.resetTrackAndThumbAnimation = function () {
            var _this = this;
            if (!this.isDiscrete)
                return;
            // Set transition properties to default (no animation), so that the
            // newly added `transform` styles do not animate thumb/track from
            // their default positions.
            var transitionProp = HAS_WINDOW ?
                getCorrectPropertyName(window, 'transition') :
                'transition';
            var transitionDefault = 'none 0s ease 0s';
            this.adapter.setThumbStyleProperty(transitionProp, transitionDefault, Thumb.END);
            if (this.isRange) {
                this.adapter.setThumbStyleProperty(transitionProp, transitionDefault, Thumb.START);
            }
            this.adapter.setTrackActiveStyleProperty(transitionProp, transitionDefault);
            // In the next frame, remove the transition inline styles we just
            // added, such that any animations added in the CSS can now take effect.
            requestAnimationFrame(function () {
                _this.adapter.removeThumbStyleProperty(transitionProp, Thumb.END);
                _this.adapter.removeTrackActiveStyleProperty(transitionProp);
                if (_this.isRange) {
                    _this.adapter.removeThumbStyleProperty(transitionProp, Thumb.START);
                }
            });
        };
        /**
         * Adds THUMB_TOP class to active thumb if thumb knobs overlap; otherwise
         * removes THUMB_TOP class from both thumbs.
         * @param thumb Thumb that is active (being moved).
         */
        MDCSliderFoundation.prototype.updateOverlappingThumbsUI = function (thumbStartPos, thumbEndPos, thumb) {
            var thumbsOverlap = false;
            if (this.adapter.isRTL()) {
                var startThumbLeftEdge = thumbStartPos - this.startThumbKnobWidth / 2;
                var endThumbRightEdge = thumbEndPos + this.endThumbKnobWidth / 2;
                thumbsOverlap = endThumbRightEdge >= startThumbLeftEdge;
            }
            else {
                var startThumbRightEdge = thumbStartPos + this.startThumbKnobWidth / 2;
                var endThumbLeftEdge = thumbEndPos - this.endThumbKnobWidth / 2;
                thumbsOverlap = startThumbRightEdge >= endThumbLeftEdge;
            }
            if (thumbsOverlap) {
                this.adapter.addThumbClass(cssClasses.THUMB_TOP, 
                // If no thumb was dragged (in the case of initial layout), end
                // thumb is on top by default.
                thumb || Thumb.END);
                this.adapter.removeThumbClass(cssClasses.THUMB_TOP, thumb === Thumb.START ? Thumb.END : Thumb.START);
            }
            else {
                this.adapter.removeThumbClass(cssClasses.THUMB_TOP, Thumb.START);
                this.adapter.removeThumbClass(cssClasses.THUMB_TOP, Thumb.END);
            }
        };
        /**
         * Converts attribute value to a number, e.g. '100' => 100. Throws errors
         * for invalid values.
         * @param attributeValue Attribute value, e.g. 100.
         * @param attributeName Attribute name, e.g. `aria-valuemax`.
         */
        MDCSliderFoundation.prototype.convertAttributeValueToNumber = function (attributeValue, attributeName) {
            if (attributeValue === null) {
                throw new Error('MDCSliderFoundation: `' + attributeName + '` must be non-null.');
            }
            var value = Number(attributeValue);
            if (isNaN(value)) {
                throw new Error('MDCSliderFoundation: `' + attributeName + '` value is `' +
                    attributeValue + '`, but must be a number.');
            }
            return value;
        };
        /** Checks that the given properties are valid slider values. */
        MDCSliderFoundation.prototype.validateProperties = function (_a) {
            var min = _a.min, max = _a.max, value = _a.value, valueStart = _a.valueStart, step = _a.step, minRange = _a.minRange;
            if (min >= max) {
                throw new Error("MDCSliderFoundation: min must be strictly less than max. " +
                    ("Current: [min: " + min + ", max: " + max + "]"));
            }
            if (step <= 0) {
                throw new Error("MDCSliderFoundation: step must be a positive number. " +
                    ("Current step: " + step));
            }
            if (this.isRange) {
                if (value < min || value > max || valueStart < min || valueStart > max) {
                    throw new Error("MDCSliderFoundation: values must be in [min, max] range. " +
                        ("Current values: [start value: " + valueStart + ", end value: ") +
                        (value + ", min: " + min + ", max: " + max + "]"));
                }
                if (valueStart > value) {
                    throw new Error("MDCSliderFoundation: start value must be <= end value. " +
                        ("Current values: [start value: " + valueStart + ", end value: " + value + "]"));
                }
                if (minRange < 0) {
                    throw new Error("MDCSliderFoundation: minimum range must be non-negative. " +
                        ("Current min range: " + minRange));
                }
                if (value - valueStart < minRange) {
                    throw new Error("MDCSliderFoundation: start value and end value must differ by at least " +
                        (minRange + ". Current values: [start value: " + valueStart + ", ") +
                        ("end value: " + value + "]"));
                }
                var numStepsValueStartFromMin = (valueStart - min) / step;
                var numStepsValueFromMin = (value - min) / step;
                if (!Number.isInteger(parseFloat(numStepsValueStartFromMin.toFixed(6))) ||
                    !Number.isInteger(parseFloat(numStepsValueFromMin.toFixed(6)))) {
                    throw new Error("MDCSliderFoundation: Slider values must be valid based on the " +
                        ("step value (" + step + "). Current values: [start value: ") +
                        (valueStart + ", end value: " + value + ", min: " + min + "]"));
                }
            }
            else { // Single point slider.
                if (value < min || value > max) {
                    throw new Error("MDCSliderFoundation: value must be in [min, max] range. " +
                        ("Current values: [value: " + value + ", min: " + min + ", max: " + max + "]"));
                }
                var numStepsValueFromMin = (value - min) / step;
                if (!Number.isInteger(parseFloat(numStepsValueFromMin.toFixed(6)))) {
                    throw new Error("MDCSliderFoundation: Slider value must be valid based on the " +
                        ("step value (" + step + "). Current value: " + value));
                }
            }
        };
        MDCSliderFoundation.prototype.registerEventHandlers = function () {
            this.adapter.registerWindowEventHandler('resize', this.resizeListener);
            if (MDCSliderFoundation.SUPPORTS_POINTER_EVENTS) {
                // If supported, use pointer events API with #setPointerCapture.
                this.adapter.registerEventHandler('pointerdown', this.pointerdownListener);
                this.adapter.registerEventHandler('pointerup', this.pointerupListener);
            }
            else {
                // Otherwise, fall back to mousedown/touchstart events.
                this.adapter.registerEventHandler('mousedown', this.mousedownOrTouchstartListener);
                this.adapter.registerEventHandler('touchstart', this.mousedownOrTouchstartListener);
            }
            if (this.isRange) {
                this.adapter.registerThumbEventHandler(Thumb.START, 'mouseenter', this.thumbMouseenterListener);
                this.adapter.registerThumbEventHandler(Thumb.START, 'mouseleave', this.thumbMouseleaveListener);
                this.adapter.registerInputEventHandler(Thumb.START, 'change', this.inputStartChangeListener);
                this.adapter.registerInputEventHandler(Thumb.START, 'focus', this.inputStartFocusListener);
                this.adapter.registerInputEventHandler(Thumb.START, 'blur', this.inputStartBlurListener);
            }
            this.adapter.registerThumbEventHandler(Thumb.END, 'mouseenter', this.thumbMouseenterListener);
            this.adapter.registerThumbEventHandler(Thumb.END, 'mouseleave', this.thumbMouseleaveListener);
            this.adapter.registerInputEventHandler(Thumb.END, 'change', this.inputEndChangeListener);
            this.adapter.registerInputEventHandler(Thumb.END, 'focus', this.inputEndFocusListener);
            this.adapter.registerInputEventHandler(Thumb.END, 'blur', this.inputEndBlurListener);
        };
        MDCSliderFoundation.prototype.deregisterEventHandlers = function () {
            this.adapter.deregisterWindowEventHandler('resize', this.resizeListener);
            if (MDCSliderFoundation.SUPPORTS_POINTER_EVENTS) {
                this.adapter.deregisterEventHandler('pointerdown', this.pointerdownListener);
                this.adapter.deregisterEventHandler('pointerup', this.pointerupListener);
            }
            else {
                this.adapter.deregisterEventHandler('mousedown', this.mousedownOrTouchstartListener);
                this.adapter.deregisterEventHandler('touchstart', this.mousedownOrTouchstartListener);
            }
            if (this.isRange) {
                this.adapter.deregisterThumbEventHandler(Thumb.START, 'mouseenter', this.thumbMouseenterListener);
                this.adapter.deregisterThumbEventHandler(Thumb.START, 'mouseleave', this.thumbMouseleaveListener);
                this.adapter.deregisterInputEventHandler(Thumb.START, 'change', this.inputStartChangeListener);
                this.adapter.deregisterInputEventHandler(Thumb.START, 'focus', this.inputStartFocusListener);
                this.adapter.deregisterInputEventHandler(Thumb.START, 'blur', this.inputStartBlurListener);
            }
            this.adapter.deregisterThumbEventHandler(Thumb.END, 'mouseenter', this.thumbMouseenterListener);
            this.adapter.deregisterThumbEventHandler(Thumb.END, 'mouseleave', this.thumbMouseleaveListener);
            this.adapter.deregisterInputEventHandler(Thumb.END, 'change', this.inputEndChangeListener);
            this.adapter.deregisterInputEventHandler(Thumb.END, 'focus', this.inputEndFocusListener);
            this.adapter.deregisterInputEventHandler(Thumb.END, 'blur', this.inputEndBlurListener);
        };
        MDCSliderFoundation.prototype.handlePointerup = function () {
            this.handleUp();
            this.adapter.deregisterEventHandler('pointermove', this.moveListener);
        };
        MDCSliderFoundation.SUPPORTS_POINTER_EVENTS = HAS_WINDOW && Boolean(window.PointerEvent) &&
            // #setPointerCapture is buggy on iOS, so we can't use pointer events
            // until the following bug is fixed:
            // https://bugs.webkit.org/show_bug.cgi?id=220196
            !isIOS();
        return MDCSliderFoundation;
    }(MDCFoundation));
    function isIOS() {
        // Source:
        // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
        return [
            'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone',
            'iPod'
        ].includes(navigator.platform)
            // iPad on iOS 13 detection
            || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
    }
    /**
     * Given a number, returns the number of digits that appear after the
     * decimal point.
     * See
     * https://stackoverflow.com/questions/9539513/is-there-a-reliable-way-in-javascript-to-obtain-the-number-of-decimal-places-of
     */
    function getNumDecimalPlaces(n) {
        // Pull out the fraction and the exponent.
        var match = /(?:\.(\d+))?(?:[eE]([+\-]?\d+))?$/.exec(String(n));
        // NaN or Infinity or integer.
        // We arbitrarily decide that Infinity is integral.
        if (!match)
            return 0;
        var fraction = match[1] || ''; // E.g. 1.234e-2 => 234
        var exponent = match[2] || 0; // E.g. 1.234e-2 => -2
        // Count the number of digits in the fraction and subtract the
        // exponent to simulate moving the decimal point left by exponent places.
        // 1.234e+2 has 1 fraction digit and '234'.length -  2 == 1
        // 1.234e-2 has 5 fraction digit and '234'.length - -2 == 5
        return Math.max(0, // lower limit
        (fraction === '0' ? 0 : fraction.length) - Number(exponent));
    }

    function classMap(classObj) {
        return Object.entries(classObj)
            .filter(([name, value]) => name !== '' && value)
            .map(([name]) => name)
            .join(' ');
    }

    function dispatch(element, eventType, detail, eventInit = { bubbles: true }, 
    /** This is an internal thing used by SMUI to duplicate some SMUI events as MDC events. */
    duplicateEventForMDC = false) {
        if (typeof Event !== 'undefined' && element) {
            const event = new CustomEvent(eventType, Object.assign(Object.assign({}, eventInit), { detail }));
            element === null || element === void 0 ? void 0 : element.dispatchEvent(event);
            if (duplicateEventForMDC && eventType.startsWith('SMUI')) {
                const duplicateEvent = new CustomEvent(eventType.replace(/^SMUI/g, () => 'MDC'), Object.assign(Object.assign({}, eventInit), { detail }));
                element === null || element === void 0 ? void 0 : element.dispatchEvent(duplicateEvent);
                if (duplicateEvent.defaultPrevented) {
                    event.preventDefault();
                }
            }
            return event;
        }
    }

    function exclude(obj, keys) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const cashIndex = name.indexOf('$');
            if (cashIndex !== -1 &&
                keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
                continue;
            }
            if (keys.indexOf(name) !== -1) {
                continue;
            }
            newObj[name] = obj[name];
        }
        return newObj;
    }

    // Match old modifiers. (only works on DOM events)
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match new modifiers.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    function forwardEventsBuilder(component) {
        // This is our pseudo $on function. It is defined on component mount.
        let $on;
        // This is a list of events bound before mount.
        let events = [];
        // And we override the $on function to forward all bound events.
        component.$on = (fullEventType, callback) => {
            let eventType = fullEventType;
            let destructor = () => { };
            if ($on) {
                // The event was bound programmatically.
                destructor = $on(eventType, callback);
            }
            else {
                // The event was bound before mount by Svelte.
                events.push([eventType, callback]);
            }
            const oldModifierMatch = eventType.match(oldModifierRegex);
            if (oldModifierMatch && console) {
                console.warn('Event modifiers in SMUI now use "$" instead of ":", so that ' +
                    'all events can be bound with modifiers. Please update your ' +
                    'event binding: ', eventType);
            }
            return () => {
                destructor();
            };
        };
        function forward(e) {
            // Internally bubble the event up from Svelte components.
            bubble(component, e);
        }
        return (node) => {
            const destructors = [];
            const forwardDestructors = {};
            // This function is responsible for listening and forwarding
            // all bound events.
            $on = (fullEventType, callback) => {
                let eventType = fullEventType;
                let handler = callback;
                // DOM addEventListener options argument.
                let options = false;
                const oldModifierMatch = eventType.match(oldModifierRegex);
                const newModifierMatch = eventType.match(newModifierRegex);
                const modifierMatch = oldModifierMatch || newModifierMatch;
                if (eventType.match(/^SMUI:\w+:/)) {
                    const newEventTypeParts = eventType.split(':');
                    let newEventType = '';
                    for (let i = 0; i < newEventTypeParts.length; i++) {
                        newEventType +=
                            i === newEventTypeParts.length - 1
                                ? ':' + newEventTypeParts[i]
                                : newEventTypeParts[i]
                                    .split('-')
                                    .map((value) => value.slice(0, 1).toUpperCase() + value.slice(1))
                                    .join('');
                    }
                    console.warn(`The event ${eventType.split('$')[0]} has been renamed to ${newEventType.split('$')[0]}.`);
                    eventType = newEventType;
                }
                if (modifierMatch) {
                    // Parse the event modifiers.
                    // Supported modifiers:
                    // - preventDefault
                    // - stopPropagation
                    // - passive
                    // - nonpassive
                    // - capture
                    // - once
                    const parts = eventType.split(oldModifierMatch ? ':' : '$');
                    eventType = parts[0];
                    const eventOptions = parts.slice(1).reduce((obj, mod) => {
                        obj[mod] = true;
                        return obj;
                    }, {});
                    if (eventOptions.passive) {
                        options = options || {};
                        options.passive = true;
                    }
                    if (eventOptions.nonpassive) {
                        options = options || {};
                        options.passive = false;
                    }
                    if (eventOptions.capture) {
                        options = options || {};
                        options.capture = true;
                    }
                    if (eventOptions.once) {
                        options = options || {};
                        options.once = true;
                    }
                    if (eventOptions.preventDefault) {
                        handler = prevent_default(handler);
                    }
                    if (eventOptions.stopPropagation) {
                        handler = stop_propagation(handler);
                    }
                }
                // Listen for the event directly, with the given options.
                const off = listen(node, eventType, handler, options);
                const destructor = () => {
                    off();
                    const idx = destructors.indexOf(destructor);
                    if (idx > -1) {
                        destructors.splice(idx, 1);
                    }
                };
                destructors.push(destructor);
                // Forward the event from Svelte.
                if (!(eventType in forwardDestructors)) {
                    forwardDestructors[eventType] = listen(node, eventType, forward);
                }
                return destructor;
            };
            for (let i = 0; i < events.length; i++) {
                // Listen to all the events added before mount.
                $on(events[i][0], events[i][1]);
            }
            return {
                destroy: () => {
                    // Remove all event listeners.
                    for (let i = 0; i < destructors.length; i++) {
                        destructors[i]();
                    }
                    // Remove all event forwarders.
                    for (let entry of Object.entries(forwardDestructors)) {
                        entry[1]();
                    }
                },
            };
        };
    }

    function prefixFilter(obj, prefix) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            if (name.substring(0, prefix.length) === prefix) {
                newObj[name.substring(prefix.length)] = obj[name];
            }
        }
        return newObj;
    }

    function useActions(node, actions) {
        let actionReturns = [];
        if (actions) {
            for (let i = 0; i < actions.length; i++) {
                const actionEntry = actions[i];
                const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
                if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                    actionReturns.push(action(node, actionEntry[1]));
                }
                else {
                    actionReturns.push(action(node));
                }
            }
        }
        return {
            update(actions) {
                if (((actions && actions.length) || 0) != actionReturns.length) {
                    throw new Error('You must not change the length of an actions array.');
                }
                if (actions) {
                    for (let i = 0; i < actions.length; i++) {
                        const returnEntry = actionReturns[i];
                        if (returnEntry && returnEntry.update) {
                            const actionEntry = actions[i];
                            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                                returnEntry.update(actionEntry[1]);
                            }
                            else {
                                returnEntry.update();
                            }
                        }
                    }
                }
            },
            destroy() {
                for (let i = 0; i < actionReturns.length; i++) {
                    const returnEntry = actionReturns[i];
                    if (returnEntry && returnEntry.destroy) {
                        returnEntry.destroy();
                    }
                }
            },
        };
    }

    const { applyPassive } = events;
    const { matches } = ponyfill;
    function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve(), } = {}) {
        let instance;
        let addLayoutListener = getContext('SMUI:addLayoutListener');
        let removeLayoutListener;
        let oldActive = active;
        let oldEventTarget = eventTarget;
        let oldActiveTarget = activeTarget;
        function handleProps() {
            if (surface) {
                addClass('mdc-ripple-surface');
                if (color === 'primary') {
                    addClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                else if (color === 'secondary') {
                    removeClass('smui-ripple-surface--primary');
                    addClass('smui-ripple-surface--secondary');
                }
                else {
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
            }
            else {
                removeClass('mdc-ripple-surface');
                removeClass('smui-ripple-surface--primary');
                removeClass('smui-ripple-surface--secondary');
            }
            // Handle activation first.
            if (instance && oldActive !== active) {
                oldActive = active;
                if (active) {
                    instance.activate();
                }
                else if (active === false) {
                    instance.deactivate();
                }
            }
            // Then create/destroy an instance.
            if (ripple && !instance) {
                instance = new MDCRippleFoundation({
                    addClass,
                    browserSupportsCssVars: () => supportsCssVariables(window),
                    computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
                    containsEventTarget: (target) => node.contains(target),
                    deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
                    deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
                    deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
                    getWindowPageOffset: () => ({
                        x: window.pageXOffset,
                        y: window.pageYOffset,
                    }),
                    isSurfaceActive: () => active == null ? matches(activeTarget || node, ':active') : active,
                    isSurfaceDisabled: () => !!disabled,
                    isUnbounded: () => !!unbounded,
                    registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
                    registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
                    registerResizeHandler: (handler) => window.addEventListener('resize', handler),
                    removeClass,
                    updateCssVariable: addStyle,
                });
                initPromise.then(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            else if (instance && !ripple) {
                initPromise.then(() => {
                    if (instance) {
                        instance.destroy();
                        instance = undefined;
                    }
                });
            }
            // Now handle event/active targets
            if (instance &&
                (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
                oldEventTarget = eventTarget;
                oldActiveTarget = activeTarget;
                instance.destroy();
                requestAnimationFrame(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            if (!ripple && unbounded) {
                addClass('mdc-ripple-upgraded--unbounded');
            }
        }
        handleProps();
        if (addLayoutListener) {
            removeLayoutListener = addLayoutListener(layout);
        }
        function layout() {
            if (instance) {
                instance.layout();
            }
        }
        return {
            update(props) {
                ({
                    ripple,
                    surface,
                    unbounded,
                    disabled,
                    color,
                    active,
                    rippleElement,
                    eventTarget,
                    activeTarget,
                    addClass,
                    removeClass,
                    addStyle,
                    initPromise,
                } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: undefined, active: undefined, rippleElement: undefined, eventTarget: undefined, activeTarget: undefined, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
                handleProps();
            },
            destroy() {
                if (instance) {
                    instance.destroy();
                    instance = undefined;
                    removeClass('mdc-ripple-surface');
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                if (removeLayoutListener) {
                    removeLayoutListener();
                }
            },
        };
    }

    /* node_modules\@smui\slider\dist\Slider.svelte generated by Svelte v3.51.0 */
    const file$1 = "node_modules\\@smui\\slider\\dist\\Slider.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[92] = list[i];
    	return child_ctx;
    }

    // (56:2) {:else}
    function create_else_block_1(ctx) {
    	let input_1;
    	let input_1_class_value;
    	let mounted;
    	let dispose;

    	let input_1_levels = [
    		{
    			class: input_1_class_value = classMap({
    				[/*input$class*/ ctx[13]]: true,
    				'mdc-slider__input': true
    			})
    		},
    		{ type: "range" },
    		{ disabled: /*disabled*/ ctx[5] },
    		{ step: /*step*/ ctx[9] },
    		{ min: /*min*/ ctx[10] },
    		{ max: /*max*/ ctx[11] },
    		/*inputProps*/ ctx[33],
    		/*inputAttrs*/ ctx[24],
    		prefixFilter(/*$$restProps*/ ctx[37], 'input$')
    	];

    	let input_1_data = {};

    	for (let i = 0; i < input_1_levels.length; i += 1) {
    		input_1_data = assign(input_1_data, input_1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input_1 = element("input");
    			set_attributes(input_1, input_1_data);
    			add_location(input_1, file$1, 56, 4, 1267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);
    			if (input_1.autofocus) input_1.focus();
    			/*input_1_binding*/ ctx[62](input_1);
    			set_input_value(input_1, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "change", /*input_1_change_input_handler*/ ctx[63]),
    					listen_dev(input_1, "input", /*input_1_change_input_handler*/ ctx[63]),
    					listen_dev(input_1, "blur", /*blur_handler_2*/ ctx[56], false, false, false),
    					listen_dev(input_1, "focus", /*focus_handler_2*/ ctx[57], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input_1, input_1_data = get_spread_update(input_1_levels, [
    				dirty[0] & /*input$class*/ 8192 && input_1_class_value !== (input_1_class_value = classMap({
    					[/*input$class*/ ctx[13]]: true,
    					'mdc-slider__input': true
    				})) && { class: input_1_class_value },
    				{ type: "range" },
    				dirty[0] & /*disabled*/ 32 && { disabled: /*disabled*/ ctx[5] },
    				dirty[0] & /*step*/ 512 && { step: /*step*/ ctx[9] },
    				dirty[0] & /*min*/ 1024 && { min: /*min*/ ctx[10] },
    				dirty[0] & /*max*/ 2048 && { max: /*max*/ ctx[11] },
    				/*inputProps*/ ctx[33],
    				dirty[0] & /*inputAttrs*/ 16777216 && /*inputAttrs*/ ctx[24],
    				dirty[1] & /*$$restProps*/ 64 && prefixFilter(/*$$restProps*/ ctx[37], 'input$')
    			]));

    			if (dirty[0] & /*value*/ 1) {
    				set_input_value(input_1, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    			/*input_1_binding*/ ctx[62](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(56:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (20:2) {#if range}
    function create_if_block_5(ctx) {
    	let input0;
    	let input0_class_value;
    	let t;
    	let input1;
    	let input1_class_value;
    	let mounted;
    	let dispose;

    	let input0_levels = [
    		{
    			class: input0_class_value = classMap({
    				[/*input$class*/ ctx[13]]: true,
    				'mdc-slider__input': true
    			})
    		},
    		{ type: "range" },
    		{ disabled: /*disabled*/ ctx[5] },
    		{ step: /*step*/ ctx[9] },
    		{ min: /*min*/ ctx[10] },
    		{ max: /*end*/ ctx[2] },
    		/*inputStartAttrs*/ ctx[25],
    		prefixFilter(/*$$restProps*/ ctx[37], 'input$')
    	];

    	let input0_data = {};

    	for (let i = 0; i < input0_levels.length; i += 1) {
    		input0_data = assign(input0_data, input0_levels[i]);
    	}

    	let input1_levels = [
    		{
    			class: input1_class_value = classMap({
    				[/*input$class*/ ctx[13]]: true,
    				'mdc-slider__input': true
    			})
    		},
    		{ type: "range" },
    		{ disabled: /*disabled*/ ctx[5] },
    		{ step: /*step*/ ctx[9] },
    		{ min: /*start*/ ctx[1] },
    		{ max: /*max*/ ctx[11] },
    		/*inputProps*/ ctx[33],
    		/*inputAttrs*/ ctx[24],
    		prefixFilter(/*$$restProps*/ ctx[37], 'input$')
    	];

    	let input1_data = {};

    	for (let i = 0; i < input1_levels.length; i += 1) {
    		input1_data = assign(input1_data, input1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t = space();
    			input1 = element("input");
    			set_attributes(input0, input0_data);
    			add_location(input0, file$1, 20, 4, 545);
    			set_attributes(input1, input1_data);
    			add_location(input1, file$1, 37, 4, 895);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			if (input0.autofocus) input0.focus();
    			/*input0_binding*/ ctx[58](input0);
    			set_input_value(input0, /*start*/ ctx[1]);
    			insert_dev(target, t, anchor);
    			insert_dev(target, input1, anchor);
    			if (input1.autofocus) input1.focus();
    			/*input1_binding*/ ctx[60](input1);
    			set_input_value(input1, /*end*/ ctx[2]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_input_handler*/ ctx[59]),
    					listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[59]),
    					listen_dev(input0, "blur", /*blur_handler*/ ctx[54], false, false, false),
    					listen_dev(input0, "focus", /*focus_handler*/ ctx[55], false, false, false),
    					listen_dev(input1, "change", /*input1_change_input_handler*/ ctx[61]),
    					listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[61]),
    					listen_dev(input1, "blur", /*blur_handler_1*/ ctx[52], false, false, false),
    					listen_dev(input1, "focus", /*focus_handler_1*/ ctx[53], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input0, input0_data = get_spread_update(input0_levels, [
    				dirty[0] & /*input$class*/ 8192 && input0_class_value !== (input0_class_value = classMap({
    					[/*input$class*/ ctx[13]]: true,
    					'mdc-slider__input': true
    				})) && { class: input0_class_value },
    				{ type: "range" },
    				dirty[0] & /*disabled*/ 32 && { disabled: /*disabled*/ ctx[5] },
    				dirty[0] & /*step*/ 512 && { step: /*step*/ ctx[9] },
    				dirty[0] & /*min*/ 1024 && { min: /*min*/ ctx[10] },
    				dirty[0] & /*end*/ 4 && { max: /*end*/ ctx[2] },
    				dirty[0] & /*inputStartAttrs*/ 33554432 && /*inputStartAttrs*/ ctx[25],
    				dirty[1] & /*$$restProps*/ 64 && prefixFilter(/*$$restProps*/ ctx[37], 'input$')
    			]));

    			if (dirty[0] & /*start*/ 2) {
    				set_input_value(input0, /*start*/ ctx[1]);
    			}

    			set_attributes(input1, input1_data = get_spread_update(input1_levels, [
    				dirty[0] & /*input$class*/ 8192 && input1_class_value !== (input1_class_value = classMap({
    					[/*input$class*/ ctx[13]]: true,
    					'mdc-slider__input': true
    				})) && { class: input1_class_value },
    				{ type: "range" },
    				dirty[0] & /*disabled*/ 32 && { disabled: /*disabled*/ ctx[5] },
    				dirty[0] & /*step*/ 512 && { step: /*step*/ ctx[9] },
    				dirty[0] & /*start*/ 2 && { min: /*start*/ ctx[1] },
    				dirty[0] & /*max*/ 2048 && { max: /*max*/ ctx[11] },
    				/*inputProps*/ ctx[33],
    				dirty[0] & /*inputAttrs*/ 16777216 && /*inputAttrs*/ ctx[24],
    				dirty[1] & /*$$restProps*/ 64 && prefixFilter(/*$$restProps*/ ctx[37], 'input$')
    			]));

    			if (dirty[0] & /*end*/ 4) {
    				set_input_value(input1, /*end*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			/*input0_binding*/ ctx[58](null);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(input1);
    			/*input1_binding*/ ctx[60](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(20:2) {#if range}",
    		ctx
    	});

    	return block;
    }

    // (87:4) {#if discrete && tickMarks && step > 0}
    function create_if_block_4(ctx) {
    	let div;
    	let each_value = /*currentTickMarks*/ ctx[31];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "mdc-slider__tick-marks");
    			add_location(div, file$1, 87, 6, 2003);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*currentTickMarks*/ 1) {
    				each_value = /*currentTickMarks*/ ctx[31];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(87:4) {#if discrete && tickMarks && step > 0}",
    		ctx
    	});

    	return block;
    }

    // (89:8) {#each currentTickMarks as tickMark}
    function create_each_block(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");

    			attr_dev(div, "class", div_class_value = /*tickMark*/ ctx[92] === TickMark.ACTIVE
    			? 'mdc-slider__tick-mark--active'
    			: 'mdc-slider__tick-mark--inactive');

    			add_location(div, file$1, 89, 10, 2095);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*currentTickMarks*/ 1 && div_class_value !== (div_class_value = /*tickMark*/ ctx[92] === TickMark.ACTIVE
    			? 'mdc-slider__tick-mark--active'
    			: 'mdc-slider__tick-mark--inactive')) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(89:8) {#each currentTickMarks as tickMark}",
    		ctx
    	});

    	return block;
    }

    // (158:2) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let div1_class_value;
    	let div1_style_value;
    	let Ripple_action;
    	let mounted;
    	let dispose;
    	let if_block = /*discrete*/ ctx[7] && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			attr_dev(div0, "class", "mdc-slider__thumb-knob");
    			add_location(div0, file$1, 185, 6, 5243);

    			attr_dev(div1, "class", div1_class_value = classMap({
    				'mdc-slider__thumb': true,
    				.../*thumbClasses*/ ctx[23]
    			}));

    			attr_dev(div1, "style", div1_style_value = Object.entries(/*thumbStyles*/ ctx[27]).map(func_3).join(' '));
    			add_location(div1, file$1, 158, 4, 4337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			/*div0_binding_1*/ ctx[74](div0);
    			/*div1_binding_1*/ ctx[75](div1);

    			if (!mounted) {
    				dispose = action_destroyer(Ripple_action = Ripple.call(null, div1, {
    					unbounded: true,
    					disabled: /*disabled*/ ctx[5],
    					active: /*thumbRippleActive*/ ctx[29],
    					eventTarget: /*input*/ ctx[15],
    					activeTarget: /*input*/ ctx[15],
    					addClass: /*Ripple_function_6*/ ctx[76],
    					removeClass: /*Ripple_function_7*/ ctx[77],
    					addStyle: /*Ripple_function_8*/ ctx[78]
    				}));

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*discrete*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*thumbClasses*/ 8388608 && div1_class_value !== (div1_class_value = classMap({
    				'mdc-slider__thumb': true,
    				.../*thumbClasses*/ ctx[23]
    			}))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty[0] & /*thumbStyles*/ 134217728 && div1_style_value !== (div1_style_value = Object.entries(/*thumbStyles*/ ctx[27]).map(func_3).join(' '))) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & /*disabled, thumbRippleActive, input*/ 536903712) Ripple_action.update.call(null, {
    				unbounded: true,
    				disabled: /*disabled*/ ctx[5],
    				active: /*thumbRippleActive*/ ctx[29],
    				eventTarget: /*input*/ ctx[15],
    				activeTarget: /*input*/ ctx[15],
    				addClass: /*Ripple_function_6*/ ctx[76],
    				removeClass: /*Ripple_function_7*/ ctx[77],
    				addStyle: /*Ripple_function_8*/ ctx[78]
    			});
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			/*div0_binding_1*/ ctx[74](null);
    			/*div1_binding_1*/ ctx[75](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(158:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (99:2) {#if range}
    function create_if_block(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let div1_class_value;
    	let div1_style_value;
    	let Ripple_action;
    	let t1;
    	let div3;
    	let t2;
    	let div2;
    	let div3_class_value;
    	let div3_style_value;
    	let Ripple_action_1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*discrete*/ ctx[7] && create_if_block_2(ctx);
    	let if_block1 = /*discrete*/ ctx[7] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			div3 = element("div");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "mdc-slider__thumb-knob");
    			add_location(div0, file$1, 126, 6, 3266);

    			attr_dev(div1, "class", div1_class_value = classMap({
    				'mdc-slider__thumb': true,
    				.../*thumbStartClasses*/ ctx[22]
    			}));

    			attr_dev(div1, "style", div1_style_value = Object.entries(/*thumbStartStyles*/ ctx[28]).map(func_1).join(' '));
    			add_location(div1, file$1, 99, 4, 2326);
    			attr_dev(div2, "class", "mdc-slider__thumb-knob");
    			add_location(div2, file$1, 155, 6, 4251);

    			attr_dev(div3, "class", div3_class_value = classMap({
    				'mdc-slider__thumb': true,
    				.../*thumbClasses*/ ctx[23]
    			}));

    			attr_dev(div3, "style", div3_style_value = Object.entries(/*thumbStyles*/ ctx[27]).map(func_2).join(' '));
    			add_location(div3, file$1, 128, 4, 3347);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			/*div0_binding*/ ctx[64](div0);
    			/*div1_binding*/ ctx[65](div1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			/*div2_binding*/ ctx[69](div2);
    			/*div3_binding*/ ctx[70](div3);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Ripple_action = Ripple.call(null, div1, {
    						unbounded: true,
    						disabled: /*disabled*/ ctx[5],
    						active: /*thumbStartRippleActive*/ ctx[30],
    						eventTarget: /*inputStart*/ ctx[16],
    						activeTarget: /*inputStart*/ ctx[16],
    						addClass: /*Ripple_function*/ ctx[66],
    						removeClass: /*Ripple_function_1*/ ctx[67],
    						addStyle: /*Ripple_function_2*/ ctx[68]
    					})),
    					action_destroyer(Ripple_action_1 = Ripple.call(null, div3, {
    						unbounded: true,
    						disabled: /*disabled*/ ctx[5],
    						active: /*thumbRippleActive*/ ctx[29],
    						eventTarget: /*input*/ ctx[15],
    						activeTarget: /*input*/ ctx[15],
    						addClass: /*Ripple_function_3*/ ctx[71],
    						removeClass: /*Ripple_function_4*/ ctx[72],
    						addStyle: /*Ripple_function_5*/ ctx[73]
    					}))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*discrete*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div1, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty[0] & /*thumbStartClasses*/ 4194304 && div1_class_value !== (div1_class_value = classMap({
    				'mdc-slider__thumb': true,
    				.../*thumbStartClasses*/ ctx[22]
    			}))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty[0] & /*thumbStartStyles*/ 268435456 && div1_style_value !== (div1_style_value = Object.entries(/*thumbStartStyles*/ ctx[28]).map(func_1).join(' '))) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (Ripple_action && is_function(Ripple_action.update) && dirty[0] & /*disabled, thumbStartRippleActive, inputStart*/ 1073807392) Ripple_action.update.call(null, {
    				unbounded: true,
    				disabled: /*disabled*/ ctx[5],
    				active: /*thumbStartRippleActive*/ ctx[30],
    				eventTarget: /*inputStart*/ ctx[16],
    				activeTarget: /*inputStart*/ ctx[16],
    				addClass: /*Ripple_function*/ ctx[66],
    				removeClass: /*Ripple_function_1*/ ctx[67],
    				addStyle: /*Ripple_function_2*/ ctx[68]
    			});

    			if (/*discrete*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					if_block1.m(div3, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty[0] & /*thumbClasses*/ 8388608 && div3_class_value !== (div3_class_value = classMap({
    				'mdc-slider__thumb': true,
    				.../*thumbClasses*/ ctx[23]
    			}))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (dirty[0] & /*thumbStyles*/ 134217728 && div3_style_value !== (div3_style_value = Object.entries(/*thumbStyles*/ ctx[27]).map(func_2).join(' '))) {
    				attr_dev(div3, "style", div3_style_value);
    			}

    			if (Ripple_action_1 && is_function(Ripple_action_1.update) && dirty[0] & /*disabled, thumbRippleActive, input*/ 536903712) Ripple_action_1.update.call(null, {
    				unbounded: true,
    				disabled: /*disabled*/ ctx[5],
    				active: /*thumbRippleActive*/ ctx[29],
    				eventTarget: /*input*/ ctx[15],
    				activeTarget: /*input*/ ctx[15],
    				addClass: /*Ripple_function_3*/ ctx[71],
    				removeClass: /*Ripple_function_4*/ ctx[72],
    				addStyle: /*Ripple_function_5*/ ctx[73]
    			});
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			/*div0_binding*/ ctx[64](null);
    			/*div1_binding*/ ctx[65](null);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			if (if_block1) if_block1.d();
    			/*div2_binding*/ ctx[69](null);
    			/*div3_binding*/ ctx[70](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(99:2) {#if range}",
    		ctx
    	});

    	return block;
    }

    // (179:6) {#if discrete}
    function create_if_block_3(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t = text(/*value*/ ctx[0]);
    			attr_dev(span, "class", "mdc-slider__value-indicator-text");
    			add_location(span, file$1, 181, 12, 5131);
    			attr_dev(div0, "class", "mdc-slider__value-indicator");
    			add_location(div0, file$1, 180, 10, 5077);
    			attr_dev(div1, "class", "mdc-slider__value-indicator-container");
    			attr_dev(div1, "aria-hidden", "true");
    			add_location(div1, file$1, 179, 8, 4996);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1) set_data_dev(t, /*value*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(179:6) {#if discrete}",
    		ctx
    	});

    	return block;
    }

    // (120:6) {#if discrete}
    function create_if_block_2(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t = text(/*start*/ ctx[1]);
    			attr_dev(span, "class", "mdc-slider__value-indicator-text");
    			add_location(span, file$1, 122, 12, 3154);
    			attr_dev(div0, "class", "mdc-slider__value-indicator");
    			add_location(div0, file$1, 121, 10, 3100);
    			attr_dev(div1, "class", "mdc-slider__value-indicator-container");
    			attr_dev(div1, "aria-hidden", "true");
    			add_location(div1, file$1, 120, 8, 3019);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*start*/ 2) set_data_dev(t, /*start*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(120:6) {#if discrete}",
    		ctx
    	});

    	return block;
    }

    // (149:6) {#if discrete}
    function create_if_block_1(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t = text(/*end*/ ctx[2]);
    			attr_dev(span, "class", "mdc-slider__value-indicator-text");
    			add_location(span, file$1, 151, 12, 4141);
    			attr_dev(div0, "class", "mdc-slider__value-indicator");
    			add_location(div0, file$1, 150, 10, 4087);
    			attr_dev(div1, "class", "mdc-slider__value-indicator-container");
    			attr_dev(div1, "aria-hidden", "true");
    			add_location(div1, file$1, 149, 8, 4006);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*end*/ 4) set_data_dev(t, /*end*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(149:6) {#if discrete}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div4;
    	let t0;
    	let div3;
    	let div0;
    	let t1;
    	let div2;
    	let div1;
    	let div1_style_value;
    	let t2;
    	let t3;
    	let div4_class_value;
    	let useActions_action;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*range*/ ctx[6]) return create_if_block_5;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*discrete*/ ctx[7] && /*tickMarks*/ ctx[8] && /*step*/ ctx[9] > 0 && create_if_block_4(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*range*/ ctx[6]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block2 = current_block_type_1(ctx);

    	let div4_levels = [
    		{
    			class: div4_class_value = Object.entries({
    				[/*className*/ ctx[4]]: true,
    				'mdc-slider': true,
    				'mdc-slider--range': /*range*/ ctx[6],
    				'mdc-slider--discrete': /*discrete*/ ctx[7],
    				'mdc-slider--tick-marks': /*discrete*/ ctx[7] && /*tickMarks*/ ctx[8],
    				'mdc-slider--disabled': /*disabled*/ ctx[5],
    				.../*internalClasses*/ ctx[21]
    			}).filter(func_4).map(func_5).join(' ')
    		},
    		/*range*/ ctx[6]
    		? {
    				'data-min-range': `${/*minRange*/ ctx[12]}`
    			}
    		: {},
    		exclude(/*$$restProps*/ ctx[37], ['input$'])
    	];

    	let div4_data = {};

    	for (let i = 0; i < div4_levels.length; i += 1) {
    		div4_data = assign(div4_data, div4_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			if_block0.c();
    			t0 = space();
    			div3 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if_block2.c();
    			attr_dev(div0, "class", "mdc-slider__track--inactive");
    			add_location(div0, file$1, 77, 4, 1660);
    			attr_dev(div1, "class", "mdc-slider__track--active_fill");
    			attr_dev(div1, "style", div1_style_value = Object.entries(/*trackActiveStyles*/ ctx[26]).map(func).join(' '));
    			add_location(div1, file$1, 79, 6, 1754);
    			attr_dev(div2, "class", "mdc-slider__track--active");
    			add_location(div2, file$1, 78, 4, 1708);
    			attr_dev(div3, "class", "mdc-slider__track");
    			add_location(div3, file$1, 76, 2, 1624);
    			set_attributes(div4, div4_data);
    			add_location(div4, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			if_block0.m(div4, null);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div3, t2);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div4, t3);
    			if_block2.m(div4, null);
    			/*div4_binding*/ ctx[79](div4);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div4, /*use*/ ctx[3])),
    					action_destroyer(/*forwardEvents*/ ctx[32].call(null, div4))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div4, t0);
    				}
    			}

    			if (dirty[0] & /*trackActiveStyles*/ 67108864 && div1_style_value !== (div1_style_value = Object.entries(/*trackActiveStyles*/ ctx[26]).map(func).join(' '))) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (/*discrete*/ ctx[7] && /*tickMarks*/ ctx[8] && /*step*/ ctx[9] > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					if_block1.m(div3, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_1(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div4, null);
    				}
    			}

    			set_attributes(div4, div4_data = get_spread_update(div4_levels, [
    				dirty[0] & /*className, range, discrete, tickMarks, disabled, internalClasses*/ 2097648 && div4_class_value !== (div4_class_value = Object.entries({
    					[/*className*/ ctx[4]]: true,
    					'mdc-slider': true,
    					'mdc-slider--range': /*range*/ ctx[6],
    					'mdc-slider--discrete': /*discrete*/ ctx[7],
    					'mdc-slider--tick-marks': /*discrete*/ ctx[7] && /*tickMarks*/ ctx[8],
    					'mdc-slider--disabled': /*disabled*/ ctx[5],
    					.../*internalClasses*/ ctx[21]
    				}).filter(func_4).map(func_5).join(' ')) && { class: div4_class_value },
    				dirty[0] & /*range, minRange*/ 4160 && (/*range*/ ctx[6]
    				? {
    						'data-min-range': `${/*minRange*/ ctx[12]}`
    					}
    				: {}),
    				dirty[1] & /*$$restProps*/ 64 && exclude(/*$$restProps*/ ctx[37], ['input$'])
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 8) useActions_action.update.call(null, /*use*/ ctx[3]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if_block2.d();
    			/*div4_binding*/ ctx[79](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = ([name, value]) => `${name}: ${value};`;
    const func_1 = ([name, value]) => `${name}: ${value};`;
    const func_2 = ([name, value]) => `${name}: ${value};`;
    const func_3 = ([name, value]) => `${name}: ${value};`;
    const func_4 = ([name, value]) => name !== '' && value;
    const func_5 = ([name]) => name;

    function instance_1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","disabled","range","discrete","tickMarks","step","min","max","minRange","value","start","end","valueToAriaValueTextFn","hideFocusStylesForPointerEvents","input$class","layout","getId","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slider', slots, []);
    	var _a;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { disabled = false } = $$props;
    	let { range = false } = $$props;
    	let { discrete = false } = $$props;
    	let { tickMarks = false } = $$props;
    	let { step = 1 } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { minRange = 0 } = $$props;
    	let { value = undefined } = $$props;
    	let { start = undefined } = $$props;
    	let { end = undefined } = $$props;
    	let { valueToAriaValueTextFn = value => `${value}` } = $$props;
    	let { hideFocusStylesForPointerEvents = false } = $$props;
    	let { input$class = '' } = $$props;
    	let element;
    	let instance;
    	let input;
    	let inputStart = undefined;
    	let thumbEl;
    	let thumbStart = undefined;
    	let thumbKnob;
    	let thumbKnobStart = undefined;
    	let internalClasses = {};
    	let thumbStartClasses = {};
    	let thumbClasses = {};
    	let inputAttrs = {};
    	let inputStartAttrs = {};
    	let trackActiveStyles = {};
    	let thumbStyles = {};
    	let thumbStartStyles = {};
    	let thumbRippleActive = false;
    	let thumbStartRippleActive = false;
    	let currentTickMarks;

    	let inputProps = (_a = getContext('SMUI:generic:input:props')) !== null && _a !== void 0
    	? _a
    	: {};

    	let addLayoutListener = getContext('SMUI:addLayoutListener');
    	let removeLayoutListener;
    	let previousMin = min;
    	let previousMax = max;
    	let previousStep = step;
    	let previousDiscrete = discrete;
    	let previousTickMarks = tickMarks;

    	if (tickMarks && step > 0) {
    		const absMax = max + Math.abs(min);

    		if (range && typeof start === 'number' && typeof end === 'number') {
    			const absStart = start + Math.abs(min);
    			const absEnd = end + Math.abs(min);

    			currentTickMarks = [
    				...Array(absStart / step).map(() => TickMark.INACTIVE),
    				...Array(absMax / step - absStart / step - (absMax - absEnd) / step + 1).map(() => TickMark.ACTIVE),
    				...Array((absMax - absEnd) / step).map(() => TickMark.INACTIVE)
    			];
    		} else if (typeof value === 'number') {
    			const absValue = value + Math.abs(min);

    			currentTickMarks = [
    				...Array(absValue / step + 1).map(() => TickMark.ACTIVE),
    				...Array((absMax - absValue) / step).map(() => TickMark.INACTIVE)
    			];
    		}
    	}

    	if (range && typeof start === 'number' && typeof end === 'number') {
    		const percent = (end - start) / (max - min);
    		const percentStart = start / (max - min);
    		const percentEnd = end / (max - min);
    		trackActiveStyles.transform = `scaleX(${percent})`;
    		thumbStyles.left = `calc(${percentEnd * 100}% -24px)`;
    		thumbStartStyles.left = `calc(${percentStart * 100}% -24px)`;
    	} else if (typeof value === 'number') {
    		const percent = value / (max - min);
    		trackActiveStyles.transform = `scaleX(${percent})`;
    		thumbStyles.left = `calc(${percent * 100}% -24px)`;
    	}

    	if (addLayoutListener) {
    		removeLayoutListener = addLayoutListener(layout);
    	}

    	let previousValue = value;
    	let previousStart = start;
    	let previousEnd = end;

    	onMount(() => {
    		$$invalidate(43, instance = new MDCSliderFoundation({
    				hasClass,
    				addClass,
    				removeClass,
    				addThumbClass,
    				removeThumbClass,
    				getAttribute: attribute => getElement().getAttribute(attribute),
    				getInputValue: thumb => {
    					var _a;

    					return `${(_a = range ? thumb === Thumb.START ? start : end : value) !== null && _a !== void 0
					? _a
					: 0}`;
    				},
    				setInputValue: (val, thumb) => {
    					if (range) {
    						if (thumb === Thumb.START) {
    							$$invalidate(1, start = Number(val));
    							$$invalidate(50, previousStart = start);
    						} else {
    							$$invalidate(2, end = Number(val));
    							$$invalidate(51, previousEnd = end);
    						}
    					} else {
    						$$invalidate(0, value = Number(val));
    						$$invalidate(49, previousValue = value);
    					}
    				},
    				getInputAttribute: getInputAttr,
    				setInputAttribute: addInputAttr,
    				removeInputAttribute: removeInputAttr,
    				focusInput: thumb => {
    					if (range && thumb === Thumb.START && inputStart) {
    						inputStart.focus();
    					} else {
    						input.focus();
    					}
    				},
    				isInputFocused: thumb => (range && thumb === Thumb.START ? inputStart : input) === document.activeElement,
    				shouldHideFocusStylesForPointerEvents: () => hideFocusStylesForPointerEvents,
    				getThumbKnobWidth: thumb => {
    					var _a;

    					return ((_a = range && thumb === Thumb.START
    					? thumbKnobStart
    					: thumbKnob) !== null && _a !== void 0
    					? _a
    					: thumbKnob).getBoundingClientRect().width;
    				},
    				getThumbBoundingClientRect: thumb => {
    					var _a;

    					return ((_a = range && thumb === Thumb.START ? thumbStart : thumbEl) !== null && _a !== void 0
    					? _a
    					: thumbEl).getBoundingClientRect();
    				},
    				getBoundingClientRect: () => getElement().getBoundingClientRect(),
    				getValueIndicatorContainerWidth: thumb => {
    					var _a;

    					return ((_a = range && thumb === Thumb.START ? thumbStart : thumbEl) !== null && _a !== void 0
    					? _a
    					: thumbEl).querySelector(`.mdc-slider__value-indicator-container`).getBoundingClientRect().width;
    				},
    				isRTL: () => getComputedStyle(getElement()).direction === 'rtl',
    				setThumbStyleProperty: addThumbStyle,
    				removeThumbStyleProperty: removeThumbStyle,
    				setTrackActiveStyleProperty: addTrackActiveStyle,
    				removeTrackActiveStyleProperty: removeTrackActiveStyle,
    				// Handled by Svelte.
    				setValueIndicatorText: (_value, _thumb) => undefined,
    				getValueToAriaValueTextFn: () => valueToAriaValueTextFn,
    				updateTickMarks: tickMarks => {
    					$$invalidate(31, currentTickMarks = tickMarks);
    				},
    				setPointerCapture: pointerId => {
    					getElement().setPointerCapture(pointerId);
    				},
    				emitChangeEvent: (value, thumb) => {
    					dispatch(getElement(), 'SMUISlider:change', { value, thumb }, undefined, true);
    				},
    				emitInputEvent: (value, thumb) => {
    					dispatch(getElement(), 'SMUISlider:input', { value, thumb }, undefined, true);
    				},
    				emitDragStartEvent: (_, thumb) => {
    					// Emitting event is not yet implemented. See issue:
    					// https://github.com/material-components/material-components-web/issues/6448
    					if (range && thumb === Thumb.START) {
    						$$invalidate(30, thumbStartRippleActive = true);
    					} else {
    						$$invalidate(29, thumbRippleActive = true);
    					}
    				},
    				emitDragEndEvent: (_, thumb) => {
    					// Emitting event is not yet implemented. See issue:
    					// https://github.com/material-components/material-components-web/issues/6448
    					if (range && thumb === Thumb.START) {
    						$$invalidate(30, thumbStartRippleActive = false);
    					} else {
    						$$invalidate(29, thumbRippleActive = false);
    					}
    				},
    				registerEventHandler: (evtType, handler) => {
    					getElement().addEventListener(evtType, handler);
    				},
    				deregisterEventHandler: (evtType, handler) => {
    					getElement().removeEventListener(evtType, handler);
    				},
    				registerThumbEventHandler: (thumb, evtType, handler) => {
    					var _a;

    					(_a = range && thumb === Thumb.START ? thumbStart : thumbEl) === null || _a === void 0
    					? void 0
    					: _a.addEventListener(evtType, handler);
    				},
    				deregisterThumbEventHandler: (thumb, evtType, handler) => {
    					var _a;

    					(_a = range && thumb === Thumb.START ? thumbStart : thumbEl) === null || _a === void 0
    					? void 0
    					: _a.removeEventListener(evtType, handler);
    				},
    				registerInputEventHandler: (thumb, evtType, handler) => {
    					var _a;

    					(_a = range && thumb === Thumb.START ? inputStart : input) === null || _a === void 0
    					? void 0
    					: _a.addEventListener(evtType, handler);
    				},
    				deregisterInputEventHandler: (thumb, evtType, handler) => {
    					var _a;

    					(_a = range && thumb === Thumb.START ? inputStart : input) === null || _a === void 0
    					? void 0
    					: _a.removeEventListener(evtType, handler);
    				},
    				registerBodyEventHandler: (evtType, handler) => {
    					document.body.addEventListener(evtType, handler);
    				},
    				deregisterBodyEventHandler: (evtType, handler) => {
    					document.body.removeEventListener(evtType, handler);
    				},
    				registerWindowEventHandler: (evtType, handler) => {
    					window.addEventListener(evtType, handler);
    				},
    				deregisterWindowEventHandler: (evtType, handler) => {
    					window.removeEventListener(evtType, handler);
    				}
    			}));

    		const accessor = {
    			get element() {
    				return getElement();
    			},
    			activateRipple() {
    				if (!disabled) {
    					$$invalidate(29, thumbRippleActive = true);
    				}
    			},
    			deactivateRipple() {
    				$$invalidate(29, thumbRippleActive = false);
    			}
    		};

    		dispatch(element, 'SMUIGenericInput:mount', accessor);
    		instance.init();
    		instance.layout({ skipUpdateUI: true });

    		return () => {
    			dispatch(element, 'SMUIGenericInput:unmount', accessor);
    			instance.destroy();
    		};
    	});

    	onDestroy(() => {
    		if (removeLayoutListener) {
    			removeLayoutListener();
    		}
    	});

    	function hasClass(className) {
    		return className in internalClasses
    		? internalClasses[className]
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(21, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(21, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addThumbClass(className, thumb) {
    		if (range && thumb === Thumb.START) {
    			if (!thumbStartClasses[className]) {
    				$$invalidate(22, thumbStartClasses[className] = true, thumbStartClasses);
    			}
    		} else {
    			if (!thumbClasses[className]) {
    				$$invalidate(23, thumbClasses[className] = true, thumbClasses);
    			}
    		}
    	}

    	function removeThumbClass(className, thumb) {
    		if (range && thumb === Thumb.START) {
    			if (!(className in thumbStartClasses) || thumbStartClasses[className]) {
    				$$invalidate(22, thumbStartClasses[className] = false, thumbStartClasses);
    			}
    		} else {
    			if (!(className in thumbClasses) || thumbClasses[className]) {
    				$$invalidate(23, thumbClasses[className] = false, thumbClasses);
    			}
    		}
    	}

    	function addThumbStyle(name, value, thumb) {
    		if (range && thumb === Thumb.START) {
    			if (thumbStartStyles[name] != value) {
    				if (value === '' || value == null) {
    					delete thumbStartStyles[name];
    					$$invalidate(28, thumbStartStyles);
    				} else {
    					$$invalidate(28, thumbStartStyles[name] = value, thumbStartStyles);
    				}
    			}
    		} else {
    			if (thumbStyles[name] != value) {
    				if (value === '' || value == null) {
    					delete thumbStyles[name];
    					$$invalidate(27, thumbStyles);
    				} else {
    					$$invalidate(27, thumbStyles[name] = value, thumbStyles);
    				}
    			}
    		}
    	}

    	function removeThumbStyle(name, thumb) {
    		if (range && thumb === Thumb.START) {
    			if (name in thumbStartStyles) {
    				delete thumbStartStyles[name];
    				$$invalidate(28, thumbStartStyles);
    			}
    		} else {
    			if (name in thumbStyles) {
    				delete thumbStyles[name];
    				$$invalidate(27, thumbStyles);
    			}
    		}
    	}

    	function getInputAttr(name, thumb) {
    		var _a, _b, _c;

    		// Some custom logic for "value", since Svelte doesn't seem to actually
    		// set the attribute, just the DOM property.
    		if (range && thumb === Thumb.START) {
    			if (name === 'value') {
    				return `${start}`;
    			}

    			return name in inputStartAttrs
    			? (_a = inputStartAttrs[name]) !== null && _a !== void 0
    				? _a
    				: null
    			: (_b = inputStart === null || inputStart === void 0
    				? void 0
    				: inputStart.getAttribute(name)) !== null && _b !== void 0
    				? _b
    				: null;
    		} else {
    			if (name === 'value') {
    				return `${range ? end : value}`;
    			}

    			return name in inputAttrs
    			? (_c = inputAttrs[name]) !== null && _c !== void 0
    				? _c
    				: null
    			: input.getAttribute(name);
    		}
    	}

    	function addInputAttr(name, value, thumb) {
    		if (range && thumb === Thumb.START) {
    			if (inputStartAttrs[name] !== value) {
    				$$invalidate(25, inputStartAttrs[name] = value, inputStartAttrs);
    			}
    		} else {
    			if (inputAttrs[name] !== value) {
    				$$invalidate(24, inputAttrs[name] = value, inputAttrs);
    			}
    		}
    	}

    	function removeInputAttr(name, thumb) {
    		if (range && thumb === Thumb.START) {
    			if (!(name in inputStartAttrs) || inputStartAttrs[name] != null) {
    				$$invalidate(25, inputStartAttrs[name] = undefined, inputStartAttrs);
    			}
    		} else {
    			if (!(name in inputAttrs) || inputAttrs[name] != null) {
    				$$invalidate(24, inputAttrs[name] = undefined, inputAttrs);
    			}
    		}
    	}

    	function addTrackActiveStyle(name, value) {
    		if (trackActiveStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete trackActiveStyles[name];
    				$$invalidate(26, trackActiveStyles);
    			} else {
    				$$invalidate(26, trackActiveStyles[name] = value, trackActiveStyles);
    			}
    		}
    	}

    	function removeTrackActiveStyle(name) {
    		if (name in trackActiveStyles) {
    			delete trackActiveStyles[name];
    			$$invalidate(26, trackActiveStyles);
    		}
    	}

    	function layout() {
    		return instance.layout();
    	}

    	function getId() {
    		return inputProps && inputProps.id;
    	}

    	function getElement() {
    		return element;
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputStart = $$value;
    			$$invalidate(16, inputStart);
    		});
    	}

    	function input0_change_input_handler() {
    		start = to_number(this.value);
    		$$invalidate(1, start);
    	}

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(15, input);
    		});
    	}

    	function input1_change_input_handler() {
    		end = to_number(this.value);
    		$$invalidate(2, end);
    	}

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(15, input);
    		});
    	}

    	function input_1_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(0, value);
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbKnobStart = $$value;
    			$$invalidate(20, thumbKnobStart);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbStart = $$value;
    			$$invalidate(18, thumbStart);
    		});
    	}

    	const Ripple_function = className => addThumbClass(className, Thumb.START);
    	const Ripple_function_1 = className => removeThumbClass(className, Thumb.START);
    	const Ripple_function_2 = (name, value) => addThumbStyle(name, value, Thumb.START);

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbKnob = $$value;
    			$$invalidate(19, thumbKnob);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbEl = $$value;
    			$$invalidate(17, thumbEl);
    		});
    	}

    	const Ripple_function_3 = className => addThumbClass(className, Thumb.END);
    	const Ripple_function_4 = className => removeThumbClass(className, Thumb.END);
    	const Ripple_function_5 = (name, value) => addThumbStyle(name, value, Thumb.END);

    	function div0_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbKnob = $$value;
    			$$invalidate(19, thumbKnob);
    		});
    	}

    	function div1_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbEl = $$value;
    			$$invalidate(17, thumbEl);
    		});
    	}

    	const Ripple_function_6 = className => addThumbClass(className, Thumb.END);
    	const Ripple_function_7 = className => removeThumbClass(className, Thumb.END);
    	const Ripple_function_8 = (name, value) => addThumbStyle(name, value, Thumb.END);

    	function div4_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(14, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(37, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(3, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ('disabled' in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('range' in $$new_props) $$invalidate(6, range = $$new_props.range);
    		if ('discrete' in $$new_props) $$invalidate(7, discrete = $$new_props.discrete);
    		if ('tickMarks' in $$new_props) $$invalidate(8, tickMarks = $$new_props.tickMarks);
    		if ('step' in $$new_props) $$invalidate(9, step = $$new_props.step);
    		if ('min' in $$new_props) $$invalidate(10, min = $$new_props.min);
    		if ('max' in $$new_props) $$invalidate(11, max = $$new_props.max);
    		if ('minRange' in $$new_props) $$invalidate(12, minRange = $$new_props.minRange);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('start' in $$new_props) $$invalidate(1, start = $$new_props.start);
    		if ('end' in $$new_props) $$invalidate(2, end = $$new_props.end);
    		if ('valueToAriaValueTextFn' in $$new_props) $$invalidate(38, valueToAriaValueTextFn = $$new_props.valueToAriaValueTextFn);
    		if ('hideFocusStylesForPointerEvents' in $$new_props) $$invalidate(39, hideFocusStylesForPointerEvents = $$new_props.hideFocusStylesForPointerEvents);
    		if ('input$class' in $$new_props) $$invalidate(13, input$class = $$new_props.input$class);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		MDCSliderFoundation,
    		Thumb,
    		TickMark,
    		onMount,
    		onDestroy,
    		getContext,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		Ripple,
    		forwardEvents,
    		use,
    		className,
    		disabled,
    		range,
    		discrete,
    		tickMarks,
    		step,
    		min,
    		max,
    		minRange,
    		value,
    		start,
    		end,
    		valueToAriaValueTextFn,
    		hideFocusStylesForPointerEvents,
    		input$class,
    		element,
    		instance,
    		input,
    		inputStart,
    		thumbEl,
    		thumbStart,
    		thumbKnob,
    		thumbKnobStart,
    		internalClasses,
    		thumbStartClasses,
    		thumbClasses,
    		inputAttrs,
    		inputStartAttrs,
    		trackActiveStyles,
    		thumbStyles,
    		thumbStartStyles,
    		thumbRippleActive,
    		thumbStartRippleActive,
    		currentTickMarks,
    		inputProps,
    		addLayoutListener,
    		removeLayoutListener,
    		previousMin,
    		previousMax,
    		previousStep,
    		previousDiscrete,
    		previousTickMarks,
    		previousValue,
    		previousStart,
    		previousEnd,
    		hasClass,
    		addClass,
    		removeClass,
    		addThumbClass,
    		removeThumbClass,
    		addThumbStyle,
    		removeThumbStyle,
    		getInputAttr,
    		addInputAttr,
    		removeInputAttr,
    		addTrackActiveStyle,
    		removeTrackActiveStyle,
    		layout,
    		getId,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_a' in $$props) _a = $$new_props._a;
    		if ('use' in $$props) $$invalidate(3, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('range' in $$props) $$invalidate(6, range = $$new_props.range);
    		if ('discrete' in $$props) $$invalidate(7, discrete = $$new_props.discrete);
    		if ('tickMarks' in $$props) $$invalidate(8, tickMarks = $$new_props.tickMarks);
    		if ('step' in $$props) $$invalidate(9, step = $$new_props.step);
    		if ('min' in $$props) $$invalidate(10, min = $$new_props.min);
    		if ('max' in $$props) $$invalidate(11, max = $$new_props.max);
    		if ('minRange' in $$props) $$invalidate(12, minRange = $$new_props.minRange);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('start' in $$props) $$invalidate(1, start = $$new_props.start);
    		if ('end' in $$props) $$invalidate(2, end = $$new_props.end);
    		if ('valueToAriaValueTextFn' in $$props) $$invalidate(38, valueToAriaValueTextFn = $$new_props.valueToAriaValueTextFn);
    		if ('hideFocusStylesForPointerEvents' in $$props) $$invalidate(39, hideFocusStylesForPointerEvents = $$new_props.hideFocusStylesForPointerEvents);
    		if ('input$class' in $$props) $$invalidate(13, input$class = $$new_props.input$class);
    		if ('element' in $$props) $$invalidate(14, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(43, instance = $$new_props.instance);
    		if ('input' in $$props) $$invalidate(15, input = $$new_props.input);
    		if ('inputStart' in $$props) $$invalidate(16, inputStart = $$new_props.inputStart);
    		if ('thumbEl' in $$props) $$invalidate(17, thumbEl = $$new_props.thumbEl);
    		if ('thumbStart' in $$props) $$invalidate(18, thumbStart = $$new_props.thumbStart);
    		if ('thumbKnob' in $$props) $$invalidate(19, thumbKnob = $$new_props.thumbKnob);
    		if ('thumbKnobStart' in $$props) $$invalidate(20, thumbKnobStart = $$new_props.thumbKnobStart);
    		if ('internalClasses' in $$props) $$invalidate(21, internalClasses = $$new_props.internalClasses);
    		if ('thumbStartClasses' in $$props) $$invalidate(22, thumbStartClasses = $$new_props.thumbStartClasses);
    		if ('thumbClasses' in $$props) $$invalidate(23, thumbClasses = $$new_props.thumbClasses);
    		if ('inputAttrs' in $$props) $$invalidate(24, inputAttrs = $$new_props.inputAttrs);
    		if ('inputStartAttrs' in $$props) $$invalidate(25, inputStartAttrs = $$new_props.inputStartAttrs);
    		if ('trackActiveStyles' in $$props) $$invalidate(26, trackActiveStyles = $$new_props.trackActiveStyles);
    		if ('thumbStyles' in $$props) $$invalidate(27, thumbStyles = $$new_props.thumbStyles);
    		if ('thumbStartStyles' in $$props) $$invalidate(28, thumbStartStyles = $$new_props.thumbStartStyles);
    		if ('thumbRippleActive' in $$props) $$invalidate(29, thumbRippleActive = $$new_props.thumbRippleActive);
    		if ('thumbStartRippleActive' in $$props) $$invalidate(30, thumbStartRippleActive = $$new_props.thumbStartRippleActive);
    		if ('currentTickMarks' in $$props) $$invalidate(31, currentTickMarks = $$new_props.currentTickMarks);
    		if ('inputProps' in $$props) $$invalidate(33, inputProps = $$new_props.inputProps);
    		if ('addLayoutListener' in $$props) addLayoutListener = $$new_props.addLayoutListener;
    		if ('removeLayoutListener' in $$props) removeLayoutListener = $$new_props.removeLayoutListener;
    		if ('previousMin' in $$props) $$invalidate(44, previousMin = $$new_props.previousMin);
    		if ('previousMax' in $$props) $$invalidate(45, previousMax = $$new_props.previousMax);
    		if ('previousStep' in $$props) $$invalidate(46, previousStep = $$new_props.previousStep);
    		if ('previousDiscrete' in $$props) $$invalidate(47, previousDiscrete = $$new_props.previousDiscrete);
    		if ('previousTickMarks' in $$props) $$invalidate(48, previousTickMarks = $$new_props.previousTickMarks);
    		if ('previousValue' in $$props) $$invalidate(49, previousValue = $$new_props.previousValue);
    		if ('previousStart' in $$props) $$invalidate(50, previousStart = $$new_props.previousStart);
    		if ('previousEnd' in $$props) $$invalidate(51, previousEnd = $$new_props.previousEnd);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*min*/ 1024 | $$self.$$.dirty[1] & /*previousMin, instance*/ 12288) {
    			if (min !== previousMin) {
    				if (instance) {
    					instance.setMin(min);
    				}

    				$$invalidate(44, previousMin = min);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*max*/ 2048 | $$self.$$.dirty[1] & /*previousMax, instance*/ 20480) {
    			if (max !== previousMax) {
    				if (instance) {
    					instance.setMax(max);
    				}

    				$$invalidate(45, previousMax = max);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*step*/ 512 | $$self.$$.dirty[1] & /*previousStep, instance*/ 36864) {
    			if (step !== previousStep) {
    				if (instance) {
    					instance.setStep(step);
    				}

    				$$invalidate(46, previousStep = step);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*discrete*/ 128 | $$self.$$.dirty[1] & /*previousDiscrete, instance*/ 69632) {
    			if (discrete !== previousDiscrete) {
    				if (instance) {
    					instance.setIsDiscrete(discrete);
    				}

    				$$invalidate(47, previousDiscrete = discrete);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tickMarks*/ 256 | $$self.$$.dirty[1] & /*previousTickMarks, instance*/ 135168) {
    			if (tickMarks !== previousTickMarks) {
    				if (instance) {
    					instance.setHasTickMarks(tickMarks);
    				}

    				$$invalidate(48, previousTickMarks = tickMarks);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value, start, end*/ 7 | $$self.$$.dirty[1] & /*instance, previousValue, previousStart, previousEnd*/ 1839104) {
    			if (instance) {
    				if (previousValue !== value && typeof value === 'number') {
    					instance.setValue(value);
    				}

    				if (previousStart !== start && typeof start === 'number') {
    					instance.setValueStart(start);
    				}

    				if (previousEnd !== end && typeof end === 'number') {
    					instance.setValue(end);
    				}

    				$$invalidate(49, previousValue = value);
    				$$invalidate(50, previousStart = start);
    				$$invalidate(51, previousEnd = end);

    				// Needed for range start to take effect.
    				instance.layout();
    			}
    		}
    	};

    	return [
    		value,
    		start,
    		end,
    		use,
    		className,
    		disabled,
    		range,
    		discrete,
    		tickMarks,
    		step,
    		min,
    		max,
    		minRange,
    		input$class,
    		element,
    		input,
    		inputStart,
    		thumbEl,
    		thumbStart,
    		thumbKnob,
    		thumbKnobStart,
    		internalClasses,
    		thumbStartClasses,
    		thumbClasses,
    		inputAttrs,
    		inputStartAttrs,
    		trackActiveStyles,
    		thumbStyles,
    		thumbStartStyles,
    		thumbRippleActive,
    		thumbStartRippleActive,
    		currentTickMarks,
    		forwardEvents,
    		inputProps,
    		addThumbClass,
    		removeThumbClass,
    		addThumbStyle,
    		$$restProps,
    		valueToAriaValueTextFn,
    		hideFocusStylesForPointerEvents,
    		layout,
    		getId,
    		getElement,
    		instance,
    		previousMin,
    		previousMax,
    		previousStep,
    		previousDiscrete,
    		previousTickMarks,
    		previousValue,
    		previousStart,
    		previousEnd,
    		blur_handler_1,
    		focus_handler_1,
    		blur_handler,
    		focus_handler,
    		blur_handler_2,
    		focus_handler_2,
    		input0_binding,
    		input0_change_input_handler,
    		input1_binding,
    		input1_change_input_handler,
    		input_1_binding,
    		input_1_change_input_handler,
    		div0_binding,
    		div1_binding,
    		Ripple_function,
    		Ripple_function_1,
    		Ripple_function_2,
    		div2_binding,
    		div3_binding,
    		Ripple_function_3,
    		Ripple_function_4,
    		Ripple_function_5,
    		div0_binding_1,
    		div1_binding_1,
    		Ripple_function_6,
    		Ripple_function_7,
    		Ripple_function_8,
    		div4_binding
    	];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				use: 3,
    				class: 4,
    				disabled: 5,
    				range: 6,
    				discrete: 7,
    				tickMarks: 8,
    				step: 9,
    				min: 10,
    				max: 11,
    				minRange: 12,
    				value: 0,
    				start: 1,
    				end: 2,
    				valueToAriaValueTextFn: 38,
    				hideFocusStylesForPointerEvents: 39,
    				input$class: 13,
    				layout: 40,
    				getId: 41,
    				getElement: 42
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get use() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get range() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set range(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get discrete() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set discrete(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickMarks() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickMarks(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minRange() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minRange(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueToAriaValueTextFn() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueToAriaValueTextFn(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideFocusStylesForPointerEvents() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideFocusStylesForPointerEvents(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input$class() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input$class(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get layout() {
    		return this.$$.ctx[40];
    	}

    	set layout(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getId() {
    		return this.$$.ctx[41];
    	}

    	set getId(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[42];
    	}

    	set getElement(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var imgSrc = {
        rocket: `data:image/png;base64,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`,
        astronaut: `data:image/png;base64,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`,
        planet: `data:image/png;base64,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`,
    };

    /* src\App.svelte generated by Svelte v3.51.0 */

    const { Object: Object_1, document: document_1 } = globals;
    const file = "src\\App.svelte";

    // (296:2) <Button outline color="light" on:click={effect.warp()}>
    function create_default_slot_7(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				name: "arrow-clockwise",
    				style: "font-size: 2rem;"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(296:2) <Button outline color=\\\"light\\\" on:click={effect.warp()}>",
    		ctx
    	});

    	return block;
    }

    // (299:2) <Button outline color="light" on:click={toggle}>
    function create_default_slot_6(ctx) {
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				name: "controller",
    				style: "font-size: 2rem;"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(299:2) <Button outline color=\\\"light\\\" on:click={toggle}>",
    		ctx
    	});

    	return block;
    }

    // (306:1) <ModalHeader {toggle}>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Controls");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(306:1) <ModalHeader {toggle}>",
    		ctx
    	});

    	return block;
    }

    // (307:1) <ModalBody>
    function create_default_slot_4(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let div0;
    	let t4;
    	let slider0;
    	let updating_value;
    	let t5;
    	let t6;
    	let t7;
    	let div1;
    	let t9;
    	let slider1;
    	let updating_value_1;
    	let t10;
    	let t11;
    	let t12;
    	let div2;
    	let t14;
    	let slider2;
    	let updating_value_2;
    	let t15;
    	let t16;
    	let t17;
    	let div3;
    	let t19;
    	let slider3;
    	let updating_value_3;
    	let current;

    	function slider0_value_binding(value) {
    		/*slider0_value_binding*/ ctx[9](value);
    	}

    	let slider0_props = { min: 1000, max: 15000, step: 1000 };

    	if (/*mouseRadius*/ ctx[0] !== void 0) {
    		slider0_props.value = /*mouseRadius*/ ctx[0];
    	}

    	slider0 = new Slider({ props: slider0_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider0, 'value', slider0_value_binding));

    	function slider1_value_binding(value) {
    		/*slider1_value_binding*/ ctx[10](value);
    	}

    	let slider1_props = { min: 3, max: 20, step: 1 };

    	if (/*pixelSize*/ ctx[1] !== void 0) {
    		slider1_props.value = /*pixelSize*/ ctx[1];
    	}

    	slider1 = new Slider({ props: slider1_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider1, 'value', slider1_value_binding));

    	function slider2_value_binding(value) {
    		/*slider2_value_binding*/ ctx[11](value);
    	}

    	let slider2_props = { min: 0.01, max: 0.1, step: 0.01 };

    	if (/*ease*/ ctx[2] !== void 0) {
    		slider2_props.value = /*ease*/ ctx[2];
    	}

    	slider2 = new Slider({ props: slider2_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider2, 'value', slider2_value_binding));

    	function slider3_value_binding(value) {
    		/*slider3_value_binding*/ ctx[12](value);
    	}

    	let slider3_props = { min: 0.1, max: 0.9, step: 0.1 };

    	if (/*friction*/ ctx[3] !== void 0) {
    		slider3_props.value = /*friction*/ ctx[3];
    	}

    	slider3 = new Slider({ props: slider3_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider3, 'value', slider3_value_binding));

    	const block = {
    		c: function create() {
    			t0 = text("Pointer radius: ");
    			t1 = text(/*mouseRadius*/ ctx[0]);
    			t2 = space();
    			div0 = element("div");
    			div0.textContent = "Controls radius around mouse/touch";
    			t4 = space();
    			create_component(slider0.$$.fragment);
    			t5 = text("\n\n\t\tPixel size: ");
    			t6 = text(/*pixelSize*/ ctx[1]);
    			t7 = space();
    			div1 = element("div");
    			div1.textContent = "Controls size of each pixel";
    			t9 = space();
    			create_component(slider1.$$.fragment);
    			t10 = text("\n\n\t\tEase: ");
    			t11 = text(/*ease*/ ctx[2]);
    			t12 = space();
    			div2 = element("div");
    			div2.textContent = "Controls speed at which pixels return to position. Lower value = slower speed";
    			t14 = space();
    			create_component(slider2.$$.fragment);
    			t15 = text("\n\n\t\tFriction: ");
    			t16 = text(/*friction*/ ctx[3]);
    			t17 = space();
    			div3 = element("div");
    			div3.textContent = "Controls friction of pixels when being pushed. Higher value = pushed further";
    			t19 = space();
    			create_component(slider3.$$.fragment);
    			attr_dev(div0, "class", "slider-description svelte-1991anp");
    			add_location(div0, file, 308, 2, 24749);
    			attr_dev(div1, "class", "slider-description svelte-1991anp");
    			add_location(div1, file, 312, 2, 24924);
    			attr_dev(div2, "class", "slider-description svelte-1991anp");
    			add_location(div2, file, 316, 2, 25070);
    			attr_dev(div3, "class", "slider-description svelte-1991anp");
    			add_location(div3, file, 320, 2, 25276);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(slider0, target, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(slider1, target, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div2, anchor);
    			insert_dev(target, t14, anchor);
    			mount_component(slider2, target, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, div3, anchor);
    			insert_dev(target, t19, anchor);
    			mount_component(slider3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*mouseRadius*/ 1) set_data_dev(t1, /*mouseRadius*/ ctx[0]);
    			const slider0_changes = {};

    			if (!updating_value && dirty & /*mouseRadius*/ 1) {
    				updating_value = true;
    				slider0_changes.value = /*mouseRadius*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			slider0.$set(slider0_changes);
    			if (!current || dirty & /*pixelSize*/ 2) set_data_dev(t6, /*pixelSize*/ ctx[1]);
    			const slider1_changes = {};

    			if (!updating_value_1 && dirty & /*pixelSize*/ 2) {
    				updating_value_1 = true;
    				slider1_changes.value = /*pixelSize*/ ctx[1];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			slider1.$set(slider1_changes);
    			if (!current || dirty & /*ease*/ 4) set_data_dev(t11, /*ease*/ ctx[2]);
    			const slider2_changes = {};

    			if (!updating_value_2 && dirty & /*ease*/ 4) {
    				updating_value_2 = true;
    				slider2_changes.value = /*ease*/ ctx[2];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			slider2.$set(slider2_changes);
    			if (!current || dirty & /*friction*/ 8) set_data_dev(t16, /*friction*/ ctx[3]);
    			const slider3_changes = {};

    			if (!updating_value_3 && dirty & /*friction*/ 8) {
    				updating_value_3 = true;
    				slider3_changes.value = /*friction*/ ctx[3];
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			slider3.$set(slider3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(slider0.$$.fragment, local);
    			transition_in(slider1.$$.fragment, local);
    			transition_in(slider2.$$.fragment, local);
    			transition_in(slider3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(slider0.$$.fragment, local);
    			transition_out(slider1.$$.fragment, local);
    			transition_out(slider2.$$.fragment, local);
    			transition_out(slider3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t4);
    			destroy_component(slider0, detaching);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t9);
    			destroy_component(slider1, detaching);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t14);
    			destroy_component(slider2, detaching);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t19);
    			destroy_component(slider3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(307:1) <ModalBody>",
    		ctx
    	});

    	return block;
    }

    // (326:2) <Button color="dark" on:click={handleSave}>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Save controls");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(326:2) <Button color=\\\"dark\\\" on:click={handleSave}>",
    		ctx
    	});

    	return block;
    }

    // (327:2) <Button color="secondary" on:click={toggle}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancel");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(327:2) <Button color=\\\"secondary\\\" on:click={toggle}>",
    		ctx
    	});

    	return block;
    }

    // (325:1) <ModalFooter>
    function create_default_slot_1(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				color: "dark",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", function () {
    		if (is_function(/*handleSave*/ ctx[6])) /*handleSave*/ ctx[6].apply(this, arguments);
    	});

    	button1 = new Button({
    			props: {
    				color: "secondary",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*toggle*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button1, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(325:1) <ModalFooter>",
    		ctx
    	});

    	return block;
    }

    // (305:0) <Modal isOpen={open} {toggle}>
    function create_default_slot(ctx) {
    	let modalheader;
    	let t0;
    	let modalbody;
    	let t1;
    	let modalfooter;
    	let current;

    	modalheader = new ModalHeader({
    			props: {
    				toggle: /*toggle*/ ctx[8],
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalbody = new ModalBody({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modalfooter = new ModalFooter({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modalheader.$$.fragment);
    			t0 = space();
    			create_component(modalbody.$$.fragment);
    			t1 = space();
    			create_component(modalfooter.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modalheader, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modalbody, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(modalfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modalheader_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				modalheader_changes.$$scope = { dirty, ctx };
    			}

    			modalheader.$set(modalheader_changes);
    			const modalbody_changes = {};

    			if (dirty & /*$$scope, friction, ease, pixelSize, mouseRadius*/ 65551) {
    				modalbody_changes.$$scope = { dirty, ctx };
    			}

    			modalbody.$set(modalbody_changes);
    			const modalfooter_changes = {};

    			if (dirty & /*$$scope, handleSave*/ 65600) {
    				modalfooter_changes.$$scope = { dirty, ctx };
    			}

    			modalfooter.$set(modalfooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modalheader.$$.fragment, local);
    			transition_in(modalbody.$$.fragment, local);
    			transition_in(modalfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modalheader.$$.fragment, local);
    			transition_out(modalbody.$$.fragment, local);
    			transition_out(modalfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modalheader, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modalbody, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(modalfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(305:0) <Modal isOpen={open} {toggle}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let link0;
    	let link1;
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let canvas_1;
    	let t1;
    	let div3;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t2;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let div2;
    	let img2;
    	let img2_src_value;
    	let t4;
    	let label;
    	let icon0;
    	let t5;
    	let input;
    	let t6;
    	let img3;
    	let img3_src_value;
    	let t7;
    	let div4;
    	let a;
    	let icon1;
    	let t8;
    	let button0;
    	let t9;
    	let button1;
    	let t10;
    	let modal;
    	let current;
    	let mounted;
    	let dispose;

    	icon0 = new Icon({
    			props: { name: "plus", style: "font-size: 2rem;" },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: {
    				name: "github",
    				style: "font-size: 2rem;"
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				outline: true,
    				color: "light",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", function () {
    		if (is_function(/*effect*/ ctx[5].warp())) /*effect*/ ctx[5].warp().apply(this, arguments);
    	});

    	button1 = new Button({
    			props: {
    				outline: true,
    				color: "light",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*toggle*/ ctx[8]);

    	modal = new Modal({
    			props: {
    				isOpen: /*open*/ ctx[4],
    				toggle: /*toggle*/ ctx[8],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			canvas_1 = element("canvas");
    			t1 = space();
    			div3 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t2 = space();
    			div1 = element("div");
    			img1 = element("img");
    			t3 = space();
    			div2 = element("div");
    			img2 = element("img");
    			t4 = space();
    			label = element("label");
    			create_component(icon0.$$.fragment);
    			t5 = space();
    			input = element("input");
    			t6 = space();
    			img3 = element("img");
    			t7 = space();
    			div4 = element("div");
    			a = element("a");
    			create_component(icon1.$$.fragment);
    			t8 = space();
    			create_component(button0.$$.fragment);
    			t9 = space();
    			create_component(button1.$$.fragment);
    			t10 = space();
    			create_component(modal.$$.fragment);
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "href", "https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css");
    			attr_dev(link0, "class", "svelte-1991anp");
    			add_location(link0, file, 242, 1, 7197);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css");
    			attr_dev(link1, "class", "svelte-1991anp");
    			add_location(link1, file, 243, 1, 7301);
    			if (!src_url_equal(script.src, script_src_value = "https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "class", "svelte-1991anp");
    			add_location(script, file, 244, 1, 7409);
    			attr_dev(canvas_1, "id", "canvas");
    			attr_dev(canvas_1, "class", "svelte-1991anp");
    			add_location(canvas_1, file, 247, 1, 7512);
    			attr_dev(img0, "id", "rocket");
    			attr_dev(img0, "alt", "rocket");
    			attr_dev(img0, "class", "image-options-source svelte-1991anp");
    			if (!src_url_equal(img0.src, img0_src_value = imgSrc.rocket)) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 251, 3, 7667);
    			attr_dev(div0, "class", "image-options svelte-1991anp");
    			add_location(div0, file, 250, 2, 7576);
    			attr_dev(img1, "id", "astronaut");
    			attr_dev(img1, "alt", "astronaut");
    			attr_dev(img1, "class", "image-options-source svelte-1991anp");
    			if (!src_url_equal(img1.src, img1_src_value = imgSrc.astronaut)) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 259, 3, 7871);
    			attr_dev(div1, "class", "image-options svelte-1991anp");
    			add_location(div1, file, 258, 2, 7780);
    			attr_dev(img2, "id", "planet");
    			attr_dev(img2, "alt", "planet");
    			attr_dev(img2, "class", "image-options-source svelte-1991anp");
    			if (!src_url_equal(img2.src, img2_src_value = imgSrc.planet)) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file, 267, 3, 8084);
    			attr_dev(div2, "class", "image-options svelte-1991anp");
    			add_location(div2, file, 266, 2, 7993);
    			attr_dev(label, "for", "image-input");
    			attr_dev(label, "class", "image-options svelte-1991anp");
    			attr_dev(label, "aria-label", "Choose image to upload");
    			add_location(label, file, 274, 2, 8197);
    			attr_dev(input, "id", "image-input");
    			attr_dev(input, "type", "file");
    			attr_dev(input, "accept", "image/*");
    			attr_dev(input, "class", "svelte-1991anp");
    			add_location(input, file, 277, 2, 8348);
    			attr_dev(div3, "class", "image-selection svelte-1991anp");
    			add_location(div3, file, 249, 1, 7544);
    			attr_dev(img3, "id", "image");
    			attr_dev(img3, "alt", "canvas");
    			if (!src_url_equal(img3.src, img3_src_value = "data:image/png;base64,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")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "svelte-1991anp");
    			add_location(img3, file, 280, 1, 8413);
    			attr_dev(a, "class", "btn btn-outline-light svelte-1991anp");
    			attr_dev(a, "href", "https://github.com/shanehokw/svelte-js-particle-effects");
    			attr_dev(a, "role", "button");
    			add_location(a, file, 291, 3, 24168);
    			attr_dev(div4, "class", "controls svelte-1991anp");
    			add_location(div4, file, 286, 1, 23916);
    			attr_dev(main, "class", "svelte-1991anp");
    			add_location(main, file, 246, 0, 7504);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, link0);
    			append_dev(document_1.head, link1);
    			append_dev(document_1.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, canvas_1);
    			append_dev(main, t1);
    			append_dev(main, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img0);
    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			append_dev(div1, img1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, img2);
    			append_dev(div3, t4);
    			append_dev(div3, label);
    			mount_component(icon0, label, null);
    			append_dev(div3, t5);
    			append_dev(div3, input);
    			append_dev(main, t6);
    			append_dev(main, img3);
    			append_dev(main, t7);
    			append_dev(main, div4);
    			append_dev(div4, a);
    			mount_component(icon1, a, null);
    			append_dev(div4, t8);
    			mount_component(button0, div4, null);
    			append_dev(div4, t9);
    			mount_component(button1, div4, null);
    			insert_dev(target, t10, anchor);
    			mount_component(modal, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div0,
    						"click",
    						function () {
    							if (is_function(/*selectImage*/ ctx[7](this))) /*selectImage*/ ctx[7](this).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div0,
    						"keydown",
    						function () {
    							if (is_function(/*selectImage*/ ctx[7](this))) /*selectImage*/ ctx[7](this).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"click",
    						function () {
    							if (is_function(/*selectImage*/ ctx[7](this))) /*selectImage*/ ctx[7](this).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"keydown",
    						function () {
    							if (is_function(/*selectImage*/ ctx[7](this))) /*selectImage*/ ctx[7](this).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div2,
    						"click",
    						function () {
    							if (is_function(/*selectImage*/ ctx[7](this))) /*selectImage*/ ctx[7](this).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div2,
    						"keydown",
    						function () {
    							if (is_function(/*selectImage*/ ctx[7](this))) /*selectImage*/ ctx[7](this).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const modal_changes = {};
    			if (dirty & /*open*/ 16) modal_changes.isOpen = /*open*/ ctx[4];

    			if (dirty & /*$$scope, handleSave, friction, ease, pixelSize, mouseRadius*/ 65615) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			destroy_component(button0);
    			destroy_component(button1);
    			if (detaching) detach_dev(t10);
    			destroy_component(modal, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let mouseRadius = 5000;
    	let pixelSize = 5;
    	let ease = 0.05;
    	let friction = 0.7;
    	let open = false;

    	const toggle = () => {
    		$$invalidate(4, open = !open);
    	};

    	let effect;
    	let handleSave;
    	var canvas;
    	var ctx;
    	let selectImage;
    	let createEffect;

    	window.addEventListener("load", () => {
    		function drawOnCanvas() {
    			canvas = document.getElementById("canvas");
    			ctx = canvas.getContext("2d", { willReadFrequently: true });
    			canvas.width = window.innerWidth;
    			canvas.height = window.innerHeight;

    			// each particle will be a pixel in the image
    			// break the image into individual pieces, at the same time
    			// these particles will react to mouse in a dynamic way with friction and physics
    			class Particle {
    				constructor(effect, x, y, color) {
    					this.effect = effect; // does not create a copy, just a reference to the memory of Effect class

    					// determines initial position of particles
    					this.x = Math.random() * this.effect.width; // spread particles around canvas at initial page load

    					this.y = Math.random() * this.effect.height;

    					// original coordinate of pixel before starting to move
    					// round down so anti-aliasing isnt needed, improves performance
    					this.originX = Math.floor(x);

    					this.originY = Math.floor(y);
    					this.color = color;
    					this.size = this.effect.gap; // each particle rectangle will be size x size pixels

    					// random value between -1 and +1
    					// this.velocityX = Math.random() * 2 - 1;
    					// this.velocityY = Math.random() * 2 - 1;
    					this.velocityX = 0;

    					this.velocityY = 0;
    					this.distanceX = 0;
    					this.distanceY = 0;
    					this.distance = 0;
    					this.force = 0;
    					this.angle = 0;
    					this.friction = friction; // higher value = less friction, particles get pushed further
    					this.ease = ease; // controls speed particles return to origin
    				}

    				draw(context) {
    					context.fillStyle = this.color;
    					context.fillRect(this.x, this.y, this.size, this.size);
    				}

    				update() {
    					this.distanceX = this.effect.mouse.x - this.x;
    					this.distanceY = this.effect.mouse.y - this.y;

    					// not using Math.sqrt for pythagoran distance because its an expensive operation,
    					// instead just set mouse radius to large value
    					this.distance = this.distanceX * this.distanceX + this.distanceY * this.distanceY;

    					// force pushing particles = mouse radius:distance of the particle to that mouse cursor
    					this.force = -this.effect.mouse.radius / this.distance;

    					if (this.distance < this.effect.mouse.radius) {
    						this.angle = Math.atan2(this.distanceY, this.distanceX);
    						this.velocityX += this.force * Math.cos(this.angle);
    						this.velocityY += this.force * Math.sin(this.angle);
    					}

    					// *= lets the particles return to original position
    					this.x += (this.velocityX *= this.friction) + (this.originX - this.x) * this.ease;

    					this.y += (this.velocityY *= this.friction) + (this.originY - this.y) * this.ease;
    				}

    				warp() {
    					this.x = Math.random() * this.effect.width;
    					this.y = Math.random() * this.effect.height;
    				} // this.ease = Math.random() * (0.05 - 0.01) + 0.01; // random number between 0.01 to 0.05
    			}

    			class Effect {
    				constructor(width, height) {
    					this.width = width;
    					this.height = height;
    					this.particlesArray = [];

    					// this.image = image;
    					this.image = document.getElementById("image");

    					this.centerX = this.width * 0.5;
    					this.centerY = this.height * 0.5;
    					this.x = this.centerX - this.image.width * 0.5;
    					this.y = this.centerY - this.image.height * 0.5;
    					this.gap = pixelSize; // higher value = better performance but bigger paricle chunk

    					this.mouse = {
    						radius: mouseRadius,
    						x: undefined,
    						y: undefined
    					};

    					canvas.addEventListener("touchmove", event => {
    						this.mouse.x = event.touches[0].clientX;
    						this.mouse.y = event.touches[0].clientY;
    					});

    					canvas.addEventListener("mousemove", event => {
    						this.mouse.x = event.x;
    						this.mouse.y = event.y;
    					});
    				}

    				init() {
    					// step 1: draw image on canvas
    					ctx.drawImage(this.image, Math.floor(canvas.width * 0.5 - this.image.width * 0.5), Math.floor(canvas.height * 0.5 - this.image.height * 0.5));

    					// step 2: analyse canvas for pixel data
    					const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    					// step 3: loop through pixels
    					for (let y = 0; y < this.height; y += this.gap) {
    						for (let x = 0; x < this.width; x += this.gap) {
    							// x4 because each pixel is represented by 4 consecutive values in the unsigned 8 bit clamped array
    							const index = (y * this.width + x) * 4;

    							const red = pixels[index];
    							const green = pixels[index + 1];
    							const blue = pixels[index + 2];
    							const alpha = pixels[index + 3];
    							const color = `rgb(${red}, ${green}, ${blue})`;

    							// only if pixel is not transparent
    							if (alpha > 0) {
    								this.particlesArray.push(new Particle(this, x, y, color));
    							}
    						}
    					}
    				}

    				draw(context) {
    					this.particlesArray.forEach(particle => particle.draw(context));
    				}

    				update() {
    					this.particlesArray.forEach(particle => particle.update());
    				}

    				warp() {
    					this.particlesArray.forEach(particle => particle.warp());
    				}

    				destroy() {
    					this.particlesArray.forEach(particle => Object.keys(particle).forEach(prop => delete particle[prop]));
    				}
    			}

    			createEffect = () => {
    				if (effect) {
    					effect.destroy();
    					$$invalidate(5, effect = null);
    				}

    				$$invalidate(5, effect = new Effect(canvas.width, canvas.height));
    				effect.init();
    			};

    			function animate() {
    				ctx.clearRect(0, 0, canvas.width, canvas.height);
    				effect.draw(ctx);
    				effect.update();
    				requestAnimationFrame(animate);
    			}

    			$$invalidate(6, handleSave = () => {
    				ctx.clearRect(0, 0, canvas.width, canvas.height);
    				createEffect();
    				toggle();
    			});

    			$$invalidate(7, selectImage = option => {
    				// cannot take the img.src directly from the chosen option
    				// because it takes in the rendered size, not actual size
    				let imgId = option.getElementsByTagName('img')[0].id;

    				const img = document.getElementById("image");
    				img.src = imgSrc[imgId];

    				img.addEventListener("load", () => {
    					ctx.clearRect(0, 0, canvas.width, canvas.height);
    					createEffect();
    				});
    			});

    			createEffect();
    			animate();
    		}

    		const imageInput = document.getElementById("image-input");

    		imageInput.addEventListener("change", () => {
    			const img = document.getElementById("image");
    			const file = imageInput.files[0];
    			const reader = new FileReader();

    			reader.addEventListener("load", () => {
    				img.src = reader.result;

    				img.addEventListener("load", () => {
    					ctx.clearRect(0, 0, canvas.width, canvas.height);
    					createEffect();
    				});
    			});

    			if (file) {
    				reader.readAsDataURL(file);
    			}
    		});

    		drawOnCanvas();
    	});

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function slider0_value_binding(value) {
    		mouseRadius = value;
    		$$invalidate(0, mouseRadius);
    	}

    	function slider1_value_binding(value) {
    		pixelSize = value;
    		$$invalidate(1, pixelSize);
    	}

    	function slider2_value_binding(value) {
    		ease = value;
    		$$invalidate(2, ease);
    	}

    	function slider3_value_binding(value) {
    		friction = value;
    		$$invalidate(3, friction);
    	}

    	$$self.$capture_state = () => ({
    		Button,
    		Modal,
    		ModalBody,
    		ModalFooter,
    		ModalHeader,
    		Icon,
    		Slider,
    		imgSrc,
    		mouseRadius,
    		pixelSize,
    		ease,
    		friction,
    		open,
    		toggle,
    		effect,
    		handleSave,
    		canvas,
    		ctx,
    		selectImage,
    		createEffect
    	});

    	$$self.$inject_state = $$props => {
    		if ('mouseRadius' in $$props) $$invalidate(0, mouseRadius = $$props.mouseRadius);
    		if ('pixelSize' in $$props) $$invalidate(1, pixelSize = $$props.pixelSize);
    		if ('ease' in $$props) $$invalidate(2, ease = $$props.ease);
    		if ('friction' in $$props) $$invalidate(3, friction = $$props.friction);
    		if ('open' in $$props) $$invalidate(4, open = $$props.open);
    		if ('effect' in $$props) $$invalidate(5, effect = $$props.effect);
    		if ('handleSave' in $$props) $$invalidate(6, handleSave = $$props.handleSave);
    		if ('canvas' in $$props) canvas = $$props.canvas;
    		if ('ctx' in $$props) ctx = $$props.ctx;
    		if ('selectImage' in $$props) $$invalidate(7, selectImage = $$props.selectImage);
    		if ('createEffect' in $$props) createEffect = $$props.createEffect;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		mouseRadius,
    		pixelSize,
    		ease,
    		friction,
    		open,
    		effect,
    		handleSave,
    		selectImage,
    		toggle,
    		slider0_value_binding,
    		slider1_value_binding,
    		slider2_value_binding,
    		slider3_value_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
