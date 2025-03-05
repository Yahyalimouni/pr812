<?php
namespace pr812\enrutador;

class Ruta {
    protected string $verb;
    protected string $path;
    protected string $class;
    protected string $method;

    public function __construct(string $verb, string $path, string $class, string $method) {
        $this->verb = $verb;
        $this->path = $path;
        $this->class = $class;
        $this->method = $method;
    }

    public function getVerb(): string {
        return $this->verb;
    }

    public function getPath(): string {
        return $this->path;
    }

    public function getClass(): string {
        return $this->class;
    }

    public function getMethod(): string {
        return $this->method;
    }

    public function match(string $verb, string $path): bool {
        return $this->verb === $verb && preg_match($this->path, $path);
    }
}

?>