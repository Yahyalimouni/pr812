<?php
require_once(dirname(__FILE__) . "/vendor/autoload.php");

use pr812\enrutador\Enrutador12;

$enrutador = new Enrutador12();
$enrutador->handleRequest();
?>