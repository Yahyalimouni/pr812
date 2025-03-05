<?php
namespace pr812\enrutador;

use Exception;
use pr812\enrutador\Ruta;
use pr812\modelo\Modelo12;

class Enrutador12 {
    private const AVAILABLE_VERBS = ["PATCH", "POST"];
    protected array $rutas = [];

    public function __construct() {
        $rutas = [];
        $this->itiniateRutas($rutas);
    }

    protected function itiniateRutas(array $rutas): void {
        // http://www.example.com/articulo_proveedor/{nif}/{referencia}
        $this->rutas[] = new Ruta("PATCH", "#^/articulo_proveedor/(\w+)/(\w+)$#", Modelo12::class, "updateArtProv");
    }
    
    public function handleRequest(): void {
        try {
            $verb = $this->getVerb();
            $path = $this->getPath();
    
            $ruta = $this->findRuta($verb, $path);
    
            $result = $this->executeRuta($ruta, $path);
    
            if( $result['success'] ) {
                header($_SERVER['SERVER_PROTOCOL'] . " " . $result['code']);
                header("Content-Type: application/json");

                echo json_encode($result);
            }
            else {
                $this->handleError($result);
            }
        }
        catch(Exception $e) {
            $this->handleError($e);
        }
    }

    protected function handleError($error) {
        $errorCodeMessage = $error instanceof Exception ? $error->getCode() . " " . $error->getMessage() : $error['code'];

        header($_SERVER['SERVER_PROTOCOL'] . " " . $errorCodeMessage);
        header("Content-Type: application/json");

        json_encode($error, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    protected function executeRuta(Ruta $ruta, string $path): array {
        $class = $ruta->getClass();
        $method = $ruta->getMethod();

        $params = $this->getParams($ruta->getPath(), $path);

        if( !$params ) {
            throw new Exception("Bad Request", 400);
        }

        if( !class_exists($class) || !method_exists($class, $method) ) {
            throw new Exception("Bad Request", 400);
        }

        $classInstance = new $class();
        $methodInstance = $classInstance->$method();

        return call_user_func_array([ $classInstance, $method ], $params);
    }

    protected function getParams(string $path, string $requestPath): array {
        preg_match($path, $requestPath, $params);

        array_shift($params);

        return $params;
    }

    protected function getPath(): string {
        $path = filter_var($_SERVER['REQUEST_URI'], FILTER_SANITIZE_SPECIAL_CHARS);

        $path = parse_url($path, PHP_URL_PATH);

        if (!$path) {
            throw new Exception("Bad Request", 400);
        }

        return $path;
    }

    protected function getVerb(): string {
        $verb = filter_var($_SERVER['REQUEST_METHOD'], FILTER_SANITIZE_SPECIAL_CHARS);

        if (!in_array($verb, self::AVAILABLE_VERBS)) {
            throw new Exception("Bad Request", 400);
        }

        return $verb;
    }

    protected function findRuta(string $verb, string $path): Ruta {
        foreach ($this->rutas as $ruta) {
            if ($ruta->match($verb, $path)) {
                return $ruta;
            }
        }

        throw new Exception("Bad Request", 400);
    }

    public function getRutas(): array {
        return $this->rutas;
    }
}
?>