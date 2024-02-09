<?php
namespace App\Service;

class Router
{
    public function generatePath(string $action, ?array $params = []): string
    {
        $query = $action ? http_build_query(array_merge(['action' => $action], $params)) : null;
        $path = "/index.php" . ($query ? "?$query" : null);
        return $path;
    }

    public function redirect($path): void
    {
        header("Location: $path");
    }

    // Dodajemy nową metodę do generowania ścieżki dla akcji związanych z komentarzami
    public function generateCommentPath(string $action, ?array $params = []): string
    {
        $query = $action ? http_build_query(array_merge(['action' => "comment-$action"], $params)) : null;
        $path = "/index.php" . ($query ? "?$query" : null);
        return $path;
    }
}
