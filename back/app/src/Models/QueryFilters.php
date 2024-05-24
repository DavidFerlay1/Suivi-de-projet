<?php

namespace App\Models;

class QueryFilters {
    public function __construct(private int|null $page, private array $sortSetting, private string $searchPattern){}

    public function getPage(): int {
        if(!$this->page)
            return 1;
        return $this->page;
    }

    public function getSortSetting(): array {
        return $this->sortSetting;
    }

    public function getSearchPattern(): string {
        return $this->searchPattern;
    }
}