<?php
namespace pr812\orm;

use PDO;
use PDOException;
class ORMArticuloProveedor {
    protected PDO $pdo;
    protected string $table = "articulo_proveedor";
    protected array $pk = ['nif', 'referencia'];

    public function __construct() {
        $dsn = "mysql:host=cpd.iesgrancapitan.org;port=9992;dbname=tiendaol;charset=utf8mb4";
        $username = "usuario";
        $password = "usuario";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_CASE => PDO::CASE_LOWER,
        ];

        $this->pdo = new PDO($dsn, $username, $password, $options);
    }

    public function update($primaryKey, $data): array {
        try {
            
            $sql = "UPDATE " . $this->table . " ";
            $setQuery = "SET ";
    
            $params = [];
    
            foreach($data as $key => $value) {
                $param = ":$key";
                $setQuery .= "$key = $param, ";
                
                $params[$param] = $value;
            }
            
            $setQuery = rtrim($setQuery, ', ');
    
            $setQuery .= " ";
            
            $whereQuery = "WHERE " . $this->pk[0] . " = :nif " . "AND " . $this->pk[1] . " = :referencia";
            
            $sql .= $setQuery;
            $sql .= $whereQuery;
    
            foreach($this->pk as $fk) {
                $params[":$fk"] =  $primaryKey[$fk];
            }
    
            $stmt = $this->pdo->prepare($sql);
            
            if($stmt->execute($params) && $stmt->rowCount() == 1) {
                $result = [
                    'success' => true,
                    'code' => '200 Ok',
                    'data' => null,
                    'error' => null
                ];
            }
            else {
                throw new \Exception('An error has occured while updating, Can be because of the same request', 5000);
            }
        } catch(\Exception $e) {
            $result = [
                'success' => false,
                'code' => '422 Unprocessable Entity',
                'data' => null,
                'error' => ['code' => $e->getCode(), 'message' => $e->getMessage()] 
            ];
        }

        return $result;
    }
}
?>