<?php
namespace pr812\modelo;

use pr812\orm\ORMArticuloProveedor;

class Modelo12 {
    public function updateArtProv($nif, $referencia): array {
        $validatedData = $this->validateData();

        $ormInstance = new ORMArticuloProveedor();

        $primaryKey = [
            'nif' => $nif,
            'referencia' => $referencia
        ];
        
        return $ormInstance->update($primaryKey, $validatedData);
    }

    private function validateData(): array {
        $data = file_get_contents("php://input");
        $data = json_decode($data, true);

        if( !$data ) {
            throw new \Exception("Unfound data");
        }

        $sanitizationFilters = [
            'referencia' => FILTER_SANITIZE_SPECIAL_CHARS,
            'nif' => FILTER_SANITIZE_SPECIAL_CHARS,
            'precio_coste' => ['filter' => FILTER_SANITIZE_NUMBER_FLOAT, 'flags' => FILTER_FLAG_ALLOW_FRACTION],
            'dto_compra' => ['filter' => FILTER_SANITIZE_NUMBER_FLOAT, 'flags' => FILTER_FLAG_ALLOW_FRACTION],
            'und_compradas' => FILTER_SANITIZE_NUMBER_INT,
            'und_disponibles' => FILTER_SANITIZE_NUMBER_INT,
            'fecha_disponible' => FILTER_SANITIZE_SPECIAL_CHARS,
        ];

        $sanitizedData = filter_var_array($data, $sanitizationFilters);
        
        if( !$sanitizedData ) {
            throw new \Exception('Invalid data Format');
        }

        $validationFilters = [
            'referencia' => FILTER_DEFAULT,
            'nif' => FILTER_DEFAULT,
            'precio_coste' => [
                'filter' => FILTER_VALIDATE_FLOAT,
                'options' => ['min_range' => 0],
                'flags'=> FILTER_NULL_ON_FAILURE 
            ],
            'dto_compra' => [
                'filter' => FILTER_VALIDATE_FLOAT,
                'options' => ['min_range' => 0, 'max_range' => 1],
                'flags'=> FILTER_NULL_ON_FAILURE 
            ],
            'und_compradas' => FILTER_VALIDATE_INT,
            'und_disponibles' => FILTER_VALIDATE_INT,
            'fecha_disponible' => FILTER_DEFAULT
        ];

        $validatedData = filter_var_array($sanitizedData, $validationFilters);
    
        return array_filter($validatedData);
    }
}
?>