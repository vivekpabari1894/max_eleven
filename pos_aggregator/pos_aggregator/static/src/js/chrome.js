odoo.define('pos_aggregator.chrome', function (require) {
    'use strict';

    const Chrome = require('point_of_sale.Chrome');
    const Registries = require('point_of_sale.Registries');
    const {onMounted} = owl;
    var rpc = require('web.rpc');
    const POSAggregatorChrome = (Chrome) => class POSAggregatorChrome extends Chrome {
        async move_to() {
            debugger
            var data = this.env.pos.config.aggregator_pos_id[0]
            var self = this;
            if (!this.env.pos || this.env.pos.db.get_orders().length === 0) {
                rpc.query({
                    model: 'pos.config',
                    method: 'switch_to_another_session',
                    args: [data],
                }).then(res => {
                    if (this.env.pos.config.aggregation_pos) {
                        window.location = res.url + '&tc=1'
                    } else {
                        window.location = res.url
                    }


                })
            }

            if (this.env.pos.db.get_orders().length) {
                // If there are orders in the db left unsynced, we try to sync.
                // If sync successful, close without asking.
                // Otherwise, ask again saying that some orders are not yet synced.
                try {
                    await this.env.pos.push_orders();
                    // window.location = '/pos/ui?config_id='+data+'&tc=1';
                    rpc.query({
                        model: 'pos.config',
                        method: 'switch_to_another_session',
                        args: [data],
                    }).then(res => {
                        if (this.env.pos.config.aggregation_pos) {
                            window.location = res.url + '&tc=1'
                        } else {
                            window.location = res.url
                        }
                    })

                } catch (error) {
                    console.warn(error);
                    const reason = this.env.pos.failed
                        ? this.env._t(
                            'Some orders could not be submitted to ' +
                            'the server due to configuration errors. ' +
                            'You can exit the Point of Sale, but do ' +
                            'not close the session before the issue ' +
                            'has been resolved.'
                        )
                        : this.env._t(
                            'Some orders could not be submitted to ' +
                            'the server due to internet connection issues. ' +
                            'You can exit the Point of Sale, but do ' +
                            'not close the session before the issue ' +
                            'has been resolved.'
                        );
                    const {confirmed} = await this.showPopup('ConfirmPopup', {
                        title: this.env._t('Offline Orders'),
                        body: reason,
                    });
                    if (confirmed) {
                        this.state.uiState = 'CLOSING';
                        this.state.loadingSkipButtonIsShown = false;
                        // window.location = '/pos/ui?config_id='+data+'&tc=1';
                        rpc.query({
                            model: 'pos.config',
                            method: 'switch_to_another_session',
                            args: [data],
                        }).then(res => {
                            if (this.env.pos.config.aggregation_pos) {
                                window.location = res.url + '&tc=1'
                            } else {
                                window.location = res.url
                            }


                        })
                    }
                }
            }
        }

        get startScreen() {
            debugger
            var url = new URL(window.location.href);
            if (url.searchParams.get('tc')) {
                return {name: 'TicketScreen'};
            } else {
                return super.startScreen;
            }
        }
    };
    Registries.Component.extend(Chrome, POSAggregatorChrome);
});
