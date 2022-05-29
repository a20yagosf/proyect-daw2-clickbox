<?php
/* Smarty version 4.1.1, created on 2022-05-28 15:51:04
  from 'C:\xampp\htdocs\ProyectoModular\proyect-daw2\smarty\templates\factura_carrito.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '4.1.1',
  'unifunc' => 'content_629228c856fc92_10622816',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '3fd363f61319bf8a1ea7d15b873aef333e408600' => 
    array (
      0 => 'C:\\xampp\\htdocs\\ProyectoModular\\proyect-daw2\\smarty\\templates\\factura_carrito.tpl',
      1 => 1653742770,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_629228c856fc92_10622816 (Smarty_Internal_Template $_smarty_tpl) {
?><!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clickbox - Pedido <?php echo $_smarty_tpl->tpl_vars['id_pedido']->value;?>
</title>
</head>
<body style="width: 80%;margin: auto;padding: 0% 2%;font-size: 1.5em;">
    <table>
        <tr>
            <td rowspan="2"><img src="../../proyecto/img/logoClickBox2.svg" style="width: 250px;display: block;"/></td>
            <td>Usuario: <?php echo $_smarty_tpl->tpl_vars['email']->value;?>
</td>
        </tr>
        <tr>
            <td>Dirección: <?php echo $_smarty_tpl->tpl_vars['direccion']->value;?>
</td>
        </tr>
    </table>
    <p style="margin:auto"></p>
    <h1 style="text-align: center;color:#026a79">Clickbox - Pedido <?php echo $_smarty_tpl->tpl_vars['id_pedido']->value;?>
 (<?php echo $_smarty_tpl->tpl_vars['fecha_pedido']->value;?>
)</h1>
    <table style="width: 100%;padding: 1%;padding-bottom: 2%">
        <tbody>
            <tr>
                <th style="border-bottom: 1px solid #026a79;border-right: 1px solid #026a79;padding: 1%;color:#026a79;text-align: center;">Producto</th>
                <th style="border-bottom: 1px solid #026a79;border-right: 1px solid #026a79;padding: 1%;color:#026a79;text-align: center;">Cantidad</th>
                <th style="border-bottom: 1px solid #026a79;padding: 1%;color:#026a79;text-align: center;">Precio</th>
            </tr>
        <?php if ((isset($_smarty_tpl->tpl_vars['productos']->value))) {?>
            <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['productos']->value, 'producto', false, NULL, 'productos', array (
));
$_smarty_tpl->tpl_vars['producto']->do_else = true;
if ($_from !== null) foreach ($_from as $_smarty_tpl->tpl_vars['producto']->value) {
$_smarty_tpl->tpl_vars['producto']->do_else = false;
?>
            <tr>
                    <td style="border-right: 1px solid #026a79;padding: 1%;text-align: center;"><?php echo $_smarty_tpl->tpl_vars['producto']->value["nombre"];?>
</td>
                    <td style="border-right: 1px solid #026a79;padding: 1%;text-align: center;"><?php echo $_smarty_tpl->tpl_vars['producto']->value["unidades"];?>
</td>
                    <td style="padding: 1%;text-align: center;"><?php echo $_smarty_tpl->tpl_vars['producto']->value["precio"];?>
 €</td>
                </tr>
            <?php
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
        <?php }?>
        </tbody>
    </table>
    <table style="padding-top: 2%;">
        <tbody>
            <tr>
                <td style="border-top: 1px solid #026a79;padding: 1%;text-align: center;">Total</td>
                <td style="border-top: 1px solid #026a79;"></td>
                <td style="border-top: 1px solid #026a79;padding: 1%;text-align: center;"><?php echo $_smarty_tpl->tpl_vars['total']->value;?>
 €</td>
            </tr>
        </tbody>
    </table>
</body>
</html><?php }
}
