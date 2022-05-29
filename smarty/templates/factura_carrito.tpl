<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clickbox - Pedido {$id_pedido}</title>
</head>
<body style="width: 80%;margin: auto;padding: 0% 2%;font-size: 1.5em;">
    <table>
        <tr>
            <td rowspan="2"><img src="../../proyecto/img/logoClickBox2.svg" style="width: 250px;display: block;"/></td>
            <td>Usuario: {$email}</td>
        </tr>
        <tr>
            <td>Dirección: {$direccion}</td>
        </tr>
    </table>
    <p style="margin:auto"></p>
    <h1 style="text-align: center;color:#026a79">Clickbox - Pedido {$id_pedido} ({$fecha_pedido})</h1>
    <table style="width: 100%;padding: 1%;padding-bottom: 2%">
        <tbody>
            <tr>
                <th style="border-bottom: 1px solid #026a79;border-right: 1px solid #026a79;padding: 1%;color:#026a79;text-align: center;">Producto</th>
                <th style="border-bottom: 1px solid #026a79;border-right: 1px solid #026a79;padding: 1%;color:#026a79;text-align: center;">Cantidad</th>
                <th style="border-bottom: 1px solid #026a79;padding: 1%;color:#026a79;text-align: center;">Precio</th>
            </tr>
        {if isset($productos)}
            {foreach from=$productos item=producto name=productos}
            <tr>
                    <td style="border-right: 1px solid #026a79; border-bottom: 1px solid #026a79;padding: 1%;text-align: center;">{$producto["nombre"]}</td>
                    <td style="border-right: 1px solid #026a79; border-bottom: 1px solid #026a79;padding: 1%;text-align: center;">{$producto["unidades"]}</td>
                    <td style="padding: 1%; border-bottom: 1px solid #026a79;text-align: center;">{$producto["precio"]} €</td>
                </tr>
            {/foreach}
        {/if}
        </tbody>
    </table>
    <table style="padding-top: 2%;">
        <tbody>
            <tr>
                <td style="padding: 1%;text-align: center;">Total</td>
                <td></td>
                <td style="padding: 1%;text-align: center;">{$total} €</td>
            </tr>
        </tbody>
    </table>
</body>
</html>