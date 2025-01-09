<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['id', 'image', 'name', 'phone', 'division_id', 'position'];

    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}
