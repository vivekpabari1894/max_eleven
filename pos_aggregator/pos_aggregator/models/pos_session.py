from odoo import api, fields, models


class PosSession(models.Model):
    _inherit = 'pos.session'

    def _loader_params_pos_configs(self):
        """
            Purpose: To Load the Field in pos
        """
        result = super()._loader_params_pos_config()
        result['search_params']['fields'].extend(['aggregator_pos_id'])
        return result
