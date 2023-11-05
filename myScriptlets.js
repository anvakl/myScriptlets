'use strict';

/// addEventListener-defuser2.js
/// alias aeld2.js
/// dependency run-at.fn 
/// dependency safe-self.fn
/// dependency should-debug.fn 
/// dependency should-log.fn
function addEventListenerDefuser2(
    type = '',
    pattern = '',
    selector = ''
) {
    const safe = safeSelf();
    const extraArgs = safe.getExtraArgs(Array.from(arguments), 3);
	console.log("extraArgs = ");
	console.log(extraArgs);
    const reType = safe.patternToRegex(type);
    const rePattern = safe.patternToRegex(pattern);
    const log = shouldLog(extraArgs);
    const debug = shouldDebug(extraArgs);
	const elems = document.querySelectorAll(selector);
    const trapEddEventListeners = ( ) => {
        const eventListenerHandler = {
            apply: function(target, thisArg, args) {
                let type, handler, targetElem;
				let matchesTarg = false;
                try {
                    type = String(args[0]);
                    handler = String(args[1]);
					taegetElem = thisArg;
                } catch(ex) {
                }
				for ( const elem of elems ) {
                  if(elem === thisArg){
                    matchesTarg = true;
                    break;
                  }
                }
                const matchesType = safe.RegExp_test.call(reType, type);
                const matchesHandler = safe.RegExp_test.call(rePattern, handler);
                const matchesEither = matchesType || matchesHandler || matchesTarg;
                const matchesBoth = matchesType && matchesHandler && matchesTarg;
                if ( log === 1 && matchesBoth || log === 2 && matchesEither || log === 3 ) {
					console.log(thisArg);
                    safe.uboLog(`addEventListener('${type}', ${handler})`);
                }
                if ( debug === 1 && matchesBoth || debug === 2 && matchesEither ) {
                    debugger; // jshint ignore:line
                }
                if ( matchesBoth ) { return; }
                return Reflect.apply(target, thisArg, args);
            },
            get(target, prop, receiver) {
                if ( prop === 'toString' ) {
                    return target.toString.bind(target);
                }
                return Reflect.get(target, prop, receiver);
            },
        };
        self.EventTarget.prototype.addEventListener = new Proxy(
            self.EventTarget.prototype.addEventListener,
            eventListenerHandler
        );
    };
    runAt(( ) => {
        trapEddEventListeners();
    }, extraArgs.runAt);
}
