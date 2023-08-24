from odoo import models, fields, api


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    aggregation_pos = fields.Boolean(related='pos_config_id.aggregation_pos', string="Aggregation POS", readonly=False)
    aggregator_pos_id = fields.Many2one('pos.config', related='pos_config_id.aggregator_pos_id', string="Point Of Sale", readonly=False)
