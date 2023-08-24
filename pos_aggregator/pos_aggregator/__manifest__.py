{
    "name": "POS Aggregator",
    "summary": "This Modules allow user to link the Aggregator POS with the Restaurant POS ",
    "category": "Point of Sale",
    "version": "16.0.1",
    "sequence": 1,
    "author": "Vivek Pabari",
    'license': 'AGPL-3',
    "website": "",
    "description": """""",
    "depends": [
        'pos_restaurant',
    ],
    "data": [
        'views/res_config_settings.xml',
    ],
    "application": True,
    "installable": True,
    "assets": {
        'point_of_sale.assets': [
            "/pos_aggregator/static/src/js/*.js",
            "/pos_aggregator/static/src/xml/*.xml"
        ],
    },
}
