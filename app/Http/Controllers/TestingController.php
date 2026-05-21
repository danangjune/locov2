<?php

namespace App\Http\Controllers;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;

class TestingController extends Controller
{
    private function _makePaginate($items, $perPage = 5, $page = null)
    {
        $page = $page ?: (Paginator::resolveCurrentPage() ?: 1);
        $total = count($items);
        $currentpage = $page;
        $offset = ($currentpage * $perPage) - $perPage ;
        $itemstoshow = array_slice($items , $offset , $perPage);
        return new LengthAwarePaginator($itemstoshow ,$total   ,$perPage);
    }

    public function pagination()
    {
        $collection = array(
            ['id' => 1, 'name' => 'Laravel'],
            ['id' => 2, 'name' => 'CodeIgniter'],
            ['id' => 3, 'name' => 'Golang'],
            ['id' => 4, 'name' => 'Python'],
            ['id' => 5, 'name' => 'React'],
            ['id' => 6, 'name' => 'Vue'],
            ['id' => 7, 'name' => 'Angular'],
        );

        $data = $this->_makePaginate($collection);

        return response()->json($data);
    }
}
