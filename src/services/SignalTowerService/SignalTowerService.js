angular.module( 'spiral9.services.SignalTowerService', [] )
    .service( 'SignalTowerService', function SignalTowerService() {
        var CN = "SignalTowerService";

        var signalTowerService = {
            signals : {},
            createSignal : function createSignal( signalName ) {
                var newSignal = signalTowerService.signals[ signalName ];
                if( !newSignal ) {
                    newSignal = new Signal();
                    signalTowerService.signals[ signalName ] = newSignal;
                }
                return newSignal;
            },

            destroySignal : function destroySignal( signalName ) {
                var signalToDestroy = signalTowerService.signals[ signalName ];
                if( signalToDestroy ) {
                    signalToDestroy.dispose();
                    signalTowerService.signals[ signalName ] = null;
                }
            },

            dispatchSignal : function dispatchSignal( signalName, payload ) {
                var signalToDispatch = signalTowerService.signals[ signalName ];
                if( signalToDispatch ) {
                    signalToDispatch.dispatch( payload );
                }
            },

            subscribeToSignal : function subscribeToSignal( signalName, listener, listenerContext, priority ) {
                var signalSubscribedTo = signalTowerService.signals[ signalName ];
                if( !signalSubscribedTo ) {
                    signalSubscribedTo = signalTowerService.createSignal( signalName );
                }
                signalSubscribedTo.add( listener, listenerContext, priority );
                if( listenerContext && listenerContext.$on ) {
                    listenerContext.$on( '$destroy', function autoUnsubscribe() {
                        if( signalSubscribedTo ) {
                            signalSubscribedTo.remove( listener, listenerContext );
                        }
                    } );
                }
                return signalSubscribedTo;
            },

            subscribeToSignalOnce : function subscribeToSignalOnce( signalName, listener, listenerContext, priority ) {
                var signalSubscribedTo = signalTowerService.signals[ signalName ];
                if( !signalSubscribedTo ) {
                    signalSubscribedTo = signalTowerService.createSignal( signalName );
                }
                signalSubscribedTo.addOnce( listener, listenerContext, priority );
                if( listenerContext && listenerContext.$on ) {
                    listenerContext.$on( '$destroy', function autoUnsubscribe() {
                        if( signalSubscribedTo ) {
                            signalSubscribedTo.remove( listener, listenerContext );
                        }
                    } );
                }
                return signalSubscribedTo;
            },

            unSubscribeFromSignal : function unSubscribeFromSignal( signalName, listener, context ) {
                var signalToUnsubscribeFrom = signalTowerService.signals[ signalName ];
                if( signalToUnsubscribeFrom ) {
                    signalToUnsubscribeFrom.remove( listener, context );
                }
            }
        };

        // START : js-signals implementation
        /*
         * Below here is the js-signals implementation v1.0.0 (2012/11/29) from :
         *   https://github.com/millermedeiros/js-signals/
         *
         * The MIT License (MIT) is granted for the code between
         * http://opensource.org/licenses/mit-license.php
         * // START : js-signals implementation
         *    and
         * // END : js-signals implementation
         *
         */

        function SignalBinding( signal, listener, isOnce, listenerContext, priority ) {
            this._listener = listener;
            this._isOnce = isOnce;
            this.context = listenerContext;
            this._signal = signal;
            this._priority = priority || 0;
        }

        SignalBinding.prototype = {
            active : true,
            params : null,

            execute : function execute( paramsArr ) {
                var handlerReturn, params;
                if( this.active && !!this._listener ) {
                    params = this.params ? this.params.concat( paramsArr ) : paramsArr;
                    handlerReturn = this._listener.apply( this.context, params );
                    if( this._isOnce ) {
                        this.detach();
                    }
                }
                return handlerReturn;
            },

            detach : function detach() {
                return this.isBound() ? this._signal.remove( this._listener, this.context ) : null;
            },

            isBound : function isBound() {
                return (!!this._signal && !!this._listener);
            },

            isOnce : function isOnce() {
                return this._isOnce;
            },

            getListener : function getListener() {
                return this._listener;
            },

            getSignal : function getSignal() {
                return this._signal;
            },

            _destroy : function _destroy() {
                delete this._signal;
                delete this._listener;
                delete this.context;
            },

            toString : function toString() {
                return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
            }
        };

        function validateListener( listener, fnName ) {
            if( typeof listener !== 'function' ) {
                throw new Error( 'listener is a required param of {fn}() and should be a Function.'.replace( '{fn}',
                    fnName ) );
            }
        }

        function Signal() {
            this._bindings = [];
            this._prevParams = null;
            var self = this;
            this.dispatch = function() {
                Signal.prototype.dispatch.apply( self, arguments );
            };
        }

        Signal.prototype = {
            VERSION : '1.0.0',
            memorize : false,
            _shouldPropagate : true,
            active : true,
            _registerListener : function _registerListener( listener, isOnce, listenerContext, priority ) {
                var prevIndex = this._indexOfListener( listener, listenerContext ),
                    binding;
                if( prevIndex !== -1 ) {
                    binding = this._bindings[ prevIndex ];
                    if( binding.isOnce() !== isOnce ) {
                        throw new Error( 'You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.' );
                    }
                } else {
                    binding = new SignalBinding( this,
                        listener,
                        isOnce,
                        listenerContext,
                        priority );
                    this._addBinding( binding );
                }

                if( this.memorize && this._prevParams ) {
                    binding.execute( this._prevParams );
                }
                return binding;
            },

            _addBinding : function _addBinding( binding ) {
                var n = this._bindings.length;
                do {
                    --n;
                } while( this._bindings[ n ] && binding._priority <= this._bindings[ n ]._priority );
                this._bindings.splice( n + 1, 0, binding );
            },

            _indexOfListener : function _indexOfListener( listener, context ) {
                var n = this._bindings.length,
                    cur;
                while( n-- ) {
                    cur = this._bindings[ n ];
                    if( cur._listener === listener && cur.context === context ) {
                        return n;
                    }
                }
                return -1;
            },

            has : function has( listener, context ) {
                return this._indexOfListener( listener, context ) !== -1;
            },

            add : function add( listener, listenerContext, priority ) {
                validateListener( listener, 'add' );
                return this._registerListener( listener, false, listenerContext, priority );
            },

            addOnce : function addOnce( listener, listenerContext, priority ) {
                validateListener( listener, 'addOnce' );
                return this._registerListener( listener, true, listenerContext, priority );
            },

            remove : function remove( listener, context ) {
                validateListener( listener, 'remove' );

                var i = this._indexOfListener( listener, context );
                if( i !== -1 ) {
                    this._bindings[ i ]._destroy();
                    this._bindings.splice( i, 1 );
                }
                return listener;
            },

            removeAll : function removeAll() {
                var n = this._bindings.length;
                while( n-- ) {
                    this._bindings[ n ]._destroy();
                }
                this._bindings.length = 0;
            },

            getNumListeners : function getNumListeners() {
                return this._bindings.length;
            },

            halt : function halt() {
                this._shouldPropagate = false;
            },

            dispatch : function dispatch( params ) {
                if( !this.active ) {
                    return;
                }

                var paramsArr = Array.prototype.slice.call( arguments ),
                    n = this._bindings.length,
                    bindings;

                if( this.memorize ) {
                    this._prevParams = paramsArr;
                }
                if( !n ) {
                    return;
                }

                bindings = this._bindings.slice();
                this._shouldPropagate = true;
                do {
                    n--;
                } while( bindings[ n ] && this._shouldPropagate && bindings[ n ].execute( paramsArr ) !== false );
            },

            forget : function forget() {
                this._prevParams = null;
            },

            dispose : function dispose() {
                this.removeAll();
                delete this._bindings;
                delete this._prevParams;
            },

            toString : function toString() {
                return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
            }
        };
        // END : js-signals implementation

        return signalTowerService;
    } );