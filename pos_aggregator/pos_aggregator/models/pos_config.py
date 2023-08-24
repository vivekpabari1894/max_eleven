from odoo import models, fields, api


class PosConfig(models.Model):
    _inherit = 'pos.config'

    aggregation_pos = fields.Boolean(string="Aggregation POS", default=False)
    aggregator_pos_id = fields.Many2one('pos.config', string="Point Of Sale")

    
    def write(self, vals):
        if not self._context.get('prevent_recursion') and 'aggregator_pos_id' in vals and not vals.get('aggregator_pos_id'):
            self.aggregator_pos_id.with_context(prevent_recursion=True).aggregator_pos_id = vals.get('aggregator_pos_id')
        res= super().write(vals)
        if not self._context.get('prevent_recursion') and 'aggregator_pos_id' in vals and vals.get('aggregator_pos_id'):
            self.aggregator_pos_id.with_context(prevent_recursion=True).aggregator_pos_id = self.id
        return res

    def switch_to_another_session(self):
        res = self._action_to_open_ui()
        return res